console.log("The Twitter bot is starting");

var Twit = require('twit');
var config = require('./config');
var fs = require('fs');

var T = new Twit(config);

// --------------------------------------------------Streaming code to reply when followed (live tweets)---------------------------------------------------------------
// var stream = T.stream('user');

// stream.on('follow', followed);

// function followed(event) {
//   console.log('reached followed');
//   var name = event.source.name;
//   var screenName = event.source.screen_name;
//   postTweet('@'+ screenName + 'thank you for following me');
//   console.log('Follow reply issued');
// }
//---------------------------------------------------Removed from the twitter API---------------------------------------------------------------------------------------

function postTweet(text)  // Code to post a text tweet on Twitter
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

function getTweet(search, date) //The code to search with keywords and a dates
{
  var params = {
    q: search + ' since:' + date,
    count: 100
  };

  T.get('search/tweets', params, gotData);

  function gotData(err, data, response) {
    var tweets = data.statuses;

    for (let index = 0; index < tweets.length; index++) {
      console.log(tweets[index].text);
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
    var id = data.media_id_string;

    var tweet = {
      status: text,
      media_ids: [id]
    }

    T.post('statuses/update', tweet, uploadMedia);
  }

  function uploadMedia(err, data, response) {
    if (err) {
      console.log("An error was encountered:\n" + err);
    }
    else {
      console.log("Media successfully posted on the page");
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