const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const TimeEntry = require('./time_entry');
const axios = require('axios');
const MsalClient = require('./msal_client');
const ClockOut = require('./clock_out');

module.exports = async function (context, myTimer) {
    await ClockOut.doClockOut(context, myTimer)
};
