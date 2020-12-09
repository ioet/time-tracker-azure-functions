const test = require('ava');
const TimeEntry = require('../time_entry');
const moment = require("moment")

const timeEntryAsJson = {
  "project_id": "f3630e59-9408-497e-945b-848112bd5a44",
  "start_date": "2020-08-19T13:45:12.935Z",
  "timezone_offset": 300,
  "technologies": ["github"],
  "id": "7b849fcc-78aa-468e-aa46-4bff2a0dcee9",
  "tenant_id": "cc925a5d-9644-4a4f-8d99-0bee49aadd05"
}

test('If entry has been running for at least 12h, it needs to be clock out', t => {
  const twelveHoursAgo = moment().subtract(721, 'minutes');
  const entryTwelveHoursAgo = {...timeEntryAsJson, start_date: twelveHoursAgo.toISOString()}
  const timeEntry = new TimeEntry(entryTwelveHoursAgo)
  t.true(timeEntry.needsToBeClockedOut());
})

test('If entry has been running for at less than 12h, it does not need to be clock out', t => {
  const lessThanTwelveHoursAgo = moment().subtract(719, 'minutes');
  const entryLessThanTwelveHoursAgo = {...timeEntryAsJson, start_date: lessThanTwelveHoursAgo.toISOString()}
  const timeEntry = new TimeEntry(entryLessThanTwelveHoursAgo)
  t.false(timeEntry.needsToBeClockedOut());
})

test('If entry starts in the future, then it does not need to be clocked', t => {
    const tomorrow = moment().add(1, 'day').toISOString()
    const timeEntry = new TimeEntry({...timeEntryAsJson, start_date: tomorrow})
    t.false(timeEntry.needsToBeClockedOut());
})
