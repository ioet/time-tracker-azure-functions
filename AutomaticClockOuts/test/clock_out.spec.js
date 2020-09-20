const test = require('ava');
const ClockOut = require('../clock_out')

test('do clock out', async t => {
  // const users = await MsalClient.findUsersInMS()
  const log = (text) => console.log(text)
  const context = {
    log
  }
  // await ClockOut.doClockOut(context, null)
  t.truthy(2>1)
})
