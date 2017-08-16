const shell = require('electron').shell;
const remote = require('electron').remote;
const dialog = remote.dialog;
const packageFile = remote.require('./package.json');
const path = remote.require('path');
const appConfig = require('./config.json');
const app = remote.app;
const downloadPathDefault = app.getPath('pictures');
//TODO: update with userDefined settings.
const defaultConfig =
  {
    "app": {
      "option": "",
      "showHelp": false
    },
    "userDefined": {
      "downloadFolder": "",
      "downloadThreads": "3",
      "language": "English",
      "checkNewChapterFreq": "1",
      "checkAppUpdateFreq": "1",
      "downloadExt": "ZIP",
      "mangaFavs": {
        "": ""
      },
      "myAnimeList": {
        "updateMangaFreq": "1",
        "api": "",
        "data": "data",
        "data2": "data"
      }
    }
  };
defaultConfig.userDefined.downloadFolder = downloadPathDefault;
const defaultMangaConf = {
    "coverLocation": "",
    "name": "",
    "altNames": "",
    "author": "",
    "artist": "",
    "genres": "",
    "type": "",
    "status": "",
    "release": "",
    "description": "",
    "latestInServer": "",
    "latestDownloaded": "",
    "downloadLocation": "",
    "link": ""
};

(function () {
  //open links externally by default
  $(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();
    shell.openExternal(this.href);
  });
  // Open DevTools when F12 is pressed
  document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
      remote.getCurrentWindow().toggleDevTools();
    }
  });

  // Function to make title-bar work
  function initTitleBar() {
    let $titleBar = $('#title-bar');
    const window = remote.getCurrentWindow();

    $titleBar.find('#application_version').text(packageFile.version);
    $titleBar.find('#application_name').text(packageFile.productName);
    // minimize function
    $titleBar.find('#min-btn').on('click', function () {
      window.minimize();
    });
    // maximize function
    $titleBar.find('#max-btn').on('click', function () {
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
    });
    // close function
    $titleBar.find('#close-btn').on('click', function () {
      window.close();
    });
  }

  // Ready state of the page
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      initTitleBar();
      // open the download folder when clickd in the settings
      $('#settings_download_folder').on('click', function () {
        $(this).val(dialog.showOpenDialog({
          properties: ['openDirectory']
        }));
      });
    }
  };
})(jQuery);
