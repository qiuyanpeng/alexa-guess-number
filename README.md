# guess-number on Alexa without AWS lambda

APP_ID: `amzn1.ask.skill.7859296a-b566-48f4-abdb-0f3731823950`

I just wanted to play with Alexa a bit but my AWS account is somehow locked and I cannot deploy lambda function...
I managed to get around with the following piece of code. 

```javascript
app.post('/', function(req, res) {
  let context = {
    'succeed': function(alexaResponse) {
      res.append('Content-Type', 'application/json');
      res.status(200).send(alexaResponse);
    },
    'fail': function() {
      res.status(500);
    }   
  }
 
  // Alexa.handler(event, context, callback); 
  let alexa = Alexa.handler(req.body, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
});
```

instead of what's in the [sample code using lambda](https://github.com/alexa/skill-sample-nodejs-fact/blob/en-US/lambda/custom/index.js#L51):

```javascript
exports.handler = function (event, context) {
  let alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
}
```

Basically, I need to partially re-implement an `context` object following https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-using-old-runtime.html#nodejs-prog-model-oldruntime-context-methods.

This simple server-side code can work well in Alexa Service Simulator with JSON request, but it doesn't work yet work with TEXT request. Looks like I haven't configured the skill intent with sample queries well...

This hack won't handle streaming request or [Progressive Response](https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html#send-a-progressive-response). For full development of Alexa skill, we should still use Alexa SDK with AWS lambda.

## How to run

```
npm install --save alexa-sdk
npm install --save express
node index.js
ngrok http 8080
```

Make sure to change the Alexa Skill's configured HTTPS endpoint with the newly assigned ngrok URL.

## Related docs
- https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html
- https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#response-format
- https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
- https://github.com/alexa/skill-sample-nodejs-fact


