# Look and feel
backoffice system. Not a normal site. Prefer functionality and ease of navigation.

# Business situation:

Our goal is to transition supply from Bookaway to 12go. 

Today, 12GO supply is routed through a multi-layer flow of BAW → TC → 12GO, with substantial mapping, enrichment, and override logic required to make it usable in Bookaway. In practice, parity is not native yet — it is being maintained through translation layers on the Bookaway side, and also on the TC side, to bridge structural and functional gaps between the systems.

## How we will achieve it
1. Scripts - will help us 

# Way of conduct
1. Agent will never commit, will never push. Never start a server.
2. Those actions can be taken only by a human.
3. You will not place logic inside a views folder. 
4. Logic will be put in logic folder. one function per file (exemptions will be given by the human). if it's a hook, the filename should also start with "use..."
5. All date/time operations - use dayjs.

# SCRIPTS
Whenever writing scripts in ./scripts folder:
1. always have only 1 try ..catch clause.
2. Write the script in one function block. Do not create other files, other functions.
3. Functions will never mutate data. That's why drop all defensive programming pattern. have optimistic approach.
4. Do not add any logs until i ask to add.
5. Make it concise, short and human readable. i will have to understand it by myself and will run and debug it. So prefer readable code over comments.
6. As much as possible, use lodash functions in order to make the code more declerative.
7. Before starting to write the scripts - Ask me questions to understand if certain checks or logic is really necessary.
8. Avoid inline conditioning. Prefer procedural building an object line by line.


# Investigation sources

1. Bookaway Platform: /Users/lirancohen/projects/12go-platform
2. 12Go platform: /Users/lirancohen/projects/12go-platform

# Glossary

1. Bookaway - B2C brand of travelier
2. 12GO - A B2C brand that was acquired by travelier.
3. TC - Travelier connect. an attemp of travlier to create a platform that will centerlize search, inventory and booking for all other brands.
4. Consolidation - A business decision that was taken that 12go will become the central tech platform of travelier. TC will sunset. Bookaway frontend will continue to live, but all inventory will be drawn from 12go ultimately.
5. F3 - 12go native service.
6. Inventory types in BAW:
 6.1 online: We search against supplier endpoint in response in user requests. Baw entity: Transports
 6.2 synced lines - we scrape with jobs the supplier endpoint. then we create lines. bookings are against supplier api - entity: line, with isSupplierApi=true
 6.3 Manual lines - whole booking process is against BAW local system. entity: Line, with isSupplierApi=false
7. Stats - 12go admin system
* Root: The main page. "/". Over there we are showing a list of routes, search all, and the KPIs
* Raw data - Data as it arrives from the platform backend. before any modifications.
* KPIS - set of calculations we are running over the raw data of each route, creating an overview of the health of the migration.
