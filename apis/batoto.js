// load the JSON config
var config = require('./batoto.json');
//load cloudflare challenge bypass
var cloudscraper = require('cloudscraper');
module.exports = (url) => {
  // we need to work here, because we need the url variable.

// we will get the cookies in the cloudflare app and store for today
// function getCookies(callback){
//
//     request('http://google.com', function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             return callback(null, response.headers['set-cookie']);
//         } else {
//             return callback(error);
//         }
//     })
// }
    console.log('loading now: ',url);
    cloudscraper.get(url, function(error, response, body) {
      if (error) {
        console.log('Error occurred');
      } else {
        console.log(body, response);
        console.log(response.headers);
      }
    });

}
