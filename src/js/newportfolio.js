import './../css/portfolio.scss';
var Prismic = require('prismic-javascript');
var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

const container = document.querySelector('.container');

var transitionCompleted = function(){
    translationComplete = true;
}

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
  let translatioComplete = true;
  let moveOffset = 0;
  // end carousel declarations

  // HTML elements
  const a = document.createElement('a')
              .classList.add('link').setAttribute('href', link)
              .setAttribute('target', '_blank');

    // outer wrapper
  const wrapper = document.createElement('div')
          .classList.add(['carousel-container', 'animate'])
          .classList.add('animate');
          .style.backgroundColor = bgColor;
  a.appendChild(wrapper);

  // inner div wrapper
  const innerWrapper = document.createElement('div')
                       .classList.add('inner-wrap');
  wrapper.appendChild(innerWrapper);

  // carousel slide wrapper
  const carouselWrapper = document.createElement('div')
                          .classList.add(['carousel-wrap', uniqueID]);
  innerWrapper.appendChild(carouselWrapper);

  // text slide
  const textSlide = document.createElement('div')
                    .classList.add(['slide', 'text-slide'];

  const client = document.createElement('h3');
  client.innerHTML = clientName;
  const intro = document.createElement('p');
  intro.innerHTML = clientName;
  textSlide.appendChild(client);
  textSlide.appendChild(intro);
  carouselWrapper.appendChild(textSlide);


  images.forEach( (image) => {
      const wrapper = document.createElement('div')
                      .classList.add(['slide', 'img-slide']);
      const src = image.thumbnail.url;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      wrapper.appendChild(img);
      carouselWrapper.appendChild(imgWrap);
  });
  // end HTML elements

  // Prev/Next fxs These will only have access to the
  //     variables within the scope of this 'instance' of buildSlider
  const prev = () => {
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
              var slide = document.querySelector("."+uniqueID).querySelectorAll('.slide')[i];
              slide.style.opacity = '1';
              slide.style.transform = 'translateX('+(currTransl[i]+moveOffset)+'px)';
              currTransl[i] = currTransl[i]+moveOffset;
          }
          var outerSlide = document.querySelector("."+uniqueID).querySelectorAll('.slide')[outerIndex];
          outerSlide.style.transform = 'translateX('+(currTransl[outerIndex]-(moveOffset*amount))+'px)';
          outerSlide.style.opacity = '.5';
          outerSlide.style.zIndex = '1000';
          currTransl[outerIndex] = currTransl[outerIndex]-moveOffset*(amount);
      }
  }

  const next = () => {
      if(translationComplete === true)
      {
          translationComplete = false;
          var outerIndex = (index) % amount;
          index++;
          for(var i = 0; i < amount; i++)
          {
              console.log(currTransl[i]);
              var slide = document.querySelector("."+uniqueID).querySelectorAll('.slide')[i];
              slide.style.opacity = '1';
              slide.style.transform = 'translateX('+(currTransl[i]-moveOffset)+'px)';
              currTransl[i] = currTransl[i]-moveOffset;
              console.log(currTransl[i]);
          }
          var outerSlide = document.querySelector("."+uniqueID).querySelectorAll('.slide')[outerIndex];
          outerSlide.style.transform = 'translateX('+(currTransl[outerIndex]+(moveOffset*amount))+'px)';
          outerSlide.style.opacity = '.5';
          currTransl[outerIndex] = currTransl[outerIndex]+moveOffset*(amount);
      }
  }
  // end prev/next fxs

  // 5 event listening & binding
  wrapper.onClick((e) => {
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

  //beginning carousel
  // get carousel wrapper element
  // const carousel = document.querySelector('.'+uniqueID);
  console.log(carouselWrapper);
  // // get node list of slides
  // const slides = document.querySelector("."+uniqueID).querySelectorAll('.slide');
  //
  // // get amount of slides
  // amount = slides.length;
  // // calcuate the width of the carousel
  // const slideWidth = slides[0].offsetWidth;
  // carousel.style.width = (amount * slideWidth) + 'px';
  //
  // // calculate moveOffset by getting ratio of slide to container
  //
  // const containerWidth = document.querySelector('.carousel-container').offsetWidth;
  // moveOffset = slideWidth;
  // console.log({slideWidth, containerWidth, moveOffset});
  //
  // // prevent multiple click when transition
  // for(var i = 0; i < amount; i++)
  // {
  //     currTransl[i] = -(moveOffset);
  //     slides[i].addEventListener("transitionend", transitionCompleted, true);
  //     slides[i].addEventListener("webkitTransitionEnd", transitionCompleted, true);
  //     slides[i].addEventListener("oTransitionEnd", transitionCompleted, true);
  //     slides[i].addEventListener("MSTransitionEnd", transitionCompleted, true);
  // }
  //
  // const lastItem = amount - 1;
  // // add the last item to the start so that translateX(-moveOffset) works (In case the first click is the previous button)
  // carousel.insertBefore(carousel.children[lastItem],carousel.children[0]);

  // test variables

  // ----------------------------------------
  // end carousel

  //end carousel

  container.appendChild(wrapper);
}

window.onload = function(){

    // api call

    Prismic.getApi(apiEndpoint).then(function(api) {
      return api.query(
        Prismic.Predicates.at('document.type', 'slider')
      );
      }).then(function(response) {
        const sliders = response.results;
        sliders.each((slide)=>{handleSlide(slide)});
      }, function(err) {
      console.log("Something went wrong: ", err);
    });
}
