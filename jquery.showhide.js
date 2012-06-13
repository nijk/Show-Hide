/*
 * jQuery showHide plugin
 * Copyright 2012 Nick Aspinall
 * Licensed under the MIT license.
 *
 */

/*
 * SHOW HIDE
 *
 * .showHide( method, duration, [options,] [callback] )         Returns jQuery
 *
 * Dependencies:
 *
 * jquery.showhide.js is dependent on jQuery (1.4.3)
 *
 * Description: A plugin allowing developers to easily create a smooth show or
 * hide effect.
 *
 * Example use:
 * $(".myDiv").showHide('show', 250, {easing:'linear'}, function(){
 *     //Callback code
 * });
 *
 * The 'show' method call will prepare the targeted jQuery object
 * by creating a hidden wrapper element, then setting display:block; opacity:0;
 * on the targeted element. The wrapper is passed to the jQuery slideDown effect
 * which opens the necessary space and fades the element in.
 *
 * The 'hide' method does the reverse and finishes by setting display:none;
 * on the element.
 *
 */
(function($){
    $.fn.showHide = function(method, duration, options, callback){
        var animating = false;
        var defaults = { easing: "swing" };
        var _sh = this;
        _sh.method = show;

        if("hide" === method){
            _sh.method = hide;
        }
        if( duration < 0 || (typeof(duration) == "string" && ("slow" !== duration && "normal" !== duration && "fast" !== duration) ) ){
            duration = "normal";
        }
        if(typeof(options) == "function"){
            callback = options;
            options = {};
        }
        _sh.config = $.extend({}, defaults, options);

        function show(elem){
            animating = true;
            elem.wrap('<div class="show-hide"/>').parent().hide();
            elem.css({"opacity":0, "display":"block"});
            elem.parent().slideDown(duration, _sh.config.easing, function(){
                elem.animate({"opacity": 1}, duration, _sh.config.easing, function(){
                    if ($.browser.msie){this.style.removeAttribute('filter');}
                    elem.addClass("visible").unwrap().trigger({type:"custom", state:"elemShown"});
                    $.isFunction(callback) && callback.call(this);
                    animating = false;
                });
            });
        };
        function hide(elem){
            animating = true;
            elem.wrap('<div class="show-hide"/>');
            elem.animate({"opacity":0}, duration, _sh.config.easing, function(){
                elem.slideUp(duration, _sh.config.easing, function(){
                    elem.removeClass("visible").hide().unwrap().trigger({type:"custom", state:"elemHidden"});
                        $.isFunction(callback) && callback.call(this);
                        animating = false;
                });
            });
        };

        if(!animating){
            // loop through each element returned by jQuery selector
            return this.each(function(){
                _sh.method($(this));
            });
        }
    }
})(jQuery);