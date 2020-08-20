const config = {
    endpoint: "https://time-tracker-db.documents.azure.com:443/",
    key: process.env["COSMOS_DB_KEY"],
    databaseId: "time-tracker-db",
    containerId: "time_entry",
    partitionKey: { kind: "Hash", paths: ["/category"] }
};

module.exports = config;
