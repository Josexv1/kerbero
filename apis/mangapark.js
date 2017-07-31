// load the JSON config
const cheerio = require('cheerio');
// we export the var URL from the func.js so we can work with it.
module.exports = (url) => {
  // we need to work here, because we need the url variable.
var manga = defaultMangaConf;
// Set the headers
var headers = {
    'User-Agent':       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept-Charset': 'utf-8',
    'Accept-Language': 'es,en-US;q=0.7,en;q=0.3',
    'Connection': 'keep-alive',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

// Configure the request
var options = {
    url: url,
    method: 'GET',
    headers: headers
}

// Start the request
console.log('we\'re going to make a request to: ',url);
request(options, function (error, response, body) {
try {
  if (response.statusCode == 200) {
    console.log('Recived code 200, All good, displaying body');
    $d = cheerio.load(body);
    console.log('Body loaded into cheerio!');
    console.log('Building up the content');
    //TODO: check if the JSON exist, then if the last chap is the same, if not update, if it's the same, serve it and doesn't change.
    //TODO: delete the localhost testing!!!!! FIXME!!!
    //manga.coverLocation = 'http://localhost/'+$d('.cover > img:nth-child(1)').attr('src');
    manga.coverLocation = $d('.cover > img:nth-child(1)').attr('src');
    manga.author = $d('.attr > tbody:nth-child(2) > tr:nth-child(5) > td:nth-child(2) > a:nth-child(1)').text().replace(/[\n\t\r]/g,"");
    manga.artist = $d('.attr > tbody:nth-child(2) > tr:nth-child(6) > td:nth-child(2) > a:nth-child(1)').text().replace(/[\n\t\r]/g,"");
    // TODO: Rewrite this with an array then join(', ')
    var genres = ''; //start empty ;)
    $d('.attr > tbody:nth-child(2) > tr:nth-child(7) > td:nth-child(2) a').each(function() {
    if (genres == '') {
      genres = this.attribs.title;
    }else {
      genres = genres+', '+this.attribs.title;
    }
            });
    manga.genres = genres;
    manga.release = $d('.attr > tbody:nth-child(2) > tr:nth-child(9) > td:nth-child(2)').text().replace(/[\n\t\r]/g,"");
    manga.status = $d('.attr > tbody:nth-child(2) > tr:nth-child(10) > td:nth-child(2)').text().replace(/[\n\t\r]/g,"");
    manga.name = $d('.manga > div:nth-child(1) > div:nth-child(1) > h1:nth-child(1) > a:nth-child(1)').text().replace(' Manga','').replace(' Manhwa','').replace(' Manhua','').replace(/[\n\t\r]/g,"").replace(/[^\w\s]/gi, ''); // we validate the name here, because we will use it to create the folder, for now we just remove all stuff that it's not a dot
    console.log('Manga name is: ',manga.name);
    manga.altNames = $d('.attr > tbody:nth-child(2) > tr:nth-child(4) > td:nth-child(2)').text().replace(/[\n\t\r]/g,"");
    manga.latestInServer = $d('.lest > li:nth-child(1) > a:nth-child(1)').text().replace(/[\n\t\r]/g,"");
    manga.description = $d('.summary').text().replace(/[\n\t\r]/g,"");
    manga.type = $d('.attr > tbody:nth-child(2) > tr:nth-child(8) > td:nth-child(2)').text().replace(/[\n\t\r]/g,"");
    manga.link = url;
    // then we will update the manga info.
    updateMangaInfo(manga.coverLocation, manga.name, manga.description, manga.genres, manga.author, manga.artist, manga.release, manga.status, manga.altNames);
    const saveTo = appConfig.userDefined.downloadFolder+path.sep+manga.name,
          pathCover = saveTo+path.sep+'cover.png',
          coverUrl = manga.coverLocation,
          mn = manga.name;
            // we need to do this to get it working inside the favs
    // if the user press fav button then
    console.log('out favs coverLocation',manga.coverLocation);
    $('#add_to_fav > i').on('click', function () {
      console.log('saveTo', saveTo);
      faves(true, saveTo, coverUrl, pathCover, mn, manga);
    });
    $('#remove_from_fav > i').on('click', function () {
      faves(false, saveTo, coverUrl, pathCover, mn, manga);
    });
    var chapters = getMangaParkChapters();
    updateChTable(chapters);
console.log('Manga is empty check: ',manga);
}//end if
} catch (e) {
  console.log('We have an error: ',e);
  message('Error! :(', e);
  $('.loading').hide();
  return false;
}
})



}// end module.exports url
