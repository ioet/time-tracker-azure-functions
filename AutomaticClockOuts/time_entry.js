const moment = require("moment")

class TimeEntry {

  constructor(timeEntry) {
    this.timeEntry = timeEntry;
  }

  getStartTimeInUTC() {
    return moment(this.timeEntry.start_date).utcOffset(this.timeEntry.timezone_offset);
  }

  getTimeToClockOut() {
    return moment().utc().subtract(this.timeEntry.timezone_offset, 'minutes').toISOString();
  }

  needsToBeClockedOut() {
    const currentTimeInUTC = moment().utc()
    const minutesRunning = moment.duration(currentTimeInUTC.diff(this.getStartTimeInUTC())).asMinutes()
    return minutesRunning > 720;
  }
}

module.exports = TimeEntry

