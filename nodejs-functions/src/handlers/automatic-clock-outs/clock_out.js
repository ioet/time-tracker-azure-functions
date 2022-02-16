const _ = require('lodash');
const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const TimeEntry = require('./time_entry');
const MsalClient = require('./msal_client');
const TimeEntryDao = require('./time_entry_dao');
const SlackClient = require('./slack_client');
const { CLOCK_OUT_MESSAGE, CLOCK_OUT_MESSAGE_MIDNIGHT } = require('./constants');

const doClockOut = async (context) => {
  console.log(
    `I am going to check how many entries were not clocked out ${new Date()}`
  );

  const { endpoint, key, databaseId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container('time_entry');
  const timeEntryDao = new TimeEntryDao(database);

  const response = await MsalClient.findUsersInMS();
  const users = response.data;
  const slackUsers = await SlackClient.findUsersInSlack();

  const { resources: entries } = await timeEntryDao.getEntriesWithNoEndDate();
  console.log(`Checking for time-entries that need to be clocked out`);

  let totalClockOutsExecuted = 0;

  await Promise.all(
    entries.map(async (timeEntryAsJson) => {
      const timeEntry = new TimeEntry(timeEntryAsJson);
      const { userName, userEmail } = findUserData(users, timeEntry.timeEntry.owner_id);
      const userId = findSlackUserId(slackUsers, userEmail);
      if( userEmail === 'carlos.carvajal@ioet.com'){
        if (timeEntry.needsToBeClockedOut()) {
          if (userId) {
            SlackClient.sendMessageToUser(userId, CLOCK_OUT_MESSAGE.replace('%user_name%', userName));
          }
          timeEntryAsJson.end_date = timeEntry.getTimeToClockOut();
          await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson);
          totalClockOutsExecuted++;
        }
  
        else if (timeEntry.needsToBeClockedOutMidnight()) {
          if (userId) {
            SlackClient.sendMessageToUser(userId, CLOCK_OUT_MESSAGE_MIDNIGHT.replace('%user_name%', userName));
          }
          timeEntryAsJson.end_date = timeEntry.getTimeToClockOutMidnight();
          await container.item(timeEntryAsJson.id, timeEntryAsJson.tenant_id).replace(timeEntryAsJson);
          totalClockOutsExecuted++;
        }
      }

    })
  );

  console.log(
    `I just clocked out ${totalClockOutsExecuted} entries, thanks are not needed...`
  );
};


const findUserData = (users, id) => {
  const user = users.find((user) => user.id === id);
  return user ? { userName: user.name.split(' ')[0], userEmail: (user.email) } : {};
};

const findSlackUserId = (slackUsers, email) => {
  const user = slackUsers.find((slackUser) => slackUser.email === email);
  return user ? user.id : null;
};
doClockOut()
module.exports = { doClockOut };
