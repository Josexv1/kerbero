const async = require('async');
//const request = require('request');
var request = require('requestretry');
const fs = require('fs');
const progress = require('request-progress');
let manager = {
  "downloading": {
    "Naruto": {
      "chapter 700": {
        "link": "https://mangapark.me/xd-manga",
        "imgs": {
    		  // "1" : "http://localhost/pic/1.jpg",
    		  // "2" : "http://localhost/pic/2.jpg",
    		  // "3" : "http://localhost/pic/3.jpg",
    		  // "4" : "http://localhost/pic/4.jpg",
    		  // "5" : "http://localhost/pic/5.jpg",
    		  // "6" : "http://localhost/pic/6.jpg",
    		  // "7" : "http://localhost/pic/7.jpg",
          "8" : "http://3.p.mpcdn.net/36697/816447/1.jpg",
          "9" : "http://3.p.mpcdn.net/36697/816447/2.jpg",
          "10" : "http://3.p.mpcdn.net/36697/816447/3.jpg",
          "11" : "http://3.p.mpcdn.net/36697/816447/4.jpg",
          "12" : "http://3.p.mpcdn.net/36697/816447/5.jpg",
          "13" : "http://3.p.mpcdn.net/36697/816447/6.jpg",
          "14" : "http://3.p.mpcdn.net/36697/816447/7.jpg"
        }
      }
    }
  },
  "waiting":{
    "Bleach": {
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      }
    },
    "Overlord": {
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      }
    },
    "Shingeki no kyojin": {
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      },
      "chapter 1": {
        "link": "url"
      }
    }
  }
}
let { downloading, waiting } = manager
let waiting_list = Object.keys(waiting)
console.log('We have ' + waiting_list.length + ' manga in queue.');
waiting_list.map((index, elem) => {
  console.log('Manga: ',waiting_list[elem] + ' is number ' + elem);
})
let currentManga = Object.keys(downloading)[0]
console.log('==========================\nCurrent manga: ',currentManga);
let currentChapter = Object.keys(downloading[currentManga])[0]
console.log('Current chapter: ', currentChapter);
let currentImg = Object.values(downloading[currentManga][currentChapter])[1]
console.log('Building Downloading Now new list\n==========================');

let q = async.queue(function(task, next) {//cn is callback //task is pic object
  progress(
    // progress request
    request({
      url: task.url,
      json: false,
      timeout: 5000,
      // The below parameters are specific to request-retry
      maxAttempts: 5,   // (default) try 5 times
      retryDelay: 1000,  // (default) wait for 5s before trying again
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    }, function(err, response, body){
      // this callback will only be called when the request succeeded or after maxAttempts or on error
      if (response) {
        console.log('The number of request attempts: ' + response.attempts);
      }
    })
    //end progress request
  )
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
      console.log('Downloading at: ', (state.speed/1024).toFixed(2)+' KB');
      console.log('ETA: ', state.time.remaining + ' s');
      console.log((state.size.transferred/1024).toFixed(2) + ' of ' + (state.size.total/1024).toFixed(2));
      // update the bottom downloading stuff
      // update the download tab stuff! TODO FIXME IMPORTANT
  })
  .on('error', function (err) {
      // Do something with err
      console.log('Error: ',err);
  })
  .on('end', function () {
      console.log('Finished downloading pic number: '+ task.name +' to ', task.saveName);
      // delete the current pic from the object we're working on.
      next();
  })
  .pipe(fs.createWriteStream(task.saveName));
}, 1);

q.drain = function() {
  console.log('=== \nFinished the list!')
  // when the downloading manga has finished all its chapters delete it
  // call if theres other manga waiting, push it to the downloading

};
q.empty = function() {
		return console.log("Last batch item of the queue will now be processed")
	}

for (var item in currentImg) {
  let downloadingNow = {}
  if (currentImg.hasOwnProperty(item)) {
    downloadingNow.name = item
    downloadingNow.url = currentImg[item]
    downloadingNow.saveName = item + '.jpg'
    q.push(downloadingNow, function(err){
      if (err) {
        console.log('We have an error pushing to the queue', err);
      }
      console.log('Pushed pic number: '+ downloadingNow.name +' to the queue');
    })
  }
}
