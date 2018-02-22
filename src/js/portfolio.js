import './../css/portfolio.scss';
import _ from 'lodash';
import * as prismicService from './prismic-service'



  function component() {
    var element = document.createElement('div');

// Lodash, currently included via a script, is required for this line to work
// Lodash, now imported by this script
    element.innerHTML = _.join(['now we is in zoom zoom portfolio', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());

  window.onload = function(){
    console.log("now we are in portfolio js");
    console.log(prismicService.greetings);
  }
