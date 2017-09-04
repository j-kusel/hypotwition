var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var retweet = function() {
    var params = {
        q: '#hypostition, #Hypostition',
        // lang: 'en',
        result_type: 'recent'
    };

    Twitter.get('search/tweets', params, (err, data) => {
        if (!err) {
            if (!data.statuses.length) {
                console.log('no recent tweets found (in past 6-9 days)');
            } else {
                console.log('length: ' + data.statuses.length);
                var interval = 3600000 / data.statuses.length;
                for (var i = 0; i < data.statuses.length; i++) {
                    var retweetId = data.statuses[i].id_str;
                    setTimeout(function (index, id) {
                        Twitter.post('statuses/retweet/:id', {
                            id: id
                        }, (err, response) => {
                            if (err) {
                                console.log('ERROR1: ' + err);
                            } else if (response) {
                                console.log('retweet successful. ' + index);
                            }
                        })
                    }, interval * i, data.statuses.length - i, retweetId);
                }
            }
        } else {
            console.log('ERROR2: ' + err);
        }
    });
};

retweet();
setInterval(retweet, 3600000);
