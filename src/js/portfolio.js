import './../css/portfolio.scss';
var Prismic = require('prismic-javascript');
var apiEndpoint = "https://rideorcry.prismic.io/api/v2";
var $ = require('jquery');
var swipe = require('jquery-touchswipe');

const container = document.querySelector('.container');

function handleSlide(slide){

  console.log('inside of handle slide');

  // extract data
  const title   = slide.data.title["0"].text;
  const bgColor = slide.data["bg-color"];
  const clientName = slide.data["client-name"]["0"].text;
  const projectIntro = slide.data["project-intro"]["0"].text;
  const link = slide.data["visit-link"].url;
  const images = slide.data.body["0"].items;
  // end extract data

  // carousel declarations
  let index = 0;
  let amount = images.length;
  let currTransl = [];
  let translationComplete = true;
  let moveOffset = 0;
  const slides = []
  // end carousel declarations

  var transitionCompleted = function(){
    console.log('transition completed')
      translationComplete = true;
  }

  // HTML elements
  const a = document.createElement('a');
        a.classList.add('link');
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');

    // outer wrapper
  const wrapper = document.createElement('div');
        wrapper.classList.add('carousel-container', 'animate');
        wrapper.style.backgroundColor = bgColor;
        a.appendChild(wrapper);

  const prevArr = document.createElement('div');
        prevArr.classList.add('prev-arrow');
        prevArr.style.cursor="pointer";
  const previcon = document.createElement('i');
        previcon.classList.add('fas', 'fa-arrow-left');
        prevArr.appendChild(previcon);
        wrapper.appendChild(prevArr);

  const nextArr = document.createElement('div');
        nextArr.classList.add('next-arrow');
        nextArr.style.cursor="pointer";
  const nexticon = document.createElement('i');
        nexticon.classList.add('fas', 'fa-arrow-right');
        nextArr.appendChild(nexticon);
        wrapper.appendChild(nextArr);


  // inner div wrapper
  const innerWrapper = document.createElement('div');
        innerWrapper.classList.add('inner-wrap');
  wrapper.appendChild(innerWrapper);

  // carousel slide wrapper
  const carouselWrapper = document.createElement('div')
        carouselWrapper.classList.add('carousel-wrap');
  innerWrapper.appendChild(carouselWrapper);


  // text slide
  const textSlide = document.createElement('div');
        textSlide.classList.add('slide', 'text-slide');
  const client = document.createElement('h3');
  client.innerHTML = clientName;
  const intro = document.createElement('p');
  intro.innerHTML = projectIntro;
  const visit = document.createElement('a');
  visit.setAttribute('href', link);
  visit.innerHTML = "visit";
  textSlide.appendChild(client);
  textSlide.appendChild(intro);
  textSlide.appendChild(visit);

  // Add the text slide to the slides array
  slides.push(textSlide)

  images.map((image, index) => {
      const wrapper = document.createElement('div');
            wrapper.classList.add('slide', 'img-slide');
      const src = image.thumbnail.url;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      wrapper.appendChild(img);
      // carouselWrapper.appendChild(wrapper);
      slides.push(wrapper)
  });

  slides.map(slide => carouselWrapper.appendChild(slide))

  // Add 'clones' to the beginning and end so it seems like an endless loop
  const cloneCount = 2
  // - put clones of the first two at the end
  slides.slice(0, cloneCount).map((slide) => {
    const clone = slide.cloneNode(true)
    clone.classList.add('slide--clone')
    carouselWrapper.appendChild(clone)
  })
  slides.slice(-cloneCount).reverse().map((slide) => {
    const clone = slide.cloneNode(true)
    clone.classList.add('slide--clone')
    carouselWrapper.insertBefore(clone, carouselWrapper.firstChild)
  })
  // end HTML elements

  const moveToSlide = (newIndex, noTransition = false) => {
    const wrapperTranslateX = `${-(newIndex + cloneCount) * 100}%`
    if (noTransition) carouselWrapper.classList.add('no-transition')
    carouselWrapper.style.transform = `translateX(${wrapperTranslateX})`
    // Reading a layout property is a little 'hack' that forces the browser to clear its CSS cache
    // If we didn't do this, the transition would still occur even with the `no-transition` class
    carouselWrapper.offsetHeight
    if (noTransition) carouselWrapper.classList.remove('no-transition')
    index = newIndex
  }

  const transition = (direction) => {
    console.log(translationComplete)
    if (translationComplete) {
      translationComplete = false
      // Calculate the new index
      const newIndex = (direction === 'prev') ?
        // If the direction is `prev`, reduce the current index by 1,
        // or, if it's already at 0, set it to the end
        (index === 0) ? images.length : index - 1
        // Otherwise, inc the index, or set it to 0 if we're at the end
        : (index === images.length) ? 0 : index + 1

      // If we're about to go all the way around the carousel,
      // move to the cloned element immediately, then transition to the final slide
      if (newIndex === 0 && direction === 'next') moveToSlide(-1, true)
      if (newIndex === images.length && direction === 'prev') moveToSlide(images.length + 1, true)
      moveToSlide(newIndex)
    }
  }

  // 5 event listening & binding
  wrapper.addEventListener("click",(e) => {
    const width = wrapper.offsetWidth;
    const offsetLeft = wrapper.offsetLeft;
    const x = e.pageX - offsetLeft;
    const direction = (width / 2 > x) ? 'prev' : 'next'
    transition(direction)
  });

  prevArr.addEventListener("click", () => transition('prev'));
  nextArr.addEventListener("click", () => transition('next'));
  carouselWrapper.addEventListener("transitionend", transitionCompleted, true);

  container.appendChild(wrapper);
  moveToSlide(0, true)

  // prevent multiple click when transition
  slides.map((slide) => {
    slide.addEventListener("webkitTransitionEnd", transitionCompleted, true);
    slide.addEventListener("oTransitionEnd", transitionCompleted, true);
    slide.addEventListener("MSTransitionEnd", transitionCompleted, true);
  })

  // swipe detection

  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const gestureZone = wrapper;

  gestureZone.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
  }, false);

  gestureZone.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture();
  }, false);

  function handleGesture() {
      if (touchendX <= touchstartX) {
        transition('next');
      }

      if (touchendX >= touchstartX) {
        transition('prev');
      }
  }


}


window.onload = function(){

    // api call
    Prismic.getApi(apiEndpoint).then(function(api) {
      return api.query(
        Prismic.Predicates.at('document.type', 'slider')
      );
      }).then(function(response) {
        const sliders = response.results;
        sliders.forEach((slide)=>{handleSlide(slide)});
      }, function(err) {
      console.log("Something went wrong: ", err);
    });
}
