const moment = require("moment")

class TimeEntry {

  constructor(timeEntry) {
    this.timeEntry = timeEntry;
  }

  getStartTimeInUTC() {
    return moment(this.timeEntry.start_date).utcOffset(this.timeEntry.timezone_offset);
  }

  getTimeToClockOut() {
    return moment().utc().toISOString();
  }

  getMidnightInTimeEntryZone(){
    return moment(this.timeEntry.start_date).utc()
        .subtract(this.timeEntry.timezone_offset, 'minutes').endOf('day')
  }

  getCurrentTimeInTimeEntryZone(){
    return moment().utc().subtract(this.timeEntry.timezone_offset, 'minutes')
  }

  needsToBeClockedOut() {
    const currentTimeInUTC = moment().utc()
    const minutesRunning = moment.duration(currentTimeInUTC.diff(this.getStartTimeInUTC())).asMinutes()
    return minutesRunning > 720;
  }

  needsToBeClockedOutMidnight(){
    return this.getMidnightInTimeEntryZone().isBefore(this.getCurrentTimeInTimeEntryZone())
  }
}

module.exports = TimeEntry

