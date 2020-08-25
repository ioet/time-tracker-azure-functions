const ClockOut = require('./clock_out');

module.exports = async function (context, myTimer) {
    await ClockOut.doClockOut(context, myTimer)
};
