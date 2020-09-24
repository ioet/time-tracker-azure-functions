const config = {
    endpoint: "xxx",
    key: "xxx",
    databaseId: "time-tracker-db",
    containerId: "time_entry",
    partitionKey: { kind: "Hash", paths: ["/category"] },
    clientId: "xxx",
    authority: "xxx",
    clientSecret: "xxx",
    slackWebHook: "xxx"
};

module.exports = config;
