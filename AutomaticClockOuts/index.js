const CosmosClient = require("@azure/cosmos").CosmosClient;
const moment = require("moment")
const config = require("./config");
const TimeEntry = require('./time_entry');

module.exports = async function (context, myTimer) {

    context.log(`I am going to check how many entries were not clocked out ${new Date()}`);
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const QUERY_WITHOUT_END_DATE =
        "SELECT * FROM c WHERE (NOT IS_DEFINED(c.end_date) OR IS_NULL(c.end_date) = true)  AND IS_DEFINED(c.start_date)"

    const {resources: entries} = await container.items
        .query({query: QUERY_WITHOUT_END_DATE})
        .fetchAll();

    context.log(`Checking for time-entries that need to be clocked out`);
    let totalClockOutsExecuted = 0;
    await Promise.all(entries.map(async (timeEntryAsJson) => {
        const timeEntry = new TimeEntry(timeEntryAsJson)
        if (timeEntry.needsToBeClockedOut()) {
            context.log(`I am going to clock out ${JSON.stringify(timeEntryAsJson.id)}`);
            timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
            await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson)
            totalClockOutsExecuted++
        }
    }));
    context.log(`I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`);
};
