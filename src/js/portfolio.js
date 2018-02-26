import './../css/portfolio.scss';
import _ from 'lodash';


window.onload = function(){

    // api call
    var Prismic = require('prismic-javascript');
    var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

    Prismic.getApi(apiEndpoint).then(function(api) {
      return api.query(
        Prismic.Predicates.at('document.type', 'slider')
      ); // An empty query will return all the documents
      }).then(function(response) {
        // console.log("Documents: ", response.results);
        const sliders = response.results;
        console.log(sliders);
        handleSlides(sliders);
      }, function(err) {
      console.log("Something went wrong: ", err);
    });
}

var index = 0,
    amount = 0,
    currTransl = [],
    translationComplete = true,
    moveOffset = 0;

var transitionCompleted = function(){
    // console.log('inside transition completed fx');
    translationComplete = true;
}


// carousel has to be in its own function, called after carousel is loaded from apiEndpoint

function carousel(uniqueID){

      // ----------------------------------------
      // carousel

      // get carousel wrapper element
      const carousel = document.querySelector('.'+uniqueID);

      // get node list of slides
      const slides = document.querySelectorAll('.slide');

      // get amount of slides
      amount = document.querySelector("."+uniqueID).querySelectorAll('.slide').length;

      // get the width of the container
      moveOffset = ( parseInt(window.getComputedStyle(document.querySelector('.carousel-container')).width, 10) )*.5;

      // calcuate the width of the carousel
      const slideWidth = slides[0].offsetWidth;
      carousel.style.width = (amount * slideWidth) + 'px';

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
      carousel.insertBefore(carousel.children[lastItem],carousel.children[0]);

      // test variables

      // ----------------------------------------
      // end carousel
}


function shiftCells(slideArray){
  slideArray.unshift(slideArray.pop());
}


function prev()
{
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
            var slide = document.getElementsByClassName("slide")[i];
            slide.style.opacity = '1';
            slide.style.transform = 'translateX('+(currTransl[i]+moveOffset)+'px)';
            currTransl[i] = currTransl[i]+moveOffset;
        }
        var outerSlide = document.getElementsByClassName("slide")[outerIndex];
        outerSlide.style.transform = 'translateX('+(currTransl[outerIndex]-(moveOffset*amount))+'px)';
        outerSlide.style.opacity = '.5';
        outerSlide.style.zIndex = '1000';
        outerSlide.classList.add('outer');
        currTransl[outerIndex] = currTransl[outerIndex]-moveOffset*(amount);
    }
}

function next()
{
    if(translationComplete === true)
    {
        translationComplete = false;
        var outerIndex = (index) % amount;
        index++;
        for(var i = 0; i < amount; i++)
        {
            var slide = document.getElementsByClassName("slide")[i];
            slide.style.opacity = '1';
            slide.style.transform = 'translateX('+(currTransl[i]-moveOffset)+'px)';
            currTransl[i] = currTransl[i]-moveOffset;
        }
        var outerSlide = document.getElementsByClassName("slide")[outerIndex];
        outerSlide.style.transform = 'translateX('+(currTransl[outerIndex]+(moveOffset*amount))+'px)';
        outerSlide.style.opacity = '0';
        currTransl[outerIndex] = currTransl[outerIndex]+moveOffset*(amount);
    }
}

// end of carousel

// counter
let counter = 0;

function handleSlides(sliders){

  const container = document.querySelector('.container');

  sliders.forEach( (slide)=> {
    // console.log(slide);
    const title   = slide.data.title["0"].text;
    const bgColor = slide.data["bg-color"];
    const clientName = slide.data["client-name"]["0"].text;
    const projectIntro = slide.data["project-intro"]["0"].text;
    const link = slide.data["visit-link"].url;
    const images = slide.data.body["0"].items;

    // inner a tag
    const a = document.createElement('a');
    a.classList.add('link');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');

    // outer wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('carousel-container');
    wrapper.classList.add('animate');
    wrapper.style.backgroundColor = bgColor;
    a.appendChild(wrapper);

    // inner div wrapper
    const innerWrapper = document.createElement('div');
    innerWrapper.classList.add('inner-wrap');
    wrapper.appendChild(innerWrapper);

    const uniqueID = "carousel_" + counter;

    // carousel slide wrapper
    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrap');
    carouselWrapper.classList.add(uniqueID);
    innerWrapper.appendChild(carouselWrapper);

    // text slide
    const textSlide = document.createElement('div');
    textSlide.classList.add('slide');
    textSlide.classList.add('text-slide');
    const client = document.createElement('h3');
    client.innerHTML = clientName;
    const intro = document.createElement('p');
    intro.innerHTML = clientName;
    textSlide.appendChild(client);
    textSlide.appendChild(intro);
    carouselWrapper.appendChild(textSlide);

    images.forEach( (image) => {
        const imgWrap = document.createElement('div');
        imgWrap.classList.add('slide');
        imgWrap.classList.add('img-slide');
        const src = image.thumbnail.url;
        const img = document.createElement('img');
        img.setAttribute('src', src);
        imgWrap.appendChild(img);
        carouselWrapper.appendChild(imgWrap);
      }
    );

    wrapper.addEventListener("click", function(e){
      const width = wrapper.offsetWidth;
      const offsetLeft = wrapper.offsetLeft;
       const x = e.pageX - offsetLeft;
        if(width/2 > x)
          // clicked on left
          prev();
        else
          // clicked on right
          next();
    })

    container.appendChild(wrapper);
    carousel(uniqueID);
    counter++;

  });
}
