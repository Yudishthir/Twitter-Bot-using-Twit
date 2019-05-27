# Twitter-Bot-using-Twit
Codes for a Twitter bot that implements the Twitter API and Twit which provides a REST client for the API

## Intialization
Initialize the local repository with **npm** and add the **twit** package

```BASH
    npm init
    npm install twit
```

Go to the Twitter developers page and register yourself and the app to get the consumer and access keys.
Paste these keys in the *config.js* files.

Link to Twit and it's documentation : [https://github.com/ttezel/twit](https://github.com/ttezel/twit)
Link to Twitter developer's page : [https://developer.twitter.com](https://developer.twitter.com)

## Note
 1. Twitter has removed the streaming functionalities from their API, hence all streams in Twit will not work
 1. The *get()* functions can at max, retrieve only 200 data items. Cursoring has to be used to fix this problem, although i still haven't been able to do it.
 
Link to the cursoring documentation : [https://developer.twitter.com/en/docs/basics/cursoring](https://developer.twitter.com/en/docs/basics/cursoring)

## Tasklist
 * [ ] Retrieve more than 200 data items at once.
 * [ ] Find a work around for streaming.
