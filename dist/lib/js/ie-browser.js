function getExplorerInfo() {
  var explorer = window.navigator.userAgent.toLowerCase();
  if (explorer.indexOf('msie') >= 0) {
    var ver = explorer.match(/msie ([\d.]+)/)[1];
    return { type: 'IE', version: ver };
  } else {
    return { type: false, version: false };
  }
}
window.onload = function() {
  if (getExplorerInfo().type && $) {
    var v = getExplorerInfo().version * 1;
    if (v == 7 || v == 8 || v == 9) {
      var html = '';
      html += '<div style="min-width: 980px;margin: auto;background-color: #ffd588;color: #333;text-align: center;font-size: 12px;padding: 12px 0;">';
      html += '<span>您当前浏览器版本过低，可能会影响您的正常浏览，建议您升级浏览器</span>';
      html += '<a target="_blank" style="color: #000; font-weight: bold" href="https://www.google.cn/intl/zh-CN/chrome/"> &nbsp;&nbsp;&nbsp;Chrome &nbsp;&nbsp;&nbsp;</a>';
      html += '<a target="_blank" style="color: #000; font-weight: bold" href="http://www.firefox.com.cn/">Firefox</a>';
      html += '</div>';
      console.log();
      $($('body').children()[0]).before($(html));
    }
  }
};
