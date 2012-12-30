var panels = document.querySelector(".panorama-container"),
    p = panorama(panels, {speed: 600}).moveNext(function (i) {
        console.log("moveNext");
    });

    panels.addEventListener('click', function (e) {
        //p.moveRight(e);
        p.moveLeft(e);
    }, false);
