const _ = require('lodash');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const MsalClient = require('./msal_client');
const TimeEntryDao = require('./time_entry_dao');
const SlackClient = require('./slack_client');
const { CLOCK_OUT_MESSAGE } = require('./constants');

const doClockOut = async (context) => {
  context.log(`I am going to check how many entries were not clocked out ${new Date()}`);

  const { endpoint, key, databaseId } = config;
  const client = new CosmosClient({ endpoint, key });
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
      const userId = findSlackUserId(slackUsers, user_email);
      if(userId){
        usersWithClockOut.push("<@"+userId+">");
        SlackClient.sendMessageToUser(userId, CLOCK_OUT_MESSAGE);
      }
      timeEntryAsJson.end_date = timeEntry.getTimeToClockOut()
      await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson)
      totalClockOutsExecuted++
    }
  }));
  if (usersWithClockOut.length) {
    const ClockOutMessageChannel=`${CLOCK_OUT_MESSAGE} \n- ${usersWithClockOut.join('\n- ')}`;
    SlackClient.sendMessageToChannel(ClockOutMessageChannel);
  }
  context.log(`I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`);
}

const findUserEmail = (users, id) => {
  const user = users.find(user => user.objectId === id)
  return _.first(user.otherMails)
}

const findSlackUserId = (users, email) => {
  const user = users.find(user => user.email === email);
  return user ? user.id : null
}

doClockOut(console)

module.exports = { doClockOut };
