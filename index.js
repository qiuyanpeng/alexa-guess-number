'use strict';
const Alexa = require('alexa-sdk');
const express = require('express')
const bodyParser = require('body-parser')

const APP_ID = 'amzn1.ask.skill.7859296a-b566-48f4-abdb-0f3731823950';

const SKILL_NAME = 'Guess Number Game';
const HELP_MESSAGE = 'You can play guess number game. What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const WELCOME_MESSAGE = 'Welcome to Guess Number Game. Please guess a number between 1 and 100.';
const GUESS_NUMBER_REPROMPT = 'Please guess a number between 1 and 100.';
const INVALID_NUMBER_MESSAGE = 'The number must be between 1 and 100.';
const TOO_BIG_NUMBER_MESSAGE = 'Too big.';
const TOO_SMALL_NUMBER_MESSAGE = 'Too small';
const CONGRATULATION_MESSAGE = 'Congratulations! You\'ve got the number!';


let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({type: 'application/json'}));

app.post('/', function(req, res) {
  console.log(JSON.stringify(req.body));

  let context = {
    'succeed': function(alexaResponse) {
      res.append('Content-Type', 'application/json');
      res.status(200).send(alexaResponse);
    },
    'fail': function() {
      res.status(500);
    }
  }

  let alexa = Alexa.handler(req.body, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
});

let server = app.listen(app.get('port'), function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});


let randomNumber = Math.floor((Math.random() * 100)) + 1;
console.log('randomNumber:' + randomNumber);


const handlers = {
    'LaunchRequest': function () {
        this.emit('StartGuessNumber');
    },
    'StartGuessNumber': function () {
        let randomNumber = Math.floor((Math.random() * 100)) + 1;
        console.log('randomNumber:' + randomNumber);
        this.emit(':elicitSlotWithCard', 'number', WELCOME_MESSAGE,
            GUESS_NUMBER_REPROMPT, SKILL_NAME, WELCOME_MESSAGE);
    },
    'GuessNumber': function () {
        let number = this.event.request.intent.slots.number.value;
        console.log('guessed number: ' + number);
        if (number === undefined || number < 1 || number > 100) {
          this.emit(':elicitSlotWithCard', 'number', INVALID_NUMBER_MESSAGE,
              GUESS_NUMBER_REPROMPT, SKILL_NAME, INVALID_NUMBER_MESSAGE);
        } else if (number < randomNumber) {
          this.emit(':elicitSlotWithCard', 'number', TOO_SMALL_NUMBER_MESSAGE,
              GUESS_NUMBER_REPROMPT, SKILL_NAME, TOO_SMALL_NUMBER_MESSAGE);
        } else if (number > randomNumber) {
          this.emit(':elicitSlotWithCard', 'number', TOO_BIG_NUMBER_MESSAGE,
              GUESS_NUMBER_REPROMPT, SKILL_NAME, TOO_BIG_NUMBER_MESSAGE);
        } else {
          // TODO(qyp): Ask to restart and re-generate random number.
          this.emit(':tellWithCard', CONGRATULATION_MESSAGE, SKILL_NAME,
              CONGRATULATION_MESSAGE);
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
