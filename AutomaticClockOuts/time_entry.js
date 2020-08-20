const moment = require("moment")

class TimeEntry {

    constructor(timeEntry) {
        this.timeEntry = timeEntry;
    }

    getMidnightInTimeEntryZone(){
        return moment(this.timeEntry.start_date).utc()
            .subtract(this.timeEntry.timezone_offset, 'minutes').endOf('day')
    }

    getCurrentTimeInTimeEntryZone(){
        return moment().utc().subtract(this.timeEntry.timezone_offset, 'minutes')
    }

    getTimeToClockOut(){
        return moment(this.timeEntry.start_date).utc().endOf('day')
            .add(this.timeEntry.timezone_offset, 'minutes').toISOString()
    }

    needsToBeClockedOut(){
        return this.getMidnightInTimeEntryZone().isBefore(this.getCurrentTimeInTimeEntryZone())
    }
}

module.exports = TimeEntry

