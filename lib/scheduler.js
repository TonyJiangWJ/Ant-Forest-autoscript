
let DateCompare = require('./DateCompare.js')
let {formatDate} = require('./DateUtil.js')
let {config} = require('../config.js')
let {commonFunctions} = require('./CommonFunction.js')
const Scheduler = function () {
  let sameDay = config.auto_start_same_day
  let clockTime = new Date();
  // 如果不是同一天，则将当前时间加24小时 获取第二天的日期
  if (!sameDay) {
    clockTime = new Date(clockTime.getTime() + 24 * 3600000)
  }
  // 设置启动时间为第二天的6:40:00
  clockTime.setHours(config.auto_start_hours)
  clockTime.setMinutes(config.auto_start_minutes)
  clockTime.setSeconds(config.auto_start_seconds)
  let clockTimeCompare = new DateCompare(clockTime)
  logInfo("启动定时：" + formatDate(clockTimeCompare.originDate, "yyyy-MM-dd HH:mm:ss"))

  let nowCompare = new DateCompare(new Date())
  while (nowCompare.compareTo(clockTimeCompare) < 0) {
    nowCompare = new DateCompare(new Date())
    logInfo("not now " + formatDate(nowCompare.originDate, "yyyy-MM-dd HH:mm:ss"));
    let gap = clockTime.getTime() - nowCompare.getTime();
    if (gap <= 0) {
      break;
    }
    logInfo("当前时间" + formatDate(new Date(nowCompare.getTime())))
    let leftMinutes = (gap / 60000).toFixed(2)
    logInfo("剩余时间[" + gap + "]ms [" + leftMinutes + "]分钟 [" + (gap / 3600000).toFixed(2) + "]小时")
    logInfo("睡眠" + leftMinutes + "分钟")
    commonFunctions.commonDelay(leftMinutes, "睡眠还有[")
  }
  logInfo("start")
}

module.exports = {
  scheduler: Scheduler
}