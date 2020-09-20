const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const axios = require('axios');
const MsalClient = require('./msal_client')

const doClockOut = async (context, timer) => {
  context.log(`I am going to check how many entries were not clocked out ${new Date()}`);
  const {endpoint, key, databaseId, containerId, azureEndpoint} = config;
  const client = new CosmosClient({endpoint, key});
  const database = client.database(databaseId);
  const container = database.container(containerId);
  const response = await MsalClient.findUsersInMS();
  const users = response.data.value;

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
      context.log(`I am going to clock out ${JSON.stringify(timeEntryAsJson)}`);
      timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
      console.log(`I am doing it for you ${JSON.stringify(findUser(users, timeEntry.owner_id))}`)
      axios.post(process.env["SLACK_WEBHOOK"],
        {"text": `I am doing it for you ${JSON.stringify(findUser(users, timeEntry.owner_id))}`}
      )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(JSON.stringify(timeEntry))
      totalClockOutsExecuted++
    }
  }));
  context.log(`I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`);
}

const findUser = (users, id) => {
  return users.find( user => user.objectId === id)
}

module.exports = { doClockOut };
