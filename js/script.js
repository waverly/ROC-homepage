
// add all images here. It's REQUIRED to add HTTP to the links. Otherwise the links wont work
const imgs = [
  {
    src: './imgs/img1.jpg',
    url: 'http://www.google.com'
  },
  {
    src: './imgs/img2.jpg',
    url: 'http://www.facebook.com'
  },
  {
    src: './imgs/img3.jpg',
    url: 'http://www.google.com'
  },
  {
    src: './imgs/img4.jpg',
    url: 'http://www.facebook.com'
  },
  {
    src: './imgs/img5.jpg',
    url: 'http://www.google.com'
  },
  {
    src: './imgs/img6.jpg',
    url: 'http://www.facebook.com'
  },
  {
    src: './imgs/img7.jpg',
    url: 'http://www.google.com'
  },
  {
    src: './imgs/img8.jpg',
    url: 'http://www.facebook.com'
  },
];

window.onload = function(){
  generateImgs();
  scrollSpeeds();
  const video = document.querySelector('.reel-wrap video')
  // video play when/pause depending on whether it's in the viewport
  $(window).on('resize scroll', function() {
    if ($('.reel-wrap').isInViewport()) {
        video.play();
      } else {
        video.pause();
      }
  });
}

window.onresize = function(){
  scrollSpeeds();
}

// determine if videoelement is in viewport
$.fn.isInViewport = function() {
  var elementTop = $(this).offset().top;
  var elementBottom = elementTop + $(this).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();
  return elementBottom > (viewportTop+100) && elementTop < viewportBottom;
};

// function to randomly position images in thumbnail section
function generateImgs(){
  const thumbWrap = document.querySelector('.thumb-wrap');
  thumbWrap.innerHTML = "";
  const wrapWidth = $(".thumb-wrap").width();
  const wrapHeight = $(".thumb-wrap").height();
  const newWrapHeight = wrapHeight * (imgs.length/7);

  thumbWrap.style.height = newWrapHeight+"px";

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  imgs.forEach( (img) => {

    // use this random number to determine if the image will be oversized or not
    let random = getRandomInt(0, 10);
    let elWidth;

    // use the parameters below to adjust image width. (first param is min width, second is max)
    if (random < 4){
      elWidth = getRandomInt(500, 700);
      console.log('in if block', elWidth);
      const x = getRandomInt(0, (wrapWidth - elWidth));
    } else{
        elWidth = getRandomInt(200, 500);
        console.log('in else block', elWidth);
        const x = getRandomInt(0, (wrapWidth - elWidth));
    }

    const x = getRandomInt(0, (wrapWidth - elWidth));
    const xPerc = x * 100 / wrapWidth;
    const posy = getRandomInt(0, (newWrapHeight));
    const scrollSpeed = getRandomInt(1, 8);

    const a = document.createElement("a");
    a.setAttribute("href", img.url);
    a.setAttribute("target", "blank");

    const newImg = document.createElement("img");
    newImg.setAttribute("src", img.src);
    newImg.setAttribute("data-scroll-speed", scrollSpeed);
    newImg.style.width = elWidth + "px";
    newImg.style.position = "absolute";
    newImg.style.top = posy + "px";
    newImg.style.left = (xPerc - 10) + "%";

    a.appendChild(newImg);
    thumbWrap.appendChild(a);

    });
  }

  function scrollSpeeds(){
    $.fn.moveIt = function(){
    var $window = $(window);
    var instances = [];

    $(this).each(function(){
      instances.push(new moveItItem($(this)));
    });

    window.addEventListener('scroll', function(){
      var scrollTop = $window.scrollTop();
      instances.forEach(function(inst){
        inst.update(scrollTop);
      });
    }, {passive: true});
  }

  var moveItItem = function(el){
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
  };

  moveItItem.prototype.update = function(scrollTop){
    this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
  };

  //

  if ( $(window).width() > 999 ){
    // Initialization
    $(function(){
      $('[data-scroll-speed]').moveIt();
    });
  }
  }
