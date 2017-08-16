// load the JSON config
const fse = require('fs-extra');
const cloudscraper = require('cloudscraper');
// we export the var URL from the func.js so we can work with it.
module.exports = (url) => {
  // we need to work here, because we need the url variable.
  // TODO: Primero hacer un request y ver cual es la respuesta, si es 503 usar cf si no, ir con request.
  // TODO: recoger la cookie cfuid en el challenge, cf_clearance cuando termine y cf-ray en la web normal junto a idtz
  // TODO: colocar unos headers modernos en la funcion cloudscraper.get(url,func,headers)

  console.log('loading now: ',url);
  cloudscraper.get(url, function(error, response, body) {
    if (error) {
      // if (error.errno.indexOf('ECONNRESET')  < 0) {
        message('La conexion es inestable','La conexion no se ha llevado acabo, por que se ha reseteado la conexion.');
        return false;
      // }
      console.log('Error occurred: ',error);
      /*TODO: Edit messages
      - 0 if request to page failed due to some native reason as bad url, http connection or so. `error` in this case will be error [event](http://nodejs.org/api/http.html#http_class_http_server)
      - 1 cloudflare returned captcha. Nothing to do here. Bad luck
      - 2 cloudflare returned page with some inner error. error will be Number within this range 1012, 1011, 1002, 1000, 1004, 1010, 1006, 1007, 1008. See more [here](https://support.cloudflare.com/hc/en-us/sections/200038216-CloudFlare-Error-Messages)
      - 3 this error is returned when library failed to parse and solve js challenge. `error` will be `String` with some details. :warning: :warning: __Most likely it means that cloudflare have changed their js challenge.__
      */
    } else {
      //console.log(body, response);
      /*
      >> cf-ray: al final de la sesion
      >> __cfduid: en cfs-index solveChallenge()
      -> "__cfduid=d334e121fb3522fa4f2de275a8a1ef71f1501163044; expires=Fri, 27-Jul-18 13:44:04 GMT; path=/; domain=.kissmanga.com; HttpOnly"
      >>
      */

      // var cfray = cloudscraper.finalCookies.cfray,
      //     cfduid = cloudscraper.finalCookies.cfduid,
      //     cf_clearance = cloudscraper.finalCookies.cf_clearance,
      //     idtz = cloudscraper.finalCookies.idtz;
      // console.log('The cookies obj from kissmanga.js: ',cloudscraper.finalCookies);
      // console.log('CFray: ',cfray);
      // console.log('__cfduid: ',cfduid);
      // console.log('cf_clearance: ',cf_clearance);
      // console.log('idtz: ',idtz);
      // console.log('Headers: ',response.headers);
      // console.log('finished');
    }
  });


}// end module.exports url
