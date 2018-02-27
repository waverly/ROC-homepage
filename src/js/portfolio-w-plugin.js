import './../css/portfolio.scss';
var Prismic = require('prismic-javascript');
var apiEndpoint = "https://rideorcry.prismic.io/api/v2";
var $ = require('jquery');
var Slick = require('slick-carousel');

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


  let counter = 0;
  // text slide
  const textSlide = document.createElement('div');
        textSlide.classList.add('slide', 'text-slide');
        textSlide.setAttribute('id', counter);
        counter++;

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
            wrapper.setAttribute('id', counter);
            counter++;
      const src = image.thumbnail.url;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      wrapper.appendChild(img);
      carouselWrapper.appendChild(wrapper);
  });
  // end HTML elements

  // end prev/next fxs

  // 5 event listening & binding
  // wrapper.addEventListener("click",(e) => {
  //   const width = wrapper.offsetWidth;
  //   const offsetLeft = wrapper.offsetLeft;
  //    const x = e.pageX - offsetLeft;
  //     if(width/2 > x)
  //       // clicked on left
  //       prev();
  //     else
  //       // clicked on right
  //       next();
  // });

  const lastItem = amount - 1;
  carouselWrapper.insertBefore(carouselWrapper.children[lastItem],carouselWrapper.children[0]);
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
        sliders.forEach((slide)=>{handleSlide(slide)});
        // window.addEventListener('resize', function(){
        //   sliders.forEach((slide)=>{handleSlide(slide)});
        // });
      }, function(err) {
      console.log("Something went wrong: ", err);
    });

    $('.carousel-wrap').slick({
       centerMode: true,
       centerPadding: '60px',
       slidesToShow: 3,
       responsive: [
         {
           breakpoint: 768,
           settings: {
             arrows: false,
             centerMode: true,
             centerPadding: '40px',
             slidesToShow: 3
           }
         },
         {
           breakpoint: 480,
           settings: {
             arrows: false,
             centerMode: true,
             centerPadding: '40px',
             slidesToShow: 1
           }
         }
       ]
     });

}

// $(document).ready(function(){
//   $('.carousel-wrap').slick({
//     centerMode: true,
//     centerPadding: '60px',
//     slidesToShow: 3,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           arrows: false,
//           centerMode: true,
//           centerPadding: '40px',
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           arrows: false,
//           centerMode: true,
//           centerPadding: '40px',
//           slidesToShow: 1
//         }
//       }
//     ]
//   });
// });
