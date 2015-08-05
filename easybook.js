(function() {
    var Easybook = function(el, options) {
        this.wrapper = el;
        this.options = {
            animateTime: 1000,
            childSelector: null,
            defaultPage: 0
        };
        for (var name in options) {
            this.options[name] = options[name];
        };
        this.children = this.options.childSelector ? el.querySelectorAll(this.options.childSelector) : el.children ;
        this.currentPage = this.options.defaultPage || 0;
        this.children[this.currentPage].style.zIndex = 10;
        this.init();
    };
    var proto = Easybook.prototype;
    proto.init = function() {
        
    }
    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = Easybook;
    } else if (typeof define === 'function' && define.amd) {
        define('Easybook', [], function() {
            return Easybook;
        });
    } else {
        window.Easybook = Easybook;
    }
})();