import './../css/style.scss';
import _ from 'lodash';
// import * as prismicService from './prismic-service'
// import * as Prismic from 'prismic-javascript';


window.onload = function(){

  scrollSpeeds();
  const video = document.querySelector('.reel-wrap video');
  const muteButton = document.querySelector('.mute-video');

  muteButton.addEventListener('click', function(){
    console.log('mute video was clicked');
    if( $("video").prop('muted') ) {
          $("video").prop('muted', false);
    } else {
      $("video").prop('muted', true);
    }
  })

  $(window).resize(function(){
    if ( $(window).width() < 1000 ){
      document.querySelectorAll('.img-wrapper').forEach( (img) => {
        img.setAttribute('data-scroll-speed', "0");
      })
    }
  });


  $(window).on('resize scroll', function() {
    if ($('.reel-wrap').isInViewport()) {
        video.play();
      } else {
        video.pause();
      }
  });



  const thumbWrap = document.querySelector('.thumb-wrap');
  var Prismic = require('prismic-javascript');
  var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

  Prismic.getApi(apiEndpoint).then(function(api) {
    return api.query(
      Prismic.Predicates.at('document.type', 'thumbnail')
    ); // An empty query will return all the documents
    }).then(function(response) {
      // console.log("Documents: ", response.results);
      const thumbnails = response.results;
      handleThumbnails(thumbnails)
    }, function(err) {
    console.log("Something went wrong: ", err);
  });

  function handleThumbnails(thumbnails){

    // console.log(thumbnails);
    thumbnails.forEach( (thumbnail) => {
      const src   = thumbnail.data.image.url;
      const link  = thumbnail.data.link.url;
      const left  = thumbnail.data.left;
      const top   = thumbnail.data.top;
      const width = thumbnail.data.width;
      const scrollSpeed = thumbnail.data.speed;

      const linkWrap = document.createElement('a');
      linkWrap.setAttribute('href', link);
      linkWrap.setAttribute('target', '_blank');


      const newEl = document.createElement('div');
      newEl.setAttribute("data-scroll-speed", scrollSpeed);
      newEl.classList.add('img-wrapper');
      newEl.style.position = "absolute";
      newEl.style.width = width + "%";
      newEl.style.top = top + "%";
      newEl.style.left = left + "%";

      const img = document.createElement('img');
      img.setAttribute('src', src);


      linkWrap.appendChild(img);
      newEl.appendChild(linkWrap);

      thumbWrap.appendChild(newEl);

    } )

    // Initialization
    $(function(){
      $('[data-scroll-speed]').moveIt();
    });

  }
  // end handle handleThumbnails

  // determine if videoelement is in viewport
  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > (viewportTop+100) && elementTop < viewportBottom;
  };

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

      // // Initialization
      // $(function(){
      //   $('[data-scroll-speed]').moveIt();
      // });

      //
    }


}
// end window on load
