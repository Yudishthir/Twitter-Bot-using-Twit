//make a config.js file to hold the access and consumer keys

console.log("The Twitter bot is starting");

var Twit = require('twit');
var config = require('./config');
var fs = require('fs');

var T = new Twit(config);

tweetVideo('tweettest.mp4');

function postTweet(text)  //Code to post a text tweet on Twitter
{
  var tweetData = {
    status: text
  }

  T.post('statuses/update', tweetData, postData);

  function postData(err, data, response) {
    if (err) {
      console.log("An error was encountered:\n" + err);
    }
    else {
      console.log("Tweet successfully posted on the page");
    }
  }
}

function getTweet(search, date) //Code to search with keywords and a dates
{
  var params = {
    q: search + ' since:' + date,
    count: 100
  };

  T.get('search/tweets', params, gotData);

  function gotData(err, data, response) {
    if (err) {
      console.log("An error was encountered:\n" + err);
    }
    else 
    {
      var tweets = data.statuses;

      for (let index = 0; index < tweets.length; index++) {
        console.log(tweets[index].text);
      }
    }
  }
}

function postMedia(path, text) //Code to post media on Twitter with a text caption
{
  var filename = path;
  var params = {
    encoding: 'base64'
  };

  var b64 = fs.readFileSync(filename, params);

  var encode = {
    media_data: b64
  }

  T.post('media/upload', encode, uploaded);

  function uploaded(err, data, response) {
    if (err) {
      console.log("An error was encountered:\n" + err);
    }
    else {
      var id = data.media_id_string;

      var tweet = {
        status: text,
        media_ids: [id]
      }
      
      var altText = "A picture uploaded from node.js"
      var meta_params = { 
        media_id: id, 
        alt_text: { 
          text: altText 
        } 
      }

      T.post('media/metadata/create', meta_params, function (err, data, response) {
    
        if (!err) {
          T.post('statuses/update', tweet, uploadMedia);
        }
        else
        {
          console.log('An error was encountered: '+err);
        }
      })

      function uploadMedia(err, data, response) {
        if (err) {
          console.log("An error was encountered:\n" + err);
        }
        else {
          console.log("Media successfully posted on the page");
          console.log(data);
        }
      }
    }
  }
}

//--------------------------------------------------------------Get followers of a certain username------------------------------------------------------------------
function getFollowers(username) 
{
  var user = {
    screen_name: username
  };

  T.get('followers/list', user , followers);
  
  function followers(err, data, response) {
    if (err) {
      console.log("An error was encountered:\n" + err);
    }
    else {
      var follower = data.users;
      var output = '{"Followers":[]}';
  
      var obj = JSON.parse(output);
  
      let i;
      for(i = 0; i < follower.length ; i++)
      {
        obj['Followers'].push({"id": follower[i].id , "name": follower[i].name , "username" : follower[i].screen_name});
      }
      
      output = JSON.stringify(obj);
      obj['Follower_Count'] = i;
      
      console.log(obj); 
    }
  }
}
//-------------------------------------------Currently only retrieves 20 followers, look over cursoring in api documentation------------------------------------------

//---------------------------------------------Same code, but infinite loop-----------------------------------------------------------
    // T.get('followers/list', {screen_name: 'beccalicious__', count: 200}, getData);
    // function getData(err, data, response) {     
    //   while (data['next_cursor'] > 0)
    //     {
    //         var followers = data.users;
    //         for (var i = 0; i < followers.length ; i++) 
    //         {  
    //           console.log('.@' + followers[i].screen_name);
    //         }    

    //         console.log('next_cursor: ' + data['next_cursor']);
    //         T.get('followers/list', {screen_name: 'beccalicious__',cursor: data['next_cursor'] },getData);
    //     }    
    // }
//----------------------------------------------Maxed out at 200 values----------------------------------------------------------------

function getSuggestion() //Code to get suggestions for your account
{
  T.get('users/suggestions', function (err, data, response) {
    if(err){
      console.log('An error was encountered: '+err);
    }
    else{
      for (let i = 0 ; i < data.length ; i++) {
        console.log(data[i].name);
      }
    }
  })
}

function getSuggestionSlug(search) //Code to get suggestions for your account based on a specific slug
{
  T.get('users/suggestions/:slug', { slug: search }, function (err, data, response) {
    if(!err)
    {
      for (let i = 0 ; i < data.length ; i++) {
        console.log(data[i].name);
      }
    }
    else
    {
      console.log('An error was encountered: '+err);
    }
  })
}

function tweetVideo(path) {
  var filePath = { 
    file_path: path 
  };

  T.postMediaChunked(filePath , function (err, data, response) {
    if(err)
    {
      console.log('An error was encountered: '+err);
    }
    else{
      console.log('Video posted');
      console.log(data);
    }
  })
}
