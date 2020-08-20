const test = require('ava');
const TimeEntry = require('../time_entry');
const moment = require("moment")

const timeEntryAsJson = {
    "project_id": "f3630e59-9408-497e-945b-848112bd5a44",
    "start_date": "2020-08-19T03:45:12.935Z",
    "timezone_offset": 300,
    "technologies": ["github"],
    "id": "7b849fcc-78aa-468e-aa46-4bff2a0dcee9",
    "tenant_id": "cc925a5d-9644-4a4f-8d99-0bee49aadd05"
}

test('date is the day before with 23:59:59.999Z', t => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    t.is(timeEntry.getMidnightInTimeEntryZone().toISOString(), '2020-08-18T23:59:59.999Z');
})

test('Current time subtracts the offset in minutes', t => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    t.is(timeEntry.getCurrentTimeInTimeEntryZone().toISOString(), moment().utc()
        .subtract(timeEntryAsJson.timezone_offset, 'minutes').toISOString());
})

test('If entry starts in the past, then it needs to be clocked', t => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    t.truthy(timeEntry.needsToBeClockedOut());
})

test('Time to clock out is midnight + time offset (5 hours)', t => {
    const timeEntry = new TimeEntry(timeEntryAsJson)
    t.is(timeEntry.getTimeToClockOut(), '2020-08-20T04:59:59.999Z');
})

test('If entry starts in the future, then it does not need to be clocked', t => {
    const tomorrow = moment().add(1, 'day').toISOString()
    timeEntryAsJson.start_date = tomorrow;
    const timeEntry = new TimeEntry(timeEntryAsJson)
    t.falsy(timeEntry.needsToBeClockedOut());
})
