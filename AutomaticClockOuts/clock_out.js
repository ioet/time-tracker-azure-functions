const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const axios = require('axios');
const MsalClient = require('./msal_client')
const TimeEntryDao = require('./time_entry_dao')

const doClockOut = async (context) => {
  context.log(`I am going to check how many entries were not clocked out ${new Date()}`);

  const { endpoint, key, databaseId, slackWebHook } = config;
  const client = new CosmosClient({endpoint, key});
  const database = client.database(databaseId);
  const timeEntryDao = new TimeEntryDao(database);

  const response = await MsalClient.findUsersInMS();
  const users = response.data.value;
  const {resources: entries} = await timeEntryDao.getEntriesWithNoEndDate();
  context.log(`Checking for time-entries that need to be clocked out`);

  let totalClockOutsExecuted = 0;
  const usersWithClockOut = []
  await Promise.all(entries.map(async (timeEntryAsJson) => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    if (timeEntry.needsToBeClockedOut()) {
      usersWithClockOut.push(findUser(users, timeEntry.timeEntry.owner_id));
      timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
      await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson)
      totalClockOutsExecuted++
    }
  }));
  if(totalClockOutsExecuted > 0){
    axios.post(slackWebHook,
      {
        "text": `Hey guys, I did a clock out for you. \nPlease visit https://timetracker.ioet.com/ and set the right end time for your entries :pls: \n- ${usersWithClockOut.join('\n- ')}`
      }
    )
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        context.log(error);
      });
  }
  context.log(`I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`);
}

const findUser = (users, id) => {
  const user = users.find( user => user.objectId === id)
  return user.displayName
}

module.exports = { doClockOut };
