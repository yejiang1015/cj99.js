/**
 * @file template 过滤器
 * @Date: 2018-06-13 10:30:54
 * @Last Modified time: 2018-06-13 10:30:54
 */
if (template) {
  template.defaults.imports.dateFmt = function(val, fmt) {
    var date = new Date(Date.parse(val.replace(/-/g, '/')));
    var lFmt = fmt;
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };

    if (/(y+)/.test(lFmt)) {
      lFmt = lFmt.replace(
        RegExp.$1,
        date.getFullYear().substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(lFmt)) {
        lFmt = lFmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(String(o[k]).length)
        );
      }
    }
    return lFmt;
  };
  template.defaults.imports.stateFmt = function(val) {
    switch (Number(val)) {
      case 1:
        return '未开始';
        break;
      case 2:
        return '进行中';
        break;
      case 3:
        return '已结束';
        break;
    }
  };
  template.defaults.imports.groupFmt = function(val) {
    // 赛区
    switch (val) {
      case 'A':
        return 'LCK';
        break;
      case 'B':
        return 'LPL';
        break;
      case 'C':
        return 'LMS';
        break;
      default:
        return val;
    }
  };
}
