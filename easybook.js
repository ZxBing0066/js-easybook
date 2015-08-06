(function() {
    var Easybook = function(el, options) {
        this.wrapper = $(el);
        this.options = {
            animateTime: 1000,
            childSelector: null,
            defaultPage: 0
        };
        for (var name in options) {
            this.options[name] = options[name];
        };
        this.init();
    };
    var proto = Easybook.prototype;
    proto.init = function() {
        this._initDom();
        this._initEvent();
    };
    proto._initDom = function() {
        this.children = this.options.childSelector ? this.wrapper.find(this.options.childSelector) : this.wrapper.children();
        this.children.addClass('easybookPage');
        this.currentPageIndex = this.options.defaultPage || 0;
        this.currentPageDom = this.getCurrentPageDom();
        this.currentPageDom.addClass('current');
    };
    proto._initEvent = function() {
        this.wrapper.on('swipeLeft', function() {
            this.next();
        }.bind(this)).on('swipeRight', function() {
            this.pre();
        }.bind(this));
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
        console.log([this.currentPageIndex + '--->' + pageIndex]);
        this.nextPageIndex = pageIndex;
        this.nextPageDom = this.getPageDom(pageIndex);
        this.currentPageDom = this.getCurrentPageDom();
        this._start();
    };
    proto._start = function() {
        console.log('start');
        this.currentPageDom.on('webkitAnimationEnd', this._end.bind(this)).addClass(this.nextPageIndex > this.currentPageDom ? 'animate' : 'animateBack');
        this.nextPageDom.addClass('next');
    };
    proto._end = function() {
        console.log('end');
        this.currentPageDom.removeClass('animate animateBack current').off('webkitAnimationEnd');
        this.nextPageDom.removeClass('next').addClass('current');
        this.currentPageDom = this.nextPageDom;
        this.nextPageDom = null;
        this.currentPageIndex = this.nextPageIndex;
        this.nextPageIndex = null;
    };
    proto.getCurrentPageDom = function() {
        return this.getPageDom(this.currentPageIndex);
    };
    proto.getPageDom = function(pageIndex) {
        return this.children.eq(pageIndex);
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