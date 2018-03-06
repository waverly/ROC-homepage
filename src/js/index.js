window.onload = function() {
  scrollSpeeds();
  const video = document.querySelector(".reel-wrap video");
  const muteButton = document.querySelector(".mute-video");
  const muteIcon = document.querySelector(".fa-volume-off");
  const volIcon = document.querySelector(".fa-volume-up");

  muteButton.addEventListener("click", function() {
    console.log("mute video was clicked");
    if ($("video").prop("muted")) {
      $("video").prop("muted", false);
      // display the mute button, hide the loud button
      muteIcon.style.display = "block";
      volIcon.style.display = "none";
    } else {
      $("video").prop("muted", true);
      muteIcon.style.display = "none";
      volIcon.style.display = "block";
    }
  });

  $(window).resize(function() {
    if ($(window).width() < 1000) {
      document.querySelectorAll(".img-wrapper").forEach(img => {
        img.setAttribute("data-scroll-speed", "0");
      });
    }
  });

  $(window).on("resize scroll", function() {
    if ($(".reel-wrap").isInViewport()) {
      video.play();
    } else {
      video.pause();
    }
  });

  const thumbWrap = document.querySelector(".thumb-wrap");
  var Prismic = require("prismic-javascript");
  var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

  Prismic.getApi(apiEndpoint)
    .then(function(api) {
      return api.query(Prismic.Predicates.at("document.type", "thumbnail")); // An empty query will return all the documents
    })
    .then(
      function(response) {
        // console.log("Documents: ", response.results);
        const thumbnails = response.results;
        handleThumbnails(thumbnails);
      },
      function(err) {
        console.log("Something went wrong: ", err);
      }
    );

  Prismic.getApi(apiEndpoint)
    .then(function(api) {
      return api.query(Prismic.Predicates.at("document.type", "bio")); // An empty query will return all the documents
    })
    .then(
      function(response) {
        // console.log("Documents: ", response.results);
        const bios = response.results;
        handleBio(bios);
      },
      function(err) {
        console.log("Something went wrong: ", err);
      }
    );

  function handleBio(bios) {
    const ranNum = getRandomInt(0, bios.length - 1);
    console.log(ranNum);

    const currBio = bios[ranNum];

    const textNode = document.createElement("h1");
    textNode.innerHTML = currBio.data.bio["0"].text;

    console.log({ currBio, ranNum, textNode });

    document.querySelector(".bio-wrap").appendChild(textNode);
  }

  function handleThumbnails(thumbnails) {
    // console.log(thumbnails);
    thumbnails.forEach(thumbnail => {
      const src = thumbnail.data.image.url;
      const link = thumbnail.data.link.url;
      const left = thumbnail.data.left;
      const top = thumbnail.data.top;
      const width = thumbnail.data.width;
      const scrollSpeed = thumbnail.data.speed;

      const linkWrap = document.createElement("a");
      if (link) {
        linkWrap.setAttribute("href", link);
        linkWrap.setAttribute("target", "_blank");
      } else {
        linkWrap.setAttribute("href", "#");
      }

      const newEl = document.createElement("div");
      newEl.setAttribute("data-scroll-speed", scrollSpeed);
      newEl.classList.add("img-wrapper");
      newEl.style.position = "absolute";
      newEl.style.width = width + "%";
      newEl.style.top = top + "%";
      newEl.style.left = left + "%";

      const img = document.createElement("img");
      img.setAttribute("src", src);

      linkWrap.appendChild(img);
      newEl.appendChild(linkWrap);

      thumbWrap.appendChild(newEl);
    });

    // Initialization
    $(function() {
      $("[data-scroll-speed]").moveIt();
    });
  }
  // end handle handleThumbnails

  // determine if videoelement is in viewport
  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop + 100 && elementTop < viewportBottom;
  };

  function scrollSpeeds() {
    $.fn.moveIt = function() {
      var $window = $(window);
      var instances = [];

      $(this).each(function() {
        instances.push(new moveItItem($(this)));
      });

      window.addEventListener(
        "scroll",
        function() {
          var scrollTop = $window.scrollTop();
          instances.forEach(function(inst) {
            inst.update(scrollTop);
          });
        },
        { passive: true }
      );
    };

    var moveItItem = function(el) {
      this.el = $(el);
      this.speed = parseInt(this.el.attr("data-scroll-speed"));
    };

    moveItItem.prototype.update = function(scrollTop) {
      this.el.css(
        "transform",
        "translateY(" + -(scrollTop / this.speed) + "px)"
      );
    };

    // // Initialization
    // $(function(){
    //   $('[data-scroll-speed]').moveIt();
    // });

    //
  }
};
// end window on load

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
