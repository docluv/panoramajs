var panels = document.querySelector(".panorama-container"),
    p = panorama(panels, { speed: 750 }),
        swipeOptions = {
            triggerOnTouchEnd: true,
            swipeLeft: function (e, direction, distance) {
                p.moveLeft(e);
            },
            swipeRight: function (e, direction, distance) {
                p.moveRight(e);
            },
            threshold: 30
        };


$(panels).swipe(swipeOptions);

panels.addEventListener('click', function (e) {
    p.moveRight(e);
    //p.moveLeft(e);
}, false);


