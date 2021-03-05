const _ = require('lodash');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const axios = require('axios');
const MsalClient = require('./msal_client');
const TimeEntryDao = require('./time_entry_dao');
const SlackClient = require('./slack_client');

const doClockOut = async (context) => {
  context.log(`I am going to check how many entries were not clocked out ${new Date()}`);

  const {endpoint, key, databaseId, slackWebHook} = config;
  const client = new CosmosClient({endpoint, key});
  const database = client.database(databaseId);
  const container = database.container('time_entry');
  const timeEntryDao = new TimeEntryDao(database);

  const response = await MsalClient.findUsersInMS();
  const users = response.data.value;
  const slackUsers = await SlackClient.findUsersInSlack();

  const {resources: entries} = await timeEntryDao.getEntriesWithNoEndDate();
  context.log(`Checking for time-entries that need to be clocked out`);

  let totalClockOutsExecuted = 0;
  const usersWithClockOut = [];
  await Promise.all(entries.map(async (timeEntryAsJson) => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    if (timeEntry.needsToBeClockedOut()) {
      const user_email = findUserEmail(users, timeEntry.timeEntry.owner_id);
      const userId = findSlackUserId(slackUsers,user_email);
      if(userId){
        usersWithClockOut.push("<@"+userId+">");
      }
      timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
      await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson)
      totalClockOutsExecuted++
    }
  }));
  if (usersWithClockOut.length) {
    axios.post(slackWebHook,
      {
        "text": `OMG, you have been working more than 12 hours in a row. \nPlease take a break and visit https://timetracker.ioet.com/ to set the right end time for your entries, we just did a clock out for you :wink: \n- ${usersWithClockOut.join('\n- ')}`
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

const findUserEmail = (users, id) => {
  const user = users.find(user => user.objectId === id)
  return _.first(user.otherMails)
}

const findSlackUserId = (users,email)=>{
  const user = users.find(user => user.email === email);
  return user? user.id:null
}

module.exports = {doClockOut};
