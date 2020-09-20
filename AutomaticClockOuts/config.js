const config = {
    endpoint: "https://time-tracker-db.documents.azure.com:443/",
    key: process.env["COSMOS_DB_KEY"],
    databaseId: "time-tracker-db",
    containerId: "time_entry",
    partitionKey: { kind: "Hash", paths: ["/category"] },
    client_id: process.env["MS_CLIENT_ID"],
    authority: process.env["MS_AUTHORITY"],
    clientSecret: process.env["MS_CLIENT_SECRET"]
};

module.exports = config;
