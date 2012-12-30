This is my panorama module. It is built to create the core Windows Phone Metro UI panorama control functionality.

This is a complete rewrite of my jQuery plugin I never made publically available. This version is a bit different because it was written with no 3rd party library dependencies and leverages CSS3 3D transforms. I make the assumption the module is going to be implemented for phone use, and as such they all pretty much support 3D and 2D transforms so the need for jQuery animiations is pretty much eliminated.

The panorama is a continuous experience, meaning as you swipe one direction it keeps moving and lopps back around. I will write a blog in the coming days to explain in more detail.

At this point I have 2 examples I used to test the code, one leverages a simple click event to move the panorama 1 panel to the left. The other uses the touchswipe and works with a right or left swipe to move panels.

This is example code from the simple click example:

var panels = document.querySelector(".panorama-container"),
    p = panorama(panels, {speed: 2300});

panels.addEventListener('click', function (e) {
    p.moveRight(e, parseInt(e.target.style.width, 10))
}, false);


I have the example code hosted @

http://panorama.extremewebworks.com
