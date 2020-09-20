const axios = require("axios")
const msal = require('@azure/msal-node');

const findUsersInMS = async() => {
    const endpoint = 'https://graph.windows.net/ioetec.onmicrosoft.com'
    const config = {
        auth: {
            clientId: process.env["MS_CLIENT_ID"],
            authority: process.env["MS_AUTHORITY"],
            clientSecret: process.env["MS_CLIENT_SECRET"]
        }
    };

    console.log('---------------------------------------------')
    console.log(JSON.stringify(config))

    const cca = new msal.ConfidentialClientApplication(config);
    const clientCredentialRequest = {
        scopes: ['https://graph.windows.net/.default'],
    };
    const response = await cca.acquireTokenByClientCredential(clientCredentialRequest)
    const token = response.accessToken
    return axios.get(`${endpoint}/users?api-version=1.6&$select=displayName,otherMails,objectId`,
      { 'headers': { 'Authorization': token } })
}

module.exports = { findUsersInMS };

