const test = require('ava');
const MsalClient = require('../msal_client')

test('Response contains ioet.com since users has it as part their emails', async t => {
  const users = await MsalClient.findUsersInMS()

  t.truthy(JSON.stringify(users.data.value).includes("ioet.com"))
})
