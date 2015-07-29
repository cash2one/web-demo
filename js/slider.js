/*
 * to8to-webframework
 * description: 
 * version - v1.0 2015/7/29 0029
 * author carl.wu<carl.wu@corp.to8to.com>
 * http://www.to8to.com/
 * 
 */

function Slider(options) {

    this.timer = 0;

    this.options = $.extend({
        index: 0,
        pointClass: 'on',
        pointNav: null,
        pointTag: 'li',
        pointList: null,
        navigate: null,
        navList: null,
        childTag: 'li',
        duration: 2000,
        step: 500,
        event: 'click',
        moveWidth: 0,
        auto: true,
        aniType: 'slide',
        childLen: 0,
        container: null,
        seamless: false // 是否无缝滚动
    }, options, true);

    this.init = function () {
        if (!this.options.navigate.length) {
            return false;
        }

        this.options.navList   = this.options.navigate.children(this.options.childTag);
        if (!this.options.navList.length) {
            return false;
        }

        this.options.moveWidth = this.options.moveWidth || this.options.navList.width();
        this.options.childLen  = this.options.navList.length;
        if (this.options.pointNav && this.options.pointNav.length) {
            this.options.pointList = this.options.pointNav.children(this.options.pointTag);
            this.options.pointList.eq(this.options.index).addClass(this.options.pointClass);
        }

        this.options.navigate.css({
            width: (this.options.childLen * this.options.moveWidth) + 'px'
        });

        if (this.options.aniType == 'slide' && this.options.seamless === true) {
            this.options.navigate.after(this.options.navigate.clone().removeAttr('id'));
            this.options.navigate.parent().css({
                width: (this.options.childLen * this.options.moveWidth) * 2 + 'px'
            });
        }

        if (this.options.auto) {
            this.animate();
        }
    };

    this.moveTo = function (index) {
        this.stop();
        this.animate(this.getNextIndex(index));
    };

    this.setIndex = function (index) {
        this.options.index = index;
    };

    this.next = function () {
        this.moveTo(this.getNextIndex(this.options.index + 1));
    };

    this.prev = function () {
        this.moveTo(this.getNextIndex(this.options.index - 1));
    };

    this.move = function(index) {
        var _this  = this, _margin, _index, nextIndex, _scrollLeft, curLeft, _width = _this.options.moveWidth;
        _index = _this.options.index;
        nextIndex = typeof index !== 'undefined' ? index : _this.getNextIndex(_index + 1);
        if (_this.options.aniType == 'slide') {
            // 非无缝滚动代码
            if (_this.options.seamless === false) {
                _margin = -(nextIndex * _width);
                _this.options.navigate.stop().animate({
                    'margin-left': _margin + 'px'
                }, _this.options.step);
                _this.setIndex(nextIndex);
                _this.movePoint();
            }
            // 无缝滚动
            else {
                _scrollLeft = _this.getScrollLeft(nextIndex);
                _this.options.container.stop().animate({
                    'scrollLeft': _scrollLeft + 'px'
                }, _this.options.step, function() {
                    if (_scrollLeft >= (_width * _this.options.childLen)) {
                        _this.options.container.scrollLeft(0);
                    } else if (_index == 3 && nextIndex == (_this.options.childLen - 1)) {
                        _this.options.container.scrollLeft(_width * _this.options.childLen);
                    }
                });
                _this.setIndex(nextIndex);
                _this.movePoint();
            }

        } else {
            _this.options.navList.hide();
            _this.options.navList.eq(nextIndex).show();
            _this.setIndex(nextIndex);
            _this.movePoint();
        }
    };

    this.getScrollLeft = function(nextIndex) {
        var curLeft, flag,
            _index = this.options.index,
            _scrollLeft = 0,
            _width = this.options.moveWidth;
        // 后退
        if (_index > nextIndex) {
            if (_index == (this.options.childLen - 1) && nextIndex == 0) {
                flag = '+';
            } else {
                flag = '-';
            }
        }
        // 前进
        else {
            if (nextIndex == (this.options.childLen - 1) && _index == 0) {
                this.options.container.scrollLeft(_width * this.options.childLen);
                flag = '-';
            } else {
                _scrollLeft = curLeft + _width;
                flag = '+';
            }
        }

        curLeft = this.options.container.scrollLeft();
        _scrollLeft = parseInt(eval(curLeft + flag + _width));
        return _scrollLeft;
    };

    this.animate = function (index) {
        var _this  = this;
        if (typeof index !== 'undefined') {
            this.move(index);
        }
        this.timer = setInterval(function () {
            _this.move();
        }, this.options.duration);

    };

    this.stop = function () {
        clearInterval(this.timer);
    };

    this.movePoint = function () {
        var pointList = this.options.pointList;
        if (pointList !== null && pointList.length) {
            pointList.removeClass(this.options.pointClass);
            pointList.eq(this.options.index).addClass(this.options.pointClass);
        }
    };

    this.getNextIndex = function (index) {
        var _index = 0;
        if (index >= (this.options.childLen - 1)) {
            _index = index % this.options.childLen;
        } else if (index < 0) {
            _index = this.options.childLen - 1;
        } else {
            _index = index;
        }

        return _index;
    };

    this.init();
}
