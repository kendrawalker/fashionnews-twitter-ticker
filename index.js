//twitter ticker

const express = require('express');
const app = express();
const chalk = require('chalk');
const twitterApi = require('./twitterApi');


app.use(express.static(__dirname + '/public'));

app.get('/tweets', function(req, res) {
    console.log(chalk.magenta(req.method, req.url, req.header));
    return twitterApi.getToken().then(function(bearerToken) {
        return Promise.all([
            twitterApi.getTweetData(bearerToken, 'BoF'),
            twitterApi.getTweetData(bearerToken, 'PublicDesire'),
            twitterApi.getTweetData(bearerToken, 'fashion')
        ]).then(function(tweets) {
            //res.json(tweets);
            var tweetArray = tweets[0].concat(tweets[1], tweets[2]); //merging tweets to 1 array
            tweetArray.sort(function(a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }); //sorting the array by timestamp
            res.json(tweetArray);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });
});

app.listen(8080, function() {
    console.log(`listening`);
});
