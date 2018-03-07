var Prismic = require("prismic-javascript");
var apiEndpoint = "https://rideorcry.prismic.io/api/v2";
var $ = require("jquery");

window.onload = function() {
  var Prismic = require("prismic-javascript");
  var apiEndpoint = "https://rideorcry.prismic.io/api/v2";

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
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
