const { WebClient, LogLevel } = require("@slack/web-api");
const { slackApiToken, channelId } = require("./config");
const client = new WebClient(slackApiToken, { logLevel: LogLevel.DEBUG });

const findUsersInSlack = async () => {
  const response = await client.users.list();
  let usersIdAndEmails = [];
  if (response.ok) {
    slackUsers = response.members;
    usersIdAndEmails = slackUsers
      .filter((user) => user.profile.hasOwnProperty("email") && !user.deleted)
      .map((user) => ({ id: user.id, email: user.profile.email }));
  }
  return usersIdAndEmails;
};

const sendMessage = (channel, message) => {
  const params = { channel: channel, text: message };
  client.chat.postMessage(params);
};

const sendMessageToUser = (userId, message) => {
  sendMessage(userId, message);
};

// message to public channel
const sendMessageToChannel = (message) => {
  sendMessage(channelId, message);
};

module.exports = { findUsersInSlack, sendMessageToUser, sendMessageToChannel };
