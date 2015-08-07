(function() {
    var Easybook = function(el, options) {
        this.wrapper = $(el);
        this.options = {
            animateTime: '500ms',
            childSelector: null,
            defaultPage: 0
        };
        for (var name in options) {
            this.options[name] = options[name];
        };
        this.isAnimating = false;
        this.enabled = true;
        this._events = {};
        this.init();
    };
    var proto = Easybook.prototype;
    proto.init = function() {
        this._initDom();
        this.enable();
    };
    proto._initDom = function() {
        this.children = this.options.childSelector ? this.wrapper.find(this.options.childSelector) : this.wrapper.children();
        this.children.addClass('easybookPage');
        this.currentPageIndex = this.options.defaultPage || 0;
        this.currentPageDom = this._getCurrentPageDom();
        this.currentPageDom.addClass('current');
    };
    proto._bindEvent = function() {
        this.wrapper.on('swipeLeft', function() {
            this.next();
        }.bind(this)).on('swipeRight', function() {
            this.pre();
        }.bind(this));
        this.options.clickEnable && this.wrapper.on('click', function(e) {
            if (e.layerX <= this.wrapper.width() / 3) {
                this.pre();
            } else if (e.layerX >= this.wrapper.width() * 2 / 3) {
                this.next();
            };
            e.preventDefault();
        }.bind(this));
    };
    proto._removeEvent = function() {
        this.wrapper.off('swipeLeft').off('swipeRight').off('click');
    };
    proto.next = function() {
        this.turn(this.currentPageIndex + 1);
    };
    proto.pre = function() {
        this.turn(this.currentPageIndex - 1);
    };
    proto.turn = function(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.children.length) {
            console.warn(pageIndex + '超出范围');
            return;
        };
        if (this.isAnimating) {
            console.warn('执行中');
            return;
        };
        console.log([this.currentPageIndex + '--->' + pageIndex]);
        this.nextPageIndex = pageIndex;
        this.nextPageDom = this._getPageDom(pageIndex);
        this.currentPageDom = this._getCurrentPageDom();
        this._start();
    };
    proto.enable = function() {
        this.enabled = true;
        this._bindEvent();
    };
    proto.disable = function() {
        this.enabled = false;
        this._removeEvent();
    };
    proto.refresh = function() {
        this.children = this.options.childSelector ? this.wrapper.find(this.options.childSelector) : this.wrapper.children();
        this.children.addClass('easybookPage');
    };
    proto.destory = function() {
        this._removeEvent();
        console.log('---destory---');
    };
    proto._animate = function() {
        console.log('---animate---');
        if (this.nextPageIndex > this.currentPageIndex) {
            this.currentPageDom.on('webkitAnimationEnd', this._end.bind(this)).css({
                '-webkit-animation-duration': this.options.animateTime,
                'animation-duration': this.options.animateTime
            }).addClass('animate');
            this.nextPageDom.addClass('animateCover');
        } else {
            this.nextPageDom.on('webkitAnimationEnd', this._end.bind(this)).css({
                '-webkit-animation-duration': this.options.animateTime,
                'animation-duration': this.options.animateTime
            }).addClass('animateBack');
            this.currentPageDom.addClass('animateCover');
        };
    };
    proto._animateEnd = function() {
        console.log('---animateEnd---');
        if (this.nextPageIndex > this.currentPageIndex) {
            this.currentPageDom.removeClass('animate').off('webkitAnimationEnd').css({
                '-webkit-animation-duration': null,
                'animation-duration': null
            });
            this.nextPageDom.removeClass('animateCover');
        } else {
            this.nextPageDom.removeClass('animateBack').off('webkitAnimationEnd').css({
                '-webkit-animation-duration': null,
                'animation-duration': null
            });
            this.currentPageDom.removeClass('animateCover');
        };
    };
    proto._start = function() {
        console.log('---start---');
        this._execEvent('start');
        this.isAnimating = true;
        this._animate();
    };
    proto._end = function() {
        this._animateEnd();
        this.currentPageDom.removeClass('current');
        this.nextPageDom.addClass('current');
        this.currentPageDom = this.nextPageDom;
        this.nextPageDom = null;
        this.currentPageIndex = this.nextPageIndex;
        this.nextPageIndex = null;
        this.isAnimating = false;
        this._execEvent('end', this.currentPageIndex);
        console.log('---end---');
    };
    proto._getCurrentPageDom = function() {
        return this._getPageDom(this.currentPageIndex);
    };
    proto._getPageDom = function(pageIndex) {
        return this.children.eq(pageIndex);
    };
    proto.on = function(type, fn) {
        if (!this._events[type]) {
            this._events[type] = [];
        }
        this._events[type].push(fn);
    };
    proto.off = function(type, fn) {
        if (!this._events[type]) {
            return;
        }
        var index = this._events[type].indexOf(fn);
        if (index > -1) {
            this._events[type].splice(index, 1);
        }
    };
    proto._execEvent = function(type) {
        if (!this._events[type]) {
            return;
        }
        var i = 0,
            l = this._events[type].length;
        if (!l) {
            return;
        }
        for (; i < l; i++) {
            this._events[type][i].apply(this, [].slice.call(arguments, 1));
        }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Easybook;
    } else if (typeof define === 'function' && define.amd) {
        define('Easybook', [], function() {
            return Easybook;
        });
    } else {
        window.Easybook = Easybook;
    };
})();