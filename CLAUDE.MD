# Look and feel
backoffice system. Not a normal site. Prefer functionality and ease of navigation.

# Way of conduct
1. Agent will never commit, will never push. Never start a server.
2. Those actions can be taken only by a human.
3. You will not place logic inside a views folder. 
4. Logic will be put in logic folder. one function per file (exemptions will be given by the human). if it's a hook, the filename should also start with "use..."
5. All date/time operations - use dayjs.


# Glossary

* Root: The main page. "/". Over there we are showing a list of routes, search all, and the KPIs
* Raw data - Data as it arrives from the platform backend. before any modifications.
* KPIS - set of calculations we are running over the raw data of each route, creating an overview of the health of the migration.