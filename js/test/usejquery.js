var p = panorama($(".panorama-container")[0], {speed: 600}).moveNext(function (i) {
        console.log("moveNext");
    });

    $(".panorama-container")[0].addEventListener('click', function (e) {
        //p.moveRight(e);
        p.moveLeft(e);
    }, false);
