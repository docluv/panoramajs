//The Panorama library is an effort to recreate the Metro UI Panoroma control functionality available
//to native Windows Phone Applications. The Panorama allows the web application to render content
//in organized sections or panels horizontally. This enables the client designer to make a much 
//richer user experience by displaying content to the user in a much more interactive manor.
//On touch devices the user can simply swipe to the right or left to change the panel in view.
//The swipe experience is continuous so the user could swipe to the right or left and the 
//panorama would seamlessly continue without interruption.

//For the panel movement I Borrowed form jQUery Transit
//https://github.com/rstacruz/jquery.transit

(function (window, undefined) {

    "use strict";

    var panorama = function (container, customSettings) {

        return new panorama.fn.init(container, customSettings);
    };

    panorama.fn = panorama.prototype = {

        constructor: panorama,

        init: function (container, customSettings) {

            this.settings = this.extend({}, this.settings, customSettings);
            this.setupElements(container);
            this.setPanoramaDimensions();
            this.buildTransitionValue();
            this.buildVendorNames();
            this.support.transitionEnd =
                                this.eventNames[this.support.transition] || null;

            this.bindEvents();

            this.currentPanel = 2;

            return this;
        },

        version: "0.0.1",

        //simple version of the jQuery function
        extend: function () {

            var target = arguments[0] || {},
		        i = 1,
                src,
                copy,
                options,
		        length = arguments.length;

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) !== null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;
        },

        div: undefined,
        currentPanel: 1,
        leftPanel: 1,
        totalPanels: 1,
        support: {},
        eventNames: {
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'WebkitTransition': 'webkitTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },

        headerTransitionValue: "all 1000ms ease-in-out",
        transitionValue: "all 1000ms ease-in-out",
        fastTransition: "all 0ms",

        buildTransitionValue: function () {

            this.transitionValue = "all " +
                this.settings.speed + "ms " +
                this.settings.easing;

            this.headerTransitionValue = "all " +
                (this.settings.speed - 100) + "ms " +
                this.settings.easing;

            return this; //why not make it chainable LOL
        },

        buildVendorNames: function () {

            var that = this,
                settings = that.settings;

            that.div = document.createElement('div');

            // Check for the browser's transitions support.
            that.support.transition = that.getVendorPropertyName('transition');
            that.support.transitionDelay = that.getVendorPropertyName('transitionDelay');
            that.support.transform = that.getVendorPropertyName('transform');
            that.support.transformOrigin = that.getVendorPropertyName('transformOrigin');
            that.support.transform3d = that.checkTransform3dSupport();

            // Avoid memory leak in IE.
            that.div = null;

        },

        setPanoramaDimensions: function () {

            //should not need to set each panel as the content will determin their height.
            //if they need to be scrolled we will leave that to the developer to handle.

            var that = this, i,
                pw = that.settings.panelWidth - that.settings.peekWidth,
                headerHeight = that.settings.headerHeight,
                headerWidth = that.settings.panelWidth * 3,
                settings = that.settings;

            that.container.style.height = settings.panelHeight + "px";
            that.panelbody.style.height = (settings.panelHeight - headerHeight) + "px";
            that.panelbody.style.top = headerHeight + "px";
            that.panelbody.style.width = (that.totalPanels * pw) + "px";
            that.panelbody.style.left = -pw + "px";

            for (i = 0; i < that.panels.length; i++) {
                that.panels[i].style.width = pw + "px";
                that.panels[i].style.minHeight = that.panelbody.style.height;
            }

            if (that.headerPanels.length > 1) {

                headerWidth = 0;

                for (i = 0; i < that.headerPanels.length; i++) {
                    headerWidth += that.headerPanels[i].offsetWidth;
                }

                headerWidth = headerWidth * 1.35; //add some width to make sure we cover the width we need

            }

            if (that.header) {

                if (that.headerPanels && that.headerPanels.length > 0) {
                    that.header.style.width = headerWidth + "px"
                    that.header.style.left = -parseInt(that.headerPanels[0].offsetWidth, 10) + "px";
                } else {
                    that.header.style.width = headerWidth + "px";
                    that.header.style.paddingLeft =
                    that.header.style.paddingRight = settings.panelWidth + "px";
                    that.header.style.left = settings.bigHeaderLeft = -settings.panelWidth + "px";
                }
            }

        },

        getVendorPropertyName: function (prop) {
            var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                vendorProp, i,
                prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

            if (prop in this.div.style) {
                return prop;
            }

            for (i = 0; i < prefixes.length; ++i) {

                vendorProp = prefixes[i] + prop_;

                if (vendorProp in this.div.style) {
                    return vendorProp;
                }

            }
        },

        // Helper function to check if transform3D is supported.
        // Should return true for Webkits and Firefox 10+.
        checkTransform3dSupport: function () {
            this.div.style[this.support.transform] = '';
            this.div.style[this.support.transform] = 'rotateY(90deg)';
            return this.div.style[this.support.transform] !== '';
        },

        setupElements: function (container) {

            var that = this,
                settings = that.settings;

            //The wrapping element
            if (!container) {
                that.container = document.querySelector(settings.container);
            } else {
                that.container = container;
            }
            //The main element
            that.panelbody = document.querySelector(
                                    settings.container + "  " +
                                    settings.panoramaSelector);
            //the panels
            that.panels = document.querySelectorAll(
                                    settings.container + "  " +
                                    settings.panoramaSelector + "  " +
                                    settings.singleColumnSelector);

            that.totalPanels = that.panels.length;

            that.header = document.querySelector(settings.headerStyle);

            that.headerPanels = document.querySelectorAll(settings.headerPanelStyle);

        },

        bindEvents: function () {

            var that = this;

            //This gets called when the animation is complete
            this.panelbody.addEventListener(this.support.transitionEnd, function (e) {

                if (that.tEndCB !== undefined) {
                    that.tEndCB();
                }

                if (that.tHeaderEndCB !== undefined) {
                    that.tHeaderEndCB();
                }

            });

            window.addEventListener("orientationchange", function (e) {
                that.resizePanorama(e);
            });

            window.addEventListener("resize", function (e) {
                that.resizePanorama(e);
            });

        },

        resizePanorama: function (e) {

            this.settings.windowWidth = window.innerWidth;
            this.settings.panelWidth = window.innerWidth;
            this.settings.panelHeight = window.innerHeight;

            this.setPanoramaDimensions();
        },

        tEndCB: undefined,
        tHeaderEndCB: undefined,

        moveQue: [],
        moving: false,

        executeMove: function () {

            var move = this.moveQue.shift();

            if (move !== undefined) {

                this.moving = true;

                this.tEndCB = move.cb;

                this.panelbody.style[this.support.transition] = this.transitionValue;

                this.panelbody.style[this.support.transform] = this.support.transform3d ?
                                                'translate3D(' + move.value + 'px, 0, 0)' :
                                                'translateX(' + move.value + 'px)';

            } else {
                this.moving = false;
            }

        },

        movePanels: function (value, cb) {

            var move = {
                cb: cb,
                value: value
            };

            if (this.moving) {
                return;
            }

            this.moveQue.push(move);

            if (!this.moving) {
                this.executeMove();
            }

        },

        _movePrevCB: [],
        _moveNextCB: [],

        moveHeader: function (moveLeft) {

            var that = this,
                activeWidth = 0;

            if (moveLeft === undefined) {
                moveLeft = true; //assume moving to the left
            }

            if (that.header) {

                if (that.headerPanels && that.headerPanels.length > 1) {
                    //move the width of the 2nd panel in the list then move the farthest to the r || l to the other end

                    if (moveLeft) {
                        activeWidth = -parseInt(that.headerPanels[1].offsetWidth, 10);
                    } else {
                        activeWidth = parseInt(that.headerPanels[0].offsetWidth, 10);
                    }

                    that.header.style[that.support.transition] = that.headerTransitionValue;

                    that.header.style[that.support.transform] = that.support.transform3d ?
                                                'translate3D(' + activeWidth + 'px, 0, 0)' :
                                                'translateX(' + activeWidth + 'px)';

                } else {//just move a % to the left or right

                    if (this.currentPanel == 2) {
                        this.bigHeaderTrans = 0;
                    } else {

                        if (moveLeft) {
                            this.bigHeaderTrans -=
                                    (that.settings.panelWidth * that.settings.headerSlide);

                        } else {
                            this.bigHeaderTrans +=
                                    (that.settings.panelWidth * that.settings.headerSlide);

                        }

                    }

                    var bigHeader = document.querySelector(".big-header");

                    bigHeader.style[that.support.transition] = that.headerTransitionValue;

                    bigHeader.style[that.support.transform] = that.support.transform3d ?
                                                'translate3D(' + this.bigHeaderTrans + 'px, 0, 0)' :
                                                'translateX(' + this.bigHeaderTrans + 'px)';

                }


                if (!moveLeft) {
                    that.tHeaderEndCB = (that.headerPanels.length > 1) ?
                                            that.endHeaderRight :
                                            function () {
                                                that.endBigHeaderRight(activeWidth);
                                            };
                } else {
                    that.tHeaderEndCB = (that.headerPanels.length > 1) ?
                                            that.endHeaderLeft :
                                            function () {
                                                that.endBigHeaderLeft(activeWidth);
                                            };
                }

            }

        },

        endBigHeaderLeft: function (shift) {

            var that = this;

            //that.header.style[that.support.transition] = that.fastTransition;
            //that.header.style[that.support.transform] = "";

            //if (this.currentPanel == 2) {
            //    that.header.style.left = that.settings.bigHeaderLeft + "px";
            //} else {
            //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
            //}

        },

        endBigHeaderRight: function (shift) {

            var that = this;

            //that.header.style[that.support.transition] = that.fastTransition;
            //that.header.style[that.support.transform] = "";

            //if (this.currentPanel == 2) {
            //    that.header.style.left = that.settings.bigHeaderLeft + "px";
            //} else {
            //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
            //}

        },

        endHeaderLeft: function () {

            var that = this;

            var childNodes = that.headerPanels;

            that.header.style[that.support.transition] = that.fastTransition;
            that.header.appendChild(this.getFirstPanel(childNodes));
            that.header.style[that.support.transform] = "";
            that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

            this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

        },

        endHeaderRight: function () {

            var that = this;

            var childNodes = that.headerPanels;

            that.header.style[that.support.transition] = that.fastTransition;
            that.header.insertBefore(that.getLastPanel(childNodes), that.header.firstChild);
            that.header.style[that.support.transform] = "";
            that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

            this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

        },

        movePrevious: function (cb) {

            if (cb) {
                this._movePrevCB.push(cb);
            }

            return this;
        },

        moveNext: function (cb) {

            if (cb) {
                this._moveNextCB.push(cb);
            }

            return this;
        },

        moveLeft: function (e, x) {

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel += 1;

            if (this.currentPanel > this.totalPanels) {
                this.currentPanel = 1;
            }

            this.moveHeader(true);
            this.movePanels(-x, this.moveLeftCallback);

            for (i = 0; i < this._moveNextCB.length; i++) {

                if (this._moveNextCB[i]) {
                    this._moveNextCB[i].call(this.currentPanel);
                }

            }

        },

        moveRight: function (e, x) {

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel -= 1;

            if (this.currentPanel < 1) {
                this.currentPanel = this.totalPanels;
            }

            this.moveHeader(false);
            this.movePanels(x, this.moveRightCallback);

            for (i = 0; i < this._movePrevCB.length; i++) {

                if (this._movePrevCB[i]) {
                    this._movePrevCB[i].call(this.currentPanel);
                }

            }

        },

        moveLastPanel: function () {

            var parentNode = this.panelbody,
                    childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.appendChild(this.getFirstPanel(childNodes));
            parentNode.style[this.support.transform] = "";

        },

        moveLeftCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.appendChild(this.getFirstPanel(childNodes));
            parentNode.style[this.support.transform] = "";

            this.moving = false;

            this.executeMove();

        },

        moveRightCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.insertBefore(this.getLastPanel(childNodes), parentNode.firstChild);
            parentNode.style[this.support.transform] = "";

            this.moving = false;
            this.executeMove();

        },

        getFirstPanel: function (childNodes) {
            var j;

            for (j = 0; j < childNodes.length; j++) {
                if (childNodes[j].nodeType === 1) {
                    return childNodes[j];
                }
            }

        },

        getLastPanel: function (childNodes) {
            var j;

            for (j = childNodes.length - 1; j !== 0; j--) {
                if (childNodes[j].nodeType === 1) {
                    return childNodes[j];
                }
            }

        },

        moveCallback: function (e, x) {

            this.movePanels(x, this.moveLeftCallback);

        },

        container: undefined,
        panelbody: undefined,
        panels: undefined,
        header: undefined,
        headerPanels: undefined,

        bigHeaderTrans: 0,

        settings: {
            panoramaSelector: ".panorama-panels",
            container: ".panorama-container",
            singleColumnSelector: ".single-panel",
            doubleColumnSelector: ".double-panel",
            speed: 150,     //speed of each slide animation
            //    easing: 'swing', //easing effect for the slide animation

            windowWidth: window.innerWidth,
            panelWidth: window.innerWidth,
            panelHeight: window.innerHeight,

            peekWidth: 35,

            easing: "ease-in-out",

            // This are for wings - To Come later
            nextScroll: ".panorama-next",
            prevScroll: ".panorama-prev",
            navWrapper: ".panorama-navigation",
            showPrevNext: false, //do this when no touch available

            headerSlide: .2,
            bigHeaderLeft: 0,

            headerStyle: ".panorama-header",
            headerPanelStyle: ".panorama-panel-header",
            headerHeight: 40

        }

    };

    // Give the init function the panoram prototype for later instantiation
    panorama.fn.init.prototype = panorama.fn;


    return (window.panorama = panorama);

} (window));

