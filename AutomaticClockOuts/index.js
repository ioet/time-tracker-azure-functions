const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const axios = require('axios');
const MsalClient = require('./msal_client');
const ClockOut = require('./clock_out');

module.exports = async function (context, myTimer) {
    context.log('starting.....................')
    await ClockOut.doClockOut(context, myTimer)
    // context.log(`I am going to check how many entries were not clocked out ${new Date()}`);
    // const {endpoint, key, databaseId, containerId, azureEndpoint} = config;
    // const client = new CosmosClient({endpoint, key});
    // const database = client.database(databaseId);
    // const container = database.container(containerId);
    // const users = await MsalClient.findUsersInMS();
    //
    // const QUERY_WITHOUT_END_DATE =
    //   "SELECT * FROM c WHERE (NOT IS_DEFINED(c.end_date) OR IS_NULL(c.end_date) = true)  AND IS_DEFINED(c.start_date)"
    //
    // const {resources: entries} = await container.items
    //   .query({query: QUERY_WITHOUT_END_DATE})
    //   .fetchAll();
    //
    // context.log(`Checking for time-entries that need to be clocked out`);
    // let totalClockOutsExecuted = 0;
    // await Promise.all(entries.map(async (timeEntryAsJson) => {
    //     const timeEntry = new TimeEntry(timeEntryAsJson)
    //     if (timeEntry.needsToBeClockedOut()) {
    //         context.log(`I am going to clock out ${JSON.stringify(timeEntryAsJson)}`);
    //         timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
    //         axios.post('https://hooks.slack.com/services/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',
    //           {"text": `Hey, we clocked-out for you yesterday at midnight, please make sure to update your entered data`}
    //         )
    //           .then(function (response) {
    //               console.log(response);
    //           })
    //           .catch(function (error) {
    //               console.log(error);
    //           });
    //         totalClockOutsExecuted++
    //     }
    // }));
    // context.log(`I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`);
};
