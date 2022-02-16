const axios = require('axios');
const config = require('./config');

const getToken = async () => {
  const { clientId, userNameMS, userPasswordMS } = config;
  const endpoint =
    'https://ioetec.b2clogin.com/ioetec.onmicrosoft.com/B2C_1_accesstoken/oauth2/v2.0/token';

  const params = new URLSearchParams();

  params.append('username', userNameMS);
  params.append('password', userPasswordMS);
  params.append('grant_type', 'password');
  params.append('scope', clientId);
  params.append('client_id', clientId);
  params.append('response_type', 'token');

  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return axios.post(endpoint, params, headers)
    .then((result) => {
      return result.data.access_token;
    })
    .catch((err) => {
      console.log(`Invalid request to: ${endpoint}`);
    });
};

const findUsersInMS = async () => {
  const endpoint = 'https://timetracker-api.azurewebsites.net/';
  const token = await getToken();

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.get(`${endpoint}/users`, headers);
};

module.exports = { findUsersInMS };