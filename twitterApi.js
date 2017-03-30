const https = require('https');
const twitterCreds = require('./creds');
let joined = `${twitterCreds.consumerKey}:${twitterCreds.consumerSecret}`;
let encoded = new Buffer(joined).toString('base64');
var bearerToken;
var twitterData = {};

module.exports.getToken = getToken;
module.exports.getTweetData = getTweetData;


//making a reqest for a Bearertoken utilizing user twittercreds
//calling the callback with the bearerToken
function getToken() {
    return new Promise(function(resolve, reject) {
        var tokenReq = https.request({
            method: 'POST',
            host: 'api.twitter.com',
            path: '/oauth2/token',
            headers: {
                'Authorization': `Basic ${encoded}`,
                'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`
            }
        }, function(response) {
            var str = '';
            console.log(response.statusCode);
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                try {
                    bearerToken = JSON.parse(str).access_token;
                } catch(err) {
                    reject(err);
                }
                resolve(bearerToken);
            });
        });
        tokenReq.write('grant_type=client_credentials');
        tokenReq.end();
    });
}


//utilizing the token data provided to gather the tweets from the requested site
function getTweetData(token, screen_name) {
    return new Promise(function(resolve, reject) {
        console.log(token);
        var twitterDataReq = https.request({
            method: 'GET',
            host: 'api.twitter.com',
            path: '/1.1/statuses/user_timeline.json?screen_name=' + screen_name,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }, function(response){
            response.on('error', function(err) {
                reject(err);
            });
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                try {
                    twitterData = JSON.parse(str);
                } catch(err) {
                    reject(err);
                }
                resolve(processTweetData(twitterData));
            });
        });
        twitterDataReq.end();
    });
}


//validating data from twitter has at least 1 url, taking first url and pushing data to json
function processTweetData(data) {
    var twitterTextUrlData = [];
    data.forEach(function(tweet) {
        if(tweet.entities.urls[0]) {
            if(tweet.entities.urls[0].expanded_url) {
                console.log(tweet.entities.urls[0].expanded_url, tweet.text);
                console.log(tweet.entities.urls[0]);
                twitterTextUrlData.push({
                    "user": tweet.user.screen_name,
                    "text": tweet.text.replace(tweet.entities.urls[0].url,'').trim(),
                    "url": tweet.entities.urls[0].url,
                    "timestamp": tweet.created_at
                });
            }
        }
    });
    return twitterTextUrlData;
}
