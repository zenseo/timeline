$.fn.timeline = function (opt) {
    var getDataAttr = function (element) {
        var data_option = {};
        //        var keys = Object.keys(option);
        $.each(option, function (i, val) {
            if (typeof element.attr('data-tl-' + [i]) !== "undefined" && typeof element.attr('data-tl-' + [i]) !== false) {
                try {
                    data_option[[i]] = $.parseJSON(element.attr('data-tl-' + [i]));
                    return true; //continue;
                } catch (e) {
                }
                if (typeof data_option[i] !== "object") {
                    data_option[[i]] = element.attr('data-tl-' + [i]);
                }
            }
        });

        var data_json = (typeof element.attr('data-tl') !== "undefined" && typeof element.attr('data-tl') !== false ? $.parseJSON(element.attr('data-tl')) : []);

        $.extend(true, data_option, data_json);

        if (ie < 9) {
            $.each(data_option, function (i, val) {
                //                console.log(data_option[i]);
                if (typeof rgbaToRgb(data_option[i]) !== "undefined") {
                    data_option[i] = rgbaToRgb(data_option[i]);
                }
                if (typeof rgbaToRgb(data_option[i]) !== "undefined") {
                    data_option[i] = rgbaToRgb(data_option[i]);
                }
            });
        }

        return data_option;
    };

    var rgbaToRgb = function (rgba) {
        try {
            var bits = rgba.split("(");
        } catch (e) {
            return;
        }
        if (typeof bits[1] !== "undefined") {
            console.log('splitting');
            bits = bits[1].split(")")[0].split(",");

            return "rgb(" + bits[0] + "," + bits[1] + "," + bits[2] + ")";
        }
        return;
    };

    var screen_size;
    var self = $(this);
    var option = {
        arrowWidth: 7, // width of the arrow pointing towards the box belonging to an event
        background: "#0084c2", // background color of a timeline block
        borderRadius: "0.3em", // border radius of a timline block. Support >IE8
        color: "inherit", // color of the text inside the block
        lineColor: "rgba(0, 0, 0, 0.3)", // color of the line that runs the length of the timeline
        lineThickness: 2, // thickness of the line that runs the length of the timeline
        date: "", // date of an event
        dateColor: "inherit", // text color of the date of an event
        datePosition: "absolute", // Do Not Use
        fadeIn: true, // should boxed be hidden before the user scrolls down to them
        fadeLine: true, // should the line appear as user scrolls, or be there constantly
        lineSpeed: 1000, // animation speed of the line indicating the users progress
        lineMaxBlur: 100, // fading out of the bottom of the line indicating the users progress scrolled.
        fadeImages: true, // hide images before user scrolls them into view
        image: "transparent", // the background image of the box belonging to the event. Sets the css background property so url() is needed
        imageBorderRadius: "0.3em", // border radius of the box belonging to an event. Support >IE8
        imageBorderWidth: 2, // width of the border of the box belonging to an event
        imageBorderColor: "rgba(220, 220, 220, 1)", // border color of the box belonging to an event
        distanceBetweenBoxAndImage: 5, // distance between the timeline content and the box
        orientation: [{ 
                min: 0,
                max: 10000,
                orientation: "vertical"
            }], // min and max sizes of the page defining if the timeline is horizontal or vertical
        treeView: 900, // minimum width of page before a vertical timeline splits into tree view,
		centered_boxes: true
    };
    var data_option = getDataAttr($(this));

    $.extend(true, option, data_option, opt);

    var init = function () {

    };



    var resize = function () {
        var width = 100 / self.children(".timeline-block").length;
        screen_size = (self.parent().width() > option.treeView);
        if (screen_size === true) {
            self.addClass('tl-large');
        } else {
            self.removeClass('tl-large');
        }

        self.children(".timeline-block").each(function (i) {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

            for (var o = 0; o < box_option.orientation.length; o++) {

                if ((self.parent().width() > box_option.orientation[o].min || typeof box_option.orientation[o].min === "undefined") && (self.parent().width() < box_option.orientation[o].max || typeof box_option.orientation[o].max === "undefined") && (typeof box_option.orientation[o].min !== "undefined" || typeof box_option.orientation[o].max !== "undefined")) {
                    $(this).attr("data-tl-orient", box_option.orientation[o].orientation);
                    $(this).removeClass("tl-orient-vertical");
                    $(this).addClass("tl-orient-" + box_option.orientation[o].orientation);
                } else {
                    $(this).attr("data-tl-orient", "vertical");
                    $(this).removeClass("tl-orient-horizontal");
                    $(this).addClass("tl-orient-vertical");
                }
            }
            if (typeof $(this).attr('data-tl-orient') === "undefined" || typeof $(this).attr('data-tl-orient') === false) {
                $(this).attr("data-tl-orient", "vertical");
            }
			
			if(box_option.centered_boxes === true) {
				$(this).addClass('tl-centered-boxes');
			}

            if ($(this).attr('data-tl-orient') == "vertical") {

                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").outerHeight(true));
                if (self.hasClass('tl-large')) {
                    $(this).children(".timeline-line").css('left', $(this).outerWidth() / 2);
                    $(this).children(".timeline-content").css('margin-left', ''); //normalize the margin on the left for the space for the image
                } else {
                    $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth() / 2);
                    $(this).children(".timeline-content").css('margin-left', $(this).children('.timeline-img').outerWidth(true) + box_option.arrowWidth + box_option.distanceBetweenBoxAndImage);
                }

                $(this).css('width', "").css('display', 'block');
            } else {
                $(this).children(".timeline-content").css('margin-left', ''); //normalize the margin on the left for the space for the image
                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").outerHeight(false) / 2); //don't count image margin
                $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth());
                $(this).css('width', width + "%").css('display', 'table-cell');
            }


            if ($(this).attr('data-tl-orient') === "vertical") {
                if (screen_size === true) {
                    if (i % 2 === 1) { //if current box is even
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                        $(this).children(".timeline-content").children('.timeline-arrow').css("left", -(box_option.arrowWidth * 2));
                    } else {
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", box_option.background);
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');
                        $(this).children(".timeline-content").children('.timeline-arrow').css("left", '100%');

                    }
                } else { //small view
                    $(this).children(".timeline-content").children('.timeline-arrow').css("left", -(box_option.arrowWidth * 2));

                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                    $(this).children(".timeline-content").children('.timeline-date').css("color", 'white');
                }
				
				$(this).children(".timeline-content").children('.timeline-arrow').css("top", ($(this).children(".timeline-img").outerHeight(true) / 2) - box_option.arrowWidth);
				
				if(box_option.centered_boxes === true && screen_size === false) {
					
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", box_option.background);
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
					$(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');
					$(this).children(".timeline-content").children('.timeline-arrow').css("top", -box_option.arrowWidth*2);
					$(this).children(".timeline-content, .timeline-img").css('margin-left', '0');
					var gap =  $(this).children(".timeline-img").outerHeight() + 20 + box_option.imageBorderWidth*2;
					$(this).css('margin-top', gap);
					if(i === 0) {
						self.css('margin-top', gap + 20);
					}
					$(this).children(".timeline-img").css('margin-top', -(box_option.distanceBetweenBoxAndImage + gap));
					
					$(this).children(".timeline-img").css('left', $(this).children(".timeline-content").outerWidth()/2 - ($(this).children(".timeline-img").outerWidth()/2) );
					$(this).children(".timeline-line").css('left', $(this).children(".timeline-content").outerWidth()/2 - (box_option.lineThickness/2) + 1);
					$(this).find('.timeline-arrow').css("left", $(this).children(".timeline-content").outerWidth()/2 - (box_option.arrowWidth)); //only one arrow width (both sides of arrow)
				} else {
					 $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", 'transparent');
				}

                

                $(this).children(".timeline-content").children('.timeline-date').css("color", box_option.datecolor).css('position', box_option.dateposition);

            }

            if (!$(this).hasClass('tl-orient-vertical')) {
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", box_option.background);
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');

                $(this).children(".timeline-content").children('.timeline-arrow').css("left", ($(this).children(".timeline-img").outerWidth(true) / 2) - box_option.arrowWidth / 2);
                $(this).children(".timeline-content").children('.timeline-arrow').css("top", -(box_option.arrowWidth * 2));
				$(this).children('.timeline-line').css("top", $(this).children('.timeline-img').outerHeight()/2 + "px");
				$(this).children('.timeline-img').css("margin", "0").css("margin-bottom", "");
				$(this).children('.timeline-img').css("left", "0");
            }


        });
    };

    var scroll = function () {

        self.children(".timeline-block").each(function (i) {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

            if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && ($(this).children('.timeline-img').hasClass('is-hidden') || $(this).children('.timeline-content').hasClass('is-hidden'))) {
                $(this).find('.timeline-content').removeClass('is-hidden').addClass('bounce-in');
                if (box_option.fadeImages === true) {
                    $(this).find('.timeline-img').removeClass('is-hidden').addClass('bounce-in');
                    resize();
                }
            } else {
                //            $(this).find('.timeline-img, .timeline-content').addClass('is-hidden').removeClass('bounce-in');
            }

            if ($("body").height() <= $(window).height()) {

                $(this).find('.timeline-content').removeClass('is-hidden').addClass('bounce-in');
                if (box_option.fadeImages === true) {
                    $(this).find('.timeline-img').removeClass('is-hidden').addClass('bounce-in');
                    resize();
                }
            }

            // Check if body width is higher than window width :)
            if ($("body").width() <= $(window).width()) {
                $(this).find('.timeline-content').removeClass('is-hidden').addClass('bounce-in');
                if (box_option.fadeImages === true) {
                    $(this).find('.timeline-img').removeClass('is-hidden').addClass('bounce-in');
                    resize();
                }
            }

            if (box_option.fadeLine === true) {
                var this_outer_height = $(this).outerHeight(true) - $(this).children('.timeline-img').outerHeight();
                var this_outer_width = $(this).outerWidth(true) - parseInt($(this).children('.timeline-line').css('left'));
                var distance_bottom = $(document).height() - $(this).offset().top;
                var scroll_left = $(document).height() - $(window).scrollTop() - $(window).height();
                var offset = $(window).height() / 2;

                var height = $(this).offset().top - $(window).scrollTop();
                height = -height;
                height += offset;

                if (distance_bottom - this_outer_height <= offset) {
                    height = -(scroll_left + distance_bottom);
                    height -= offset;
                    height = -scroll_left + this_outer_height;
                }
                var percent_scrolled = 0;
                if ($(this).attr('data-tl-orient') == "vertical") {
                    height = (height >= this_outer_height ? this_outer_height : height);
                    percent_scrolled = (height / this_outer_height) * 100;
                } else {
                    height = (height >= this_outer_width ? this_outer_width : height);
                    percent_scrolled = (height / this_outer_width) * 100;
                }
                if (ie < 9) {
                    $(this).children(".timeline-line").css("background", box_option.lineColor);

                    if ($(this).attr('data-tl-orient') == "vertical") {
                        $(this).children('.timeline-line').animate({
                            'height': height,
                            'width': box_option.lineThickness
                        }, box_option.lineSpeed, function () {
                        });
                        $(this).children(".timeline-line").css("background", "linear-gradient(180deg, " + box_option.lineColor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                    } else {
                        $(this).children('.timeline-line').clearQueue().animate({
                            'width': height,
                            'height': box_option.lineThickness
                        }, box_option.lineSpeed, function () {
                        });
                    }

                } else {
                    if ($(this).attr('data-tl-orient') == "vertical") {
                        $(this).children('.timeline-line').css('height', height).css('width', box_option.lineThickness);
                        $(this).children(".timeline-line").css("background", "linear-gradient(180deg, " + box_option.lineColor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                    } else {
                        $(this).children('.timeline-line').css('width', height).css('height', box_option.lineThickness);
                        $(this).children(".timeline-line").css("background", "linear-gradient(90deg, " + box_option.lineColor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                    }
                }

            }
        });
    };

    var funcs = {
        update: function () {
            self.children(".timeline-block").each(function () {
                if ($(this).children(".timeline-content").length < 1) {
                    $(this).wrapInner($("<div class='timeline-content'></div>"));
                }
                if ($(this).children(".timeline-img").length < 1) {
                    $(this).prepend($("<div class='timeline-img'></div>"));
                }
                if ($(this).children(".timeline-date").length < 1) {
                    //$(this).prepend($("<div class='timeline-date'></div>"));
                }
                if ($(this).children('.timeline-content').children(".timeline-arrow").length < 1) {
                    $(this).children('.timeline-content').append("<div class='timeline-arrow'></div>");
                }
                if ($(this).children(".timeline-line").length < 1) {
                    $(this).prepend($("<div class='timeline-line'></div>"));
                }
            });

            if (option.fadeIn === false) {
                self.find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
            } else {
                self.find('.timeline-content').addClass('is-hidden');
                if (option.fadeImages === true) {
                    self.find('.timeline-img').addClass('is-hidden');
                }
            }
            self.children(".timeline-block:nth-child(even)").addClass("tl-even");
            self.children(".timeline-block:nth-child(odd)").addClass("tl-odd");

            self.children(".timeline-block").each(function () {
                var box_option = $.extend(true, {}, option);
                var box_data_option = getDataAttr($(this));
                $.extend(true, box_option, box_data_option);

                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                if (pattern.test(box_option.image)) {
                    box_option.image = "url('" + box_option.image + "')";
                }
                $(this).children(".timeline-img").css('background-image', box_option.image).css('border-width', box_option.imageBorderWidth).css('border-color', box_option.imageBorderColor)
                        .css('border-radius', box_option.imageBorderRadius)
                        .css('-moz-border-radius', box_option.imageBorderRadius)
                        .css('-ms-border-radius', box_option.imageBorderRadius);

                $(this).children(".timeline-content")
                        .css('border-radius', box_option.borderRadius)
                        .css('-moz-border-radius', box_option.borderRadius)
                        .css('-ms-border-radius', box_option.borderRadius);

                $(this).children('.timeline-content').css('background', box_option.background).css("color", box_option.color);

                //            $(this).children('.timeline-content').css('filter', 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#50990000,endColorstr=#50990000');

                $(this).children(".timeline-content").children('.timeline-arrow').css("border-width", box_option.arrowWidth);
                $(this).children(".timeline-img").css("border-width", box_option.imageBorderWidth);

                $(this).children(".timeline-date").html(box_option.date);

                $(this).children(".timeline-line").css("transition-duration", box_option.lineSpeed + "ms");
            });
            resize();
        }
    };

    init();
    resize();
    funcs.update();
    scroll();


    $(window).on('resize', function () {
        resize();
        scroll();
    });
    $(window).on('scroll', function () {
        scroll();
    });

    return funcs;

};

$(function () {

    $('[data-tl-autoinit]').each(function () {
        $(this).timeline();
    });
});

var ie = (function () {

    var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

    while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
            )
        ;

    return v > 4 ? v : undef;

}());
//
//if(ie < 9) {
//    $.getScript("http://malsup.github.io/jquery.corner.js", function(){
//        
//    });
//}