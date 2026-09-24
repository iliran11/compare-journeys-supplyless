# Export TC ride rules for MongoDB Compass

Requires Node.js 22.12+ and the project's installed dependencies.

1. Set `SUPPLIER_ID` and `TOKEN` at the top of `duplicate-ride-rules.js`.
2. Run `node duplicate-ride-rules/duplicate-ride-rules.js`, or open that file and press F5 in VS Code.
3. Open `duplicate-ride-rules/output/<supplierId>/<timestamp>/compass-insert.js` and copy its contents. In Compass, open the `riderules` collection, choose **Add Data → Insert Document**, select **Shell Syntax**, and paste the array.

The script uses `BASE_URL` and `COMMON_SEARCH_CONFIG.tcSupplierId` from `app/config.js`. The token needs `superadmin` access to read supplier and operator mappings. A token with or without the `Bearer ` prefix is accepted.

It reads all ride rules and filters by `conditions.supplier`. It also reads `GET /_api/inventory/v1/supplier-api/general/all-suppliers` to resolve the supplier name and `GET /_api/inventory/v1/supplier-api/<name>/companies-mapping` for the supplier's mapped Bookaway operator IDs. It writes local files only.

Rules without operator restrictions are scoped to that supplier's mapped operators. Existing operator restrictions, priorities, and source labels remain unchanged. Empty route conditions are omitted because the backend does not treat empty arrays as unrestricted conditions. Export stops if no mapped operators are available.

Each copy replaces the root `_id` with `migratedRideRuleId`, switches the supplier to TC, and sets both timestamps to the guide's `2025-07-31T14:00:00.000Z`. The output is a shell-syntax array using `ObjectId()` and `ISODate()`, rather than strict JSON. Compass generates a new root `_id` on insertion. Mixed attribute values are preserved as returned by the API; their original BSON types cannot be inferred from ordinary JSON.

The script writes a single import file containing all rules for the supplied supplier, without logging. Each supplier is assumed to be migrated once.

Every document includes a shared `migrationBatchId` in the form `<supplierId>-<export timestamp>`. Filter by `{ migrationBatchId: "<batch ID>" }` in Compass to find one export round. This field is applied when the file is imported; changing the file does not update documents already in MongoDB.

Direct Compass imports do not publish the API's rule-created event. Applying rules to existing inventory remains the separate step described in the migration guide.

The implementation is one function with one `try/catch`, no helper files, and no changes to the source rule objects.
