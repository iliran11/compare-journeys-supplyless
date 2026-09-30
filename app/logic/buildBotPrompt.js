import formatCompactSide from './formatCompactSide';

// `compact` is a transport-level digest; `raw` is the untouched search-service responses.
export default function buildBotPrompt(route, date, config, format) {
  if (format === 'raw') {
    return '#RAW RESULTS FROM TC\n' + JSON.stringify(route.rawTc, null, 2) +
      '\n\n#RAW RESULTS FROM BAW\n' + JSON.stringify(route.rawBaw, null, 2);
  }
  return [
    '# ' + route.fromSlug + ' → ' + route.toSlug + ' · ' + date + ' · BAW integration: ' + config.integrationName + ' (' + config.integration + ')',
    '# Times are local to each station. cutoff = minutes before departure. originalScore = ranking score (0 = no history).',
    '',
    formatCompactSide('TC (' + config.tcCode + ')', route.rawTc),
    '',
    formatCompactSide('BAW (' + config.bawCode + ')', route.rawBaw)
  ].join('\n');
}
