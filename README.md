# Intro to this version 

This version builds on the previous (extracted below) where trying to build a bot that launches Monday Motivational stimulii into slack every Monday.

Will need lots of help as this is my first "coding" aka "tweaking" project that I'm actually going to try and finish. Who knows. 

# motivator

[![Build Status](https://travis-ci.org/kalyons11/motivator.svg?branch=master)](https://travis-ci.org/kalyons11/motivator) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Scheduled motivational quotes via Slack.

[About](#about) | [Installation](#installation) | [Extension](#extension)

## About

[(back to top)](#motivator)

I have created this repository for as a personal project to have a Slack app send me (and some friends)
motivational quotes each weekday morning. Feel free to use whatever code is available here for your own personal use. Do [cite properly](https://integrity.mit.edu/handbook/writing-code), though!

Here's the stack I went with:

- Node.js worker process (via [`node-schedule`](https://github.com/node-schedule/node-schedule))
- [Slack API](https://api.slack.com/)
- [Mongoose](http://mongoosejs.com/)
- [MongoDB instance hosted on Heroku](https://devcenter.heroku.com/articles/mongolab)
- [Travis CI](https://travis-ci.org) for unit testing/validation

## Installation

[(back to top)](#motivator)

1. Clone it.

	```
	$ git clone https://github.com/kalyons11/motivator.git
	$ cd motivator/
	```

2. Install it.

	```
	$ npm install
	```

3. Set up your environment variables.

    ```
    $ cp .sample-env .env
    ```
    
    Now, in the `.env` file, you should set the following keys accordingly:
    
    - `TEST_KEY`: **do not touch, used for testing**
    - `MOTIVATOR_DEBUG`: `true` or `false` according to your debug preference
    - `DEV_DB_URL`: url to local MongoDB instance
    - `PROD_DB_URL`: url to remote MongoDB instance
    - `SLACK_URL`: url to Slack app [webhook](https://api.slack.com/incoming-webhooks)

4. **[Optional]** Run some tests to make sure everything is okay.

	```
	$ npm test
	```

5. Once you have your `.env` set up, you can run the process locally to make sure everything works.

    ```
    $ npm start
    
    > motivator@1.0.0 start /path/to/repo/motivator
    > node src/index.js
    
    2018-01-04T04:51:09.524Z - info: Scheduled job.
    ```
## Extension

[(back to top)](#motivator)

You can also add your own quotes to the database as you come across them.

**Note: Make sure you have your `MOTIVATOR_DEBUG` variable set correctly here
so you write to the desired database.**

```
$ npm run-script add

> motivator@1.0.0 start /path/to/repo/motivator
> node src/add.js

prompt: text: 
```

You can enter the text and author for a given quote, then type `y`
continue and add another, for as long as you want!

Once you are done adding quotes, simply type `n` at the continue prompt.
