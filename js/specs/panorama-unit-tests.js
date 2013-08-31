var target = document.querySelector(".panorama-container"),
    p;

module("Panorama Module Unit Tests", {
    setup: function () {
        p = panorama(target);
    },
    teardown: function () {

    }
});

test("Verify We Have a Panorama Object & members", function () {

    var p = panorama(document.querySelector(".panorama-container"));

    //basic sainty assertions to know members are present
    ok(p, "p object should exist");
    ok(p.init, "p.init should exist");
    ok(p.version, "p.version should exist");

    equal(p.div, undefined, "p.div should exist");
    ok(p.support, "p.support should exist");
    ok(p.eventNames, "p.eventNames should exist");
    ok(p.transitionValue, "p.transitionValue should exist");
    ok(p.fastTransition, "p.fastTransition should exist");
    ok(p.buildTransitionValue, "p.buildTransitionValue should exist");
  
    ok(p.setPanoramaDimensions, "p.setPanoramaDimensions should exist");
    ok(p.setupElements, "p.setupElements should exist");
    ok(p.bindEvents, "p.bindEvents should exist");
    equal(p.tEndCB, undefined, "p.tEndCB should exist");
    ok(p.moveLeft, "p.moveLeft should exist");
    ok(p.moveRight, "p.moveRight should exist");
    ok(p.movePanels, "p.movePanels should exist");
    ok(p.moveLeftCallback, "p.moveLeftCallback should exist");
    ok(p.moveRightCallback, "p.moveRightCallback should exist");
    ok(p.moveCallback, "p.moveCallback should exist");
    ok(p.container, "p.container should exist");
    ok(p.panelbody, "p.panelbody should exist");
    ok(p.panels, "p.panels should exist");
    ok(p.settings, "p.settings should exist");

});

test("Verify constructor executes expected members", function () {

    var p = panorama(target),
        setupElements = sinon.stub(p, "setupElements"),
        setPanoramaDimensions = sinon.stub(p, "setPanoramaDimensions"),
        buildTransitionValue = sinon.stub(p, "buildTransitionValue"),
   //     buildVendorNames = sinon.stub(p, "buildVendorNames"),
        bindEvents = sinon.stub(p, "bindEvents");

    p.init(target);

    ok(setupElements.calledOnce, "setupElements should be called");
    ok(setupElements.calledWith(target), "setupElements should be called passing the target element");
    ok(setPanoramaDimensions.calledOnce, "setPanoramaDimensions should be called");
    ok(buildTransitionValue.calledOnce, "buildTransitionValue should be called");
 //   ok(buildVendorNames.calledOnce, "buildVendorNames should be called");
    ok(bindEvents.calledOnce, "bindEvents should be called");

    setupElements.reset();
});


test("Verify buildTransitionValue sets the transition string", function () {

    var expected = "all " +
                p.settings.speed + "ms " +
                p.settings.easing;

    p.buildTransitionValue();

    equal(p.transitionValue, expected, "should be as expected");

});
/*
test("Verify buildVendorNames calls dependant functions", function () {

    var getVendorPropertyName = sinon.stub(p, "getVendorPropertyName"),
        checkTransform3dSupport = sinon.stub(p, "checkTransform3dSupport");

    p.buildVendorNames();

    ok(checkTransform3dSupport.calledOnce, "checkTransform3dSupport should be called Once");
    equal(getVendorPropertyName.callCount, 4, "getVendorPropertyName should be called 4 times");
});

test("Verify buildVendorNames sets values", function () {

    p.buildVendorNames();

    ok(p.support.transition, "p.support.transition should be expected");
    ok(p.support.transitionDelay, "p.support.transitionDelay should be expected");
    ok(p.support.transform, "p.support.transform should be expected");
    ok(p.support.transformOrigin, "p.support.transformOrigin should be expected");
    ok(p.support.transform3d, "p.support.transform3d should be expected");
});
*/
test("Verify setPanoramaDimensions sets values according to test values", function () {

    var h = p.settings.panelHeight = 100,
        w = p.settings.panelWidth = 50;

    p.setPanoramaDimensions();

    equal(p.container.style.height, h + "px", "p.container.style.height should be the test height");
    equal(p.panelbody.style.height, h + "px", "p.panelbody.style.height should be the test height");
    equal(p.panelbody.style.width, (p.panels.length * w) + "px", "p.panelbody.style.width should be the test width * # of panels");
    equal(p.panelbody.style.left, -w + "px", "should be one negative test width");

    for (var i = 0; i < p.panels.length; i++) {
        equal(p.panels[i].style.width, w + "px", "p.panels[i].style.width should be the test width");
        equal(p.panels[i].style.minHeight, h + "px", "p.panels[i].style.minHeight should be the test height");
    }

});

test("Verify setupElements sets the container to the settings value", function () {

    p.settings.container = ".panorama-container-test";
    p.settings.panoramaSelector = ".panorama-panels-test";

    var container = document.querySelector(p.settings.container),
        panelbody = document.querySelector(p.settings.panoramaSelector);

    p.setupElements();

    equal(p.container, container, "p.container should be the test DIV");
    equal(p.panelbody, panelbody, "p.panelbody should be the test UL");
    equal(p.panels.length, 3, "there should be 3 panels");

});

test("Verify moveLeft calls movePanels", function () {

    var movePanels = sinon.stub(p, "movePanels"),
        moveValue = 100;

    p.moveLeft({ target: p.panels[0] }, moveValue);

    ok(movePanels.calledOnce, "movePanels should be called Once");
    equal(movePanels.args[0][0], -moveValue, "should be negative the amount passed");
    equal(movePanels.args[0][1], p.moveLeftCallback, "should be moveLeftCallback");

});

test("Verify moveRight calls movePanels", function () {

    var movePanels = sinon.stub(p, "movePanels"),
        moveValue = 100;

    p.moveRight({ target: p.panels[0] }, moveValue);

    ok(movePanels.calledOnce, "movePanels should be called Once");
    equal(movePanels.args[0][0], moveValue, "should be the amount passed");
    equal(movePanels.args[0][1], p.moveRightCallback, "should be moveRghtCallback");

});

test("Verify movePanels sets values accordingly", function () {

    var cb = sinon.stub(),
        moveValue = 100;

    p.panelbody.style[p.support.transition] = "";

    p.movePanels(moveValue, cb);

    equal(p.tEndCB, cb, "tEndCB should be the test callback");

    //IE seems to clean up these strings a bit so I will probably have to adjust the test accordingly.
    equal(p.panelbody.style[p.support.transition], p.settings.speed + "ms " +
                                                    p.settings.easing);
    equal(p.panelbody.style[p.support.transform], p.support.transform3d ?
                                                'translate3d(' + moveValue + 'px, 0, 0)' :
                                                'translateX(' + moveValue + 'px)');

    cb.reset();

});
/*
test("the transitionend event should call a designated callback if triggered", function () {

    var cb = sinon.stub();

    p.init(target);

    p.movePanels(100, cb);
    //    equal(p.tEndCB, cb, "tEndCB should be the test callback");


    //    p.panelbody.fireEvent(p.support.transitionEnd);

//    ok(cb.calledOnce, "callback should be called Once");

    cb.reset();

});
*/
/*
test("Verify moveLeftCallback moves the 1st panel to the last position", function () {

    var parentNode = p.panelbody,
        firstPanel = p.getFirstPanel(parentNode.childNodes),
        moveValue = 100,
        lastPanel;

    p.moveLeft({target: parentNode}, moveValue);

    lastPanel = p.getLastPanel(parentNode.childNodes);

    equal(lastPanel, firstPanel, "firstPanel and lastPanel should be the same after the move");

});
*/
