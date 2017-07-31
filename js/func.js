const request = require('request');
const fs = require('fs-extra');
const progress = require('request-progress');


//##############################    UTILS      ###############################\\
// Open downloads folder
$('#openDownloadsFolder').on('click', function () {
  shell.showItemInFolder(appConfig.userDefined.downloadFolder+path.sep);
});

//material select initializing
    $('select').material_select();

// Do misc stuff on page load
// initializing modals
$(document).ready(function () {
  $('.modal').modal();

// initialize the scroll to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#btn_scrollToTop').fadeIn();
    } else {
      $('#btn_scrollToTop').fadeOut();
    }
  });

  $('#btn_scrollToTop').click(function () {
    $('html, body').animate({scrollTop: 0}, 800);
    return false;
  });
});

// Prevent default behavior of closing button
$('.modal-close').click(function (e) {
  e.preventDefault();

});

// Open settings panel
$('#nav_btn_openSettingsModal').click(function () {
  fillSettingsModal(appConfig);
});

// Save settings button
$('#settings_btn_saveSettings').click(function () {
  // Save settings
  saveSettings();
});
  // Reset defaults button
  $('#settings_btn_defaultSettings').click(function () {
    fillSettingsModal(defaultConfig);
  });

  // Populate settings fields
  function fillSettingsModal(arg) {
    //TODO: Agregar las demas variables!
    $('#settings_download_folder').val(arg.userDefined.downloadFolder);
    $('#settings_download_threads').val(arg.userDefined.downloadThreads);
    $('#settings_language').val(arg.userDefined.language).attr('selected', '').prop('selected', 'true');
    $('#settings_checkNewChapterFreq').val(arg.userDefined.checkNewChapterFreq);
    $('#settings_checkAppUpdateFreq').val(arg.userDefined.checkAppUpdateFreq);
    $('#settings_downloadExt').val(arg.userDefined.downloadLocation);
    Materialize.updateTextFields()
  };
function saveSettings() {
  //TODO: Fix Language + Ext type
  appConfig.userDefined.downloadFolder = $('#settings_download_folder').val(),
  appConfig.userDefined.downloadThreads = $('#settings_download_threads').val(),
  appConfig.userDefined.language = $('#settings_language').val(),
  appConfig.userDefined.checkNewChapterFreq = $('#settings_checkNewChapterFreq').val(),
  appConfig.userDefined.checkAppUpdateFreq = $('#settings_checkAppUpdateFreq').val(),
  appConfig.userDefined.downloadExt = $('#settings_downloadExt').val(),
  writeJS('./config.json', appConfig);
};
  // modal basic config.
  function message(title, message) {
    $('#modal_msg_title').html(title);
    $('#modal_msg_message').html(message);
    $('#modal_msg').modal('open');
  };
  // select checkboxes helper
  $('#select_all_ch').click(function(event) {
    $("input:checkbox").attr('checked', true);
  });
  $('#uncheck_all_ch').click(function(){
  $("input:checkbox").attr('checked', false);
});

//downlaod button test
$('#download_ch').submit(function(event) {
  event.preventDefault();
  // We get the Obj with the name and link and give it to the queue algo
  queue(getDownloadList());
});

// get the val from all Checkboxes
function getDownloadList() {
  var list = {};
  $(":checkbox:checked").each(function(){
    var c = $(this).attr('id');
    var u = $(this).attr('data-url');
     list[c] = u;
  });
  return list;
}
  function faves(add, dir, coverUrl, coverLocalPath, mangaName, mangaJson) {
    if (add) {
        $('#add_to_fav').addClass('hide');
        $('#remove_from_fav').removeClass('hide');
        /*
        So, if we press the fav button we will
        * Make sure userPath/manganame is created or exist.
        * download the cover, to be served offline in the fav tab
        * add the manga + path where it will be saved in the APP config
        * write a JSON in the path where it's downloaded with the offline manga info
        * animate the icon + hide + show the remove icon
        */
          fs.ensureDir(dir, err => {
            if (err) {
            console.log(err); // => null
            }
            // dir has now been created, including the directory it is to be placed in
          });//end ensureDir
          console.log('cover url',coverUrl);
          console.log('coverLocalPath',coverLocalPath);
        download(coverUrl,coverLocalPath);
        coverLocalPath = 'file://'+coverLocalPath;
        appConfig.userDefined.mangaFavs[mangaName] = dir;
        writeJS(dir+path.sep+mangaName+'.json', mangaJson);
        writeJS('./config.json', appConfig);
        message('Faved!',mangaName + ' was added to Favs!' );
    }else{
      /*
      if the user press remove, it will:
      * delete it from the APP config
      * animate the icon + hide + show the add icon
      * this will NOT remove the data from the disk
      */
      $('#remove_from_fav').addClass('hide');
      $('#add_to_fav').removeClass('hide');
      delete appConfig.userDefined.mangaFavs[mangaName];
      writeJS('./config.json', appConfig);
      message('Desu~troyed!',mangaName + ' was deleted from favs.' );
    }
  }
  function writeJS(file, json) {
    fs.writeFile(file, JSON.stringify(json, null, 2), function (err) {
    if (err) return console.log('Error saving the file: ',err);
    console.log('writing JSON to ' + file);
  });
  }
  function updateMangaInfo(cover, name, desc, genres, author, artist, release, status) {
    $('.loading').addClass('hide');
    $('.info_manga').removeClass('hide');
    $('#download_ch').removeClass('hide');
    $('#manga_title').empty(); //we empty the whole div
    $('#manga_info_card_pic').empty();
    $('#manga_about').empty();
    $('#manga_sumary').empty();
    //load the manga name
    $('#manga_title').append(
      '<span class="card-title activator grey-text text-darken-4 "><i class="material-icons right"></i>' + name + '</span>'
    );
    // load the pic
    $('#manga_info_card_pic').append(
      '<img src="'+cover+'" class="activator responsive-img">'
    );
    $('#manga_about').append(
      '<div class="col s12"><span><b>Genres: </b>'+ genres +'</span></div>'+
      '<div class="col s6"><span><b>Autor: </b>' + author + '</span></div>'+
      '<div class="col s6"><span><b>Artist: </b>' + artist + '</span></div>'+
      '<div class="col s6"><span><b>Release date: </b>' + release + '</span></div>'+
      '<div class="col s6"><span><b>Status: </b>' + status + '</span></div>'
    )
    // load the bottom row
    $('#manga_sumary').append(
      '<span class="card-title grey-text text-darken-4">Manga Sumary<i class="material-icons right">close</i></span>'+
      '<p>'+desc+'</p>'
    );
      };
  // downloads!!
  function download(file, path) {
    progress(request(file), {
        // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
        // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
        // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
    })
    .on('progress', function (state) {
        // The state is an object that looks like this:
        // {
        //     percent: 0.5,               // Overall percent (between 0 to 1)
        //     speed: 554732,              // The download speed in bytes/sec
        //     size: {
        //         total: 90044871,        // The total payload size in bytes
        //         transferred: 27610959   // The transferred payload size in bytes
        //     },
        //     time: {
        //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
        //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
        //     }
        // }
        console.log('progress', state);
        console.log('Saving to: ', path);
    })
    .on('error', function (err) {
        // Do something with err
        console.log('Error: ',err);
    })
    .on('end', function () {
        // Do something after request finishes
        console.log('Finished downloading to', path);
    })
    .pipe(fs.createWriteStream(path));
    //end download cover
  };// end download function

  function updateChTable(data) {
      $('#chap_list_wrap').removeClass('hide');
    //if updating we empty the chap list, then add the header, then add the chaps
$('#chap_list').empty();
$('#chap_list').append('<li class="collection-header">Chapter name<div class="secondary-content">Download</div></li>');
    for (x in data) {
      // X = chap name
      // data[x] = chap url
$("#chap_list").append(
  '<li class="collection-item">'+
  '<div>'+ x +
  '<div class="secondary-content">'+
  '<p>'+
  '<input type="checkbox" id="' + x + '" data-url='+data[x]+'/>'+
  '<label for="' + x + '"></label>' +
  '</p>'+
  '</div>'+
  '</div>'+
  '</li>');
  };
};

  function getMangaParkChapters() {
    var map = {};
    $d(".ch.sts").each(function() {
      //FIXME: toogle offline/online settings.
      //link = this.attribs.href; //offline -> localhost
      link = 'http://mangapark.me'+this.attribs.href; //online
      link = link.slice(0, -2);
      map[$(this).text()] = link;
    });
    return map;
  };
  function getMangaParkPics() {
    var chpImgList = [];
    $d('.img.arrow-down').each(function() {
      chpImgList.push(this.attrib.href);
    });
    return chpImgList;
  };

  // submit from tab manga from url
$('#tab_manga_form_url').submit(function (ev) {
  ev.preventDefault();
  $('.info_manga').addClass('hide');
  $('#download_ch').addClass('hide');
  $('#chap_list_wrap').addClass('hide');
  $('#loading').removeClass('hide');
  console.log('we\'ve hidden everything and shows our loading');
  var url = $("#manga_url").val();
// debug!
  //console.log(url);
  // Validate URL somehow
  urlRouter(url);

// function to simpleSave(url)
function simpleSave(url) {

};
});//end tab_manga_from_url
function urlRouter(url) {
  if (url.indexOf('mangapark')) {
    //load mangapark
    require('./apis/mangapark')(url);
  }

}

function queue(list, name) {
/*
Algo: recive the obj with name and url
parse one by one to the download function and print everything
TODO: needs to be smart enough for removing or arrange the downloads in manga
This will download the list in the order given, wont sort the items inside a manga
Example manga_a = 3 ch
first: ch 1, next ch 2, next ch 3. or in the order given: ch 1, ch 4, ch 6.
In mangas, will download in the order given in the data from the app. Downlad list.
If a manga is clicked to cancel, destroy the request, and remove all the queue.
If a manga is paused, pause everything.
If a manga is moved to the first position, destroy the current task, and start the new manga
The position is saved as in the APP list.
The chap downloading needs to be saved, example:
            manga_a: ch 1, 26 pages, downloading number 15. Moved in queue list.
            destroy, don't count the page, so it will say last download is 14.
            start the next manga, when it's turn comes, start from the page 15.
*/

}
