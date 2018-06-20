/**
 * @version 1.0.0
 * @file cj99.js
 * @Author: yejiang
 * @Date: 2018-05-31 17:05:45
 * @Last Modified by: yejiang
 * @Last Modified time: 2018-06-20 16:23:31
 */
(function(global, factory) {
  if (!global.jQuery || !global.$) {
    console.error('jquery is not defined');
    return false;
  }
  global.cj99 = factory();
  global.cj99.IEBrowser();
})(window, function() {
  function cj99() {
    this.version = '1.0.0';
    this.swiperPic = 0;
  }
  
  cj99.prototype = {
    constructor: cj99,

    _getBrowserVision() {
      var explorer = window.navigator.userAgent.toLowerCase();
      if (explorer.indexOf('msie') >= 0) {
        var ver = explorer.match(/msie ([\d.]+)/)[1];
        return { type: 'IE', version: ver };
      } else {
        return { type: false, version: false };
      }
    },
    _isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    },
    _swiperMove(dom, value, speed) {
      dom.animate({ left: (this.swiperPic * value) + 'px' }, speed);
      // dom.css('left', (this.swiperPic * value) + 'px');
    },

    
    IEBrowser() {
      const _ie = this._getBrowserVision();
      if (_ie.type === 'IE' && _ie.version * 1 <= 9 ) {
        var html = '';
        html += '<div style="min-width: 980px;margin: auto;background-color: #ffd588;color: #333;text-align: center;font-size: 12px;padding: 12px 0;">';
        html += '<span>您当前浏览器版本过低，可能会影响您的正常浏览，建议您升级浏览器</span>';
        html += '<a target="_blank" style="color: #000; font-weight: bold" href="https://www.google.cn/intl/zh-CN/chrome/"> &nbsp;&nbsp;&nbsp;Chrome &nbsp;&nbsp;&nbsp;</a>';
        html += '<a target="_blank" style="color: #000; font-weight: bold" href="http://www.firefox.com.cn/">Firefox</a>';
        html += '</div>';
        $($('body').children()[0]).before($(html));
      }
    },

    toggle(a, b, c, callback) {
      /**!
       * arguments[0] 点击目标对象
       * arguments[1] 当前目标对象类名名
       * arguments[3] toggle切换目标对象
       * arguments[4] callback 可选参数
      */
      const args = arguments;

      if (args.length < 3) {
        console.error(args);
        return false;
      }
      if (!args[0].length) {
        console.error(`${args[0].selector} is null`);
        return false;
      }
      if (!args[2].length) {
        console.error(`${args[2].selector} is null`);
        return false;
      }
      $(args[0]).off('click').on('click', function() {
        $(this).addClass(args[1]).siblings().removeClass(args[1]);
        $(args[2]).hide().eq($(this).index()).fadeIn();
        if(callback) callback($(this));
      });
      
      $.each($(args[0]), function(index, value) {
        if (new RegExp(args[1]).test($(this).attr('class'))) {
          $(this).click();
        }
      });
    },

    scroll(options) {
      const defaults = {
        floor: [],
        top: '',
        active: ''
      }
      var opts = $.extend(defaults, options);

      if (!this._isArray(opts.floor)) {
        console.error('参数不合法');
        return false;
      }
      // 回到顶部
      if (opts.top) {
        $('.' + opts.top).off('click').on('click', function() {
          $('html,body').animate({ scrollTop: 0 }, 300);
        });
      }
      // 点击to滚到到by指定位置
      $.each(opts.floor, function(k, v) {
        $('.' + v.to).off('click').on('click', function() {
          $(this).addClass(opts.active).siblings().removeClass(opts.active);
          var sPos = $('.' + v.by).offset().top; // 为 0 回到顶部
          $('html,body').animate({ scrollTop: sPos }, 300);
        });
      });

      /**
       * scroll事件
       */
      var timer;
      var posTo = function() {
        var scrollTopS = window.scrollY;
        $.each(opts.floor, function(k, v) {
          var itemTop = $('.' + v.by).offset().top;
          if (scrollTopS >= itemTop) {
            $('.' + v.to).addClass(opts.active).siblings().removeClass(opts.active);
          }
        });
      };
      /**
      * 防抖
      */
      window.onscroll = function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          posTo();
        }, 100);
      };
    },

    swiper(current) {
      // ['river-swiper', 'river-prev', 'river-next', 'river-viewport', 'river-scroll', 'river-item'] // 规定默认dom
      const that = this;
      let flag = null;
      const $this = $('.river-swiper');
      const doms = {
        prev: $this.find('.river-prev'),
        next: $this.find('.river-next'),
        viewport: $this.find('.river-viewport'),
        scroll: $this.find('.river-scroll'),
        item: $this.find('.river-item')
      }
      $.each(doms, function(index, value) {
        if (!value.length) {
          flag = value;
          return false;
        }
      });
      if (flag) {
        console.error(`Can't find dom to $(${flag.selector})`);
        return false;
      };
      const viewportWidth = doms.viewport.width();
      let scrollWidth = 0;
      // 根据每次移动的数目和item总数计算总的可以移动几次
      const maxPic = Math.ceil(doms.item.length / (viewportWidth / doms.item.width())) - 1;

      $.each(doms.item, function(k, v) {
        var w = $(v).outerWidth(true); // 获取包含margin的总宽度
        scrollWidth += w;
      });
      doms.scroll.width(scrollWidth);
      doms.scroll.css('transition', 'all 0s');
      that.swiperPic = -Math.abs(current);

      // 初始化滚动位置
      that._swiperMove(doms.scroll, viewportWidth, 0);

      // 绑定点击事件
      doms.prev.off('click').on('click', function() {
        that.swiperPic += 1;
        if (that.swiperPic >= 0) {
          that.swiperPic = 0;
        }
        that._swiperMove(doms.scroll, viewportWidth, 400);
      })
      doms.next.off('click').on('click', function() {
        that.swiperPic -= 1;
        if (that.swiperPic <=  -maxPic) {
          that.swiperPic = -maxPic;
        }
        that._swiperMove(doms.scroll, viewportWidth, 400);
      })
      return $this;
    }
  }
  return new cj99();
});
