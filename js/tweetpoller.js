/*
Tweetpoller loads new tweets from timeline

Settings:
    time    ->  pollinginterval
    user_id ->  Twitter-User ID     -> http://www.idfromuser.com/
    
Author : Steffen Troester

TODO:   - Naviagtion
        - Testing

    
*/

// class Tweetpoller setup with args

function Tweetpoller(args, element) {
    // basic settings
    this.tweetpoller_setup = {
        "time": 5000,
        "element": element,
        "user_id": 1,
        "since_id": 0,
        "count": 10
    };

    // check and validate attributes
    for (var setting in args) {
        if (setting == "time" && !isNaN(args.time)) {
            this.tweetpoller_setup.time = args.time;
        }
        if (setting == "user_id" && !isNaN(args.user_id)) {
            this.tweetpoller_setup.user_id = args.user_id;
        }
        if (setting == "count" && !isNaN(args.count)) {
            this.tweetpoller_setup.count = args.count;
        }
    }
}


// check twitter timeline first time !
Tweetpoller.prototype.load_timeline = function() {
    var _object = this; // reference for callback methode
    // jQuery Callback for cross-scripting
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?user_id=" + this.tweetpoller_setup.user_id + "&count=" + this.tweetpoller_setup.count + "&callback=?";
    // load JSON file from twitter API
    jQuery.getJSON(url, function(data) {
        // empty the tweetarea
        jQuery(_object.tweetpoller_setup.element).empty();
        // go through all tweets
        jQuery.each(data, function(key) {
            // print all tweets
            _object.print_tweet(data[key]);
        });
        // show tweets via slideDown()
        jQuery(_object.tweetpoller_setup.element).find(".tweet").slideDown();

    });
    this.set_polling();
};

// check twitter timeline and start new 
Tweetpoller.prototype.check_timeline = function() {
    var _object = this; // reference for callback methode
    // jQuery Callback for cross-scripting
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?user_id=" + this.tweetpoller_setup.user_id + "&since_id=" + this.tweetpoller_setup.since_id + "&callback=?";
    // load JSON file from twitter API
    jQuery.getJSON(url, function(data) {
        // go through all tweets
        jQuery.each(data, function(key) {
            // print all tweets ( true->prepand )
            _object.print_tweet(data[key], true);
        });
        // slideDown hidden tweets
        jQuery(_object.tweetpoller_setup.element).find(".tweet").slideDown();

    });
    this.set_polling();
};

// sets timout for every 'time' period
Tweetpoller.prototype.set_polling = function() {
    var _object = this; // reference for callback methode
    window.setTimeout(function() {
        // after timeout check the timeline
        _object.check_timeline();
    }, this.tweetpoller_setup.time); // wait for 'time' ms
};

// extense jQuery fn object 
jQuery.fn.tweetpoller = function(args) {
    // generate new Tweetpoller
    var tp = new Tweetpoller(args, this);
    // start fist poll
    tp.load_timeline();
};

// echo Tweet
Tweetpoller.prototype.print_tweet = function(tweet, dir) {
    // parse datetime 
    var date = new Date(tweet.created_at);
    // generate tweetitem
    var tweet_form = '<li class="tweet">' + tweet.text + '<div class="datum">' + date + '</li></li>';
    // chose prepend or append
    if (dir !== null || dir) {
        jQuery(this.tweetpoller_setup.element).append(tweet_form);
    }
    else {
        jQuery(this.tweetpoller_setup.element).prepend(tweet_form);
    }
    // remember last tweet with highest tweet_id
    if (tweet.id > this.tweetpoller_setup.since_id) {
        this.tweetpoller_setup.since_id = tweet.id;
    }
};