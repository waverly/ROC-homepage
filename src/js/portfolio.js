import './../css/portfolio.scss';
var Prismic = require('prismic-javascript');
var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

const container = document.querySelector('.container');



function handleSlide(slide){

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
  // end carousel declarations

  var transitionCompleted = function(){
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
  carouselWrapper.appendChild(textSlide);


  images.forEach( (image) => {
      const wrapper = document.createElement('div');
            wrapper.classList.add('slide', 'img-slide');
      const src = image.thumbnail.url;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      wrapper.appendChild(img);
      carouselWrapper.appendChild(wrapper);
  });
  // end HTML elements

  let extra;

  // Prev/Next fxs These will only have access to the
  //     variables within the scope of this 'instance' of buildSlider
  const prev = () => {
      // gauge if screen is mobile
      if (wrapper.offsetWidth > 999){
        const extra = wrapper.offsetWidth*.2;
      }
      else{
        const extra = 0;
      }

      console.log(translationComplete);
      if(translationComplete === true)
      {
          translationComplete = false;
          index--;
          if(index == -1)
          {
              index = amount-1;
          }
          var outerIndex = (index) % amount;

          for(var i = 0; i < amount; i++)
          {
              var slide = carouselWrapper.querySelectorAll('.slide')[i];
              slide.style.opacity = '1';
              slide.style.transform = 'translateX('+(currTransl[i]+moveOffset+extra)+'px)';
              // slide.style.transform = 'translateX('+(currTransl[i]-moveOffset+(wrapper.offsetWidth*.2))+'px)';
              currTransl[i] = currTransl[i]+moveOffset;
          }
          var outerSlide = carouselWrapper.querySelectorAll('.slide')[outerIndex];

          const calculateTranslate = currTransl[outerIndex]-(moveOffset*amount)+extra;

          console.log("this is what the PREV outer slide transforms", currTransl[outerIndex]-(moveOffset*amount));
          outerSlide.style.transform = 'translateX('+(calculateTranslate)+'px)';
          outerSlide.style.opacity = '0';
          outerSlide.addEventListener("transitionend", function(){
            console.log('outer slide transition should be over');
            outerSlide.style.opacity = '1';
          })
          currTransl[outerIndex] = currTransl[outerIndex]-moveOffset*(amount);
      }
  }

  const next = () => {
      // gauge if screen is mobile
      if (wrapper.offsetWidth > 999){
        extra = wrapper.offsetWidth*.2;
      }
      else{
        extra = 0;
      }

      if(translationComplete === true)
      {
          translationComplete = false;
          var outerIndex = (index) % amount;
          index++;
          for(var i = 0; i < amount; i++)
          {
              console.log("beginning of the for loop" + currTransl[i]);
              var slide = carouselWrapper.querySelectorAll('.slide')[i];
              slide.style.opacity = '1';
              slide.style.transform = 'translateX('+(currTransl[i]-moveOffset+extra)+'px)';
              currTransl[i] = currTransl[i]-moveOffset;
              console.log("end of the for loop" + currTransl[i]);
          }
          var outerSlide = carouselWrapper.querySelectorAll('.slide')[outerIndex];
          console.log("this is what the outer slide transforms", currTransl[outerIndex]+(moveOffset*amount));
          outerSlide.style.transform = 'translateX('+(currTransl[outerIndex]+(moveOffset*amount))+'px)';
          outerSlide.style.opacity = '0';
          currTransl[outerIndex] = currTransl[outerIndex]+moveOffset*(amount);
      }
  }
  // end prev/next fxs

  // 5 event listening & binding
  wrapper.addEventListener("click",(e) => {
    const width = wrapper.offsetWidth;
    const offsetLeft = wrapper.offsetLeft;
     const x = e.pageX - offsetLeft;
      if(width/2 > x)
        // clicked on left
        prev();
      else
        // clicked on right
        next();
  });

  container.appendChild(wrapper);

  // carousel function
  // get carousel wrapper element
  // const carousel = document.querySelector('.'+uniqueID);
  console.log(carouselWrapper);

  // get node list of slides
  // const slides = document.querySelector("."+uniqueID).querySelectorAll('.slide');
  const slides = carouselWrapper.querySelectorAll(".slide");

  // get amount of slides
  amount = slides.length;

  // calcuate the width of the carousel
  const slideWidth = slides[0].offsetWidth;

  // adjust the width of the carouselWrapper
  carouselWrapper.style.width = (amount * slideWidth + 3) + 'px';

  // calculate moveOffset by getting ratio of slide to container
  // const containerWidth = document.querySelector('.carousel-container').offsetWidth;
  moveOffset = slideWidth;
  // console.log({slideWidth, containerWidth, moveOffset});

  // prevent multiple click when transition
  for(var i = 0; i < amount; i++)
  {
      currTransl[i] = -(moveOffset);
      slides[i].addEventListener("transitionend", transitionCompleted, true);
      slides[i].addEventListener("webkitTransitionEnd", transitionCompleted, true);
      slides[i].addEventListener("oTransitionEnd", transitionCompleted, true);
      slides[i].addEventListener("MSTransitionEnd", transitionCompleted, true);
  }

  const lastItem = amount - 1;
  // add the last item to the start so that translateX(-moveOffset) works (In case the first click is the previous button)
  carouselWrapper.insertBefore(carouselWrapper.children[lastItem],carouselWrapper.children[0]);
  // end carousel fx

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
