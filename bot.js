var twit = require('twit');
try {
    var config = require('./config.js');
} catch(err) {
    console.log("config.js file not found. copy the following into a config.js file, paste in your Twitter keys, and place in the root directory of the project:\nmodule.exports = {\n\tconsumer_key: '',\n\tconsumer_secret: '', \n\taccess_token: '',\n\taccess_token_secret: ''\n};\n");
}

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
