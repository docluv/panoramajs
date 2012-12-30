var panels = document.querySelector(".panorama-container"),
    p = panorama(panels, { speed: 600, headerHeight: 80 }).moveNext(function (i) {
        console.log(i);
    });

panels.addEventListener('click', function (e) {
    p.moveRight(e);
    //p.moveLeft(e);
}, false);
