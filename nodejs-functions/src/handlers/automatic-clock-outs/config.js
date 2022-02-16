const config = {
    endpoint: process.env["ENDPOINT"],
    key: process.env["KEY"],
    databaseId: "time-tracker-db",
    partitionKey: { kind: "Hash", paths: ["/category"] },
    clientId: process.env["CLIENT_ID"],
    authority: process.env["AUTHORITY"],
    clientSecret: process.env["CLIENT_SECRET"],
    slackApiToken: process.env["SLACK_TOKEN_NOTIFY"],
    userNameMS: process.env["USER_NAME_MS"],
    userPasswordMS: process.env["USER_PASSWORD_MS"]
    
};

module.exports = config;
