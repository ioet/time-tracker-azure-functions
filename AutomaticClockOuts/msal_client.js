const axios = require("axios")
const msal = require('@azure/msal-node');
const config = require("./config");

const findUsersInMS = async() => {
    const {clientId, authority, clientSecret} = config;
    const endpoint = 'https://graph.windows.net/ioetec.onmicrosoft.com'
    const configuration = {
        auth: {
            clientId: clientId,
            authority: authority,
            clientSecret: clientSecret
        }
    };

    const cca = new msal.ConfidentialClientApplication(configuration);
    const clientCredentialRequest = {
        scopes: ['https://graph.windows.net/.default'],
    };
    const response = await cca.acquireTokenByClientCredential(clientCredentialRequest)
    const token = response.accessToken
    return axios.get(`${endpoint}/users?api-version=1.6&$select=displayName,otherMails,objectId`,
      { 'headers': { 'Authorization': token } })
}

module.exports = { findUsersInMS };

