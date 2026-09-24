// Fill in these two values, then run this file with Node.js 22.12+ or VS Code.
// Writes a Compass import JSON file; no database writes are performed.
const SUPPLIER_ID = '60cf2e027ea1b80001552ba6';
const TOKEN = 'euq4W2395FBGBz9Tb8xcYyqgP9xgu7cKGPjyixHyrB3r9iovr7eBpVuDQjsb6kwDSs5vBGWn0tyvoEtPCiIMLTiOlwnyp6z2f6vp5zbjQyBj63toFBxyCt5SZXhbTvPtQmldqj1OajlhB67p9geufWb9XZZod0DQsBPVsozbOorKWmCeqxMquQNfWfPrdE83jYyk6gL2UYdVMWpspL05G758H4FLj6NOv8Pz9MeHaszlOwRBct0rUGt0NTlpgDJl';
if(!TOKEN) {
    throw Error("no token for bookaway!")
}

async function exportRideRules() {
  try {
    const Fs = require('node:fs/promises');
    const Path = require('node:path');
    const Crypto = require('node:crypto');
    const Dayjs = require('dayjs');
    const _ = require('lodash');
    const Config = require('../app/config.js');

    const token = TOKEN.trim();
    const authorization = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
    const response = await fetch(Config.BASE_URL + '/_api/inventory/ride-rules', {
      headers: { authorization, accept: 'application/json' }
    });
    if (!response.ok) throw new Error('GET ride-rules returned HTTP ' + response.status);
    const rules = await response.json();
    const supplierId = SUPPLIER_ID.toLowerCase();
    const tcSupplierId = Config.COMMON_SEARCH_CONFIG.tcSupplierId;
    const supplierRules = _.filter(rules, { conditions: { supplier: supplierId } });

    const supplierApiUrl = Config.BASE_URL + '/_api/inventory/v1/supplier-api';
    const suppliersResponse = await fetch(supplierApiUrl + '/general/all-suppliers', {
      headers: { authorization, accept: 'application/json' }
    });
    if (!suppliersResponse.ok) throw new Error('GET suppliers returned HTTP ' + suppliersResponse.status);
    const suppliers = await suppliersResponse.json();
    const supplier = _.find(suppliers, { supplierId });
    const mappingsResponse = await fetch(supplierApiUrl + '/' + encodeURIComponent(supplier.name) + '/companies-mapping', {
      headers: { authorization, accept: 'application/json' }
    });
    if (!mappingsResponse.ok) throw new Error('GET company mappings returned HTTP ' + mappingsResponse.status);
    const mappings = await mappingsResponse.json();
    const supplierOperatorIds = _.uniq(_.compact(_.map(mappings, 'bookawayData.companyId')));
    if (_.isEmpty(supplierOperatorIds)) throw new Error('No mapped operators found; cannot scope supplier rules to TC');

    const migrationDate = Dayjs('2025-07-31T14:00:00.000Z').toISOString();
    const exportTimestamp = Dayjs().format('YYYY-MM-DD_HH-mm-ss-SSS');
    const migrationBatchId = supplierId + '-' + exportTimestamp;
    const exportedRules = _.map(supplierRules, rule => {
      const isOperatorExpanded = _.isEmpty(rule.conditions.operator);
      const operatorIds = isOperatorExpanded ? supplierOperatorIds : rule.conditions.operator;
      const operators = _.map(operatorIds, id => ({ $oid: id }));
      // A supplier-level rule gains an operator condition here, so it must be re-scored as an
      // operator-level rule (supplier 16 + operator 8). Otherwise it ties with TC's own
      // supplier-level rule at priority 16 and the winner is undefined.
      const levelOverride = isOperatorExpanded ? { priority: rule.priority + 8, source: 'Operator' } : {};
      const routes = _.map(rule.conditions.routes, route => {
        const ids = _.pick(route, ['_id', 'fromCityId', 'toCityId']);
        const mongoIds = _.mapValues(ids, id => id && { $oid: id });
        return { ...route, ...mongoIds };
      });
      const attributes = _.map(rule.attributes, attribute => ({
        ...attribute,
        _id: attribute._id && { $oid: attribute._id }
      }));

      return {
        ..._.omit(rule, '_id'),
        ...levelOverride,
        migratedRideRuleId: { $oid: rule._id },
        migrationBatchId,
        conditions: {
          ..._.omit(rule.conditions, 'routes'),
          supplier: { $oid: tcSupplierId },
          operator: operators,
          ...(_.isEmpty(routes) ? {} : { routes })
        },
        attributes,
        createdAt: { $date: migrationDate },
        updatedAt: { $date: migrationDate }
      };
    });

    const shellValues = new Map();
    const placeholderPrefix = Crypto.randomUUID();
    let shellText = JSON.stringify(exportedRules, (key, value) => {
      if (!value || typeof value !== 'object' || Object.keys(value).length !== 1) return value;
      const constructor = value.$oid ? 'ObjectId' : value.$date ? 'ISODate' : null;
      if (!constructor) return value;
      const placeholder = placeholderPrefix + '-' + shellValues.size;
      const argument = JSON.stringify(value.$oid || value.$date);
      shellValues.set(JSON.stringify(placeholder), constructor + '(' + argument + ')');
      return placeholder;
    }, 2);
    for (const [placeholder, expression] of shellValues) {
      shellText = shellText.replace(placeholder, expression);
    }

    const directory = Path.join(__dirname, 'output', supplierId, exportTimestamp);
    await Fs.mkdir(directory, { recursive: true });
    await Fs.writeFile(Path.join(directory, 'compass-insert.js'), shellText);
  } catch (error) {
    throw new Error('Ride-rule export failed: ' + error.message);
  }
}

exportRideRules();
