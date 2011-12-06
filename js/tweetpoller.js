/*
Tweetpoller loads new tweets from timeline

Settings:
    time    ->  pollinginterval
    user_id ->  Twitter-User ID     -> http://www.idfromuser.com/
    
Author : Steffen Troester
    
*/

// class Tweetpoller setup with args

function Tweetpoller(args, element) {
    // basic settings
    this.tweetpoller_setup = {
        "time": 20000,          // pollingintervall
        "element": element,     // selected ul element for tweets (li)
        "user_id": 1,           // user_id to load from
        "since_id": "0",        // to load new items
        "count": 10,            // max viewed tweets
        "fade_last_out":true,   // keep max viewed tweet, fading out the last tweet
        "read_more_link": true,  // Show link for more
        "read_more_link_text" : "show more on twitter"
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
        if(setting == "fade_last_out")
        {
            this.tweetpoller_setup.fade_last_out = (args.fade_last_out === true);
        }
        if(setting == "read_more_link")
        {
            this.tweetpoller_setup.read_more_link = (args.read_more_link === true);
        }
        if(setting == "read_more_link_text")
        {
            this.tweetpoller_setup.read_more_link_text = args.read_more_link_text;
        }
    }
}


// check twitter timeline first time !
Tweetpoller.prototype.load_timeline = function() {
    var _object = this; // reference for callback methode
    // jQuery Callback for cross-scripting
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?user_id=" + 
    this.tweetpoller_setup.user_id + "&count=" + this.tweetpoller_setup.count + 
    "&callback=?";
    // load JSON file from twitter API
    jQuery.getJSON(url, function(data) {
        // if data is empty
        if(data.length === 0)
        {
            return 0;   // ERROR
        }
        // add read_more - link if setting is set
        if(_object.tweetpoller_setup.read_more_link === true){
            // load screenname from first tweet
            var screen_name = data[0].user.screen_name;
            // get link_text
            var url_text = _object.tweetpoller_setup.read_more_link_text;
            // generate url element
            var more_link = '<div id="twitter-bottom"><a href="http://twitter.com/'+
                            screen_name+'">'+url_text+'</a></div>';
            // append after ul "element"
            jQuery(_object.tweetpoller_setup.element).after(more_link);
        }
        // empty the tweetarea
        jQuery(_object.tweetpoller_setup.element).empty();
        // go through all tweets
        jQuery.each(data, function(key) {
            // print all tweets ( false->append )
            _object.print_tweet(data[key], false);
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
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?user_id=" + 
    this.tweetpoller_setup.user_id + "&since_id=" + 
    this.tweetpoller_setup.since_id + "&callback=?";
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

// echo Tweet (dir=true -> prepand())
Tweetpoller.prototype.print_tweet = function(tweet, dir) {
    // parse datetime 
    var date = new Date(tweet.created_at);
    var format_date = date.getDay().pad(2)+"."+date.getMonth().pad(2)+"."+date.getFullYear()+
    " - "+date.getHours().pad(2)+":"+date.getMinutes().pad(2)+":"+date.getSeconds().pad(2);
    // generate tweetitem
    var tweet_form = '<li class="tweet">' + tweet.text + '<div class="datum">' + 
    format_date + '</li></li>';
    // chose prepend or append
    if (dir===true) {
        jQuery(this.tweetpoller_setup.element).prepend(tweet_form);
        if(this.tweetpoller_setup.fade_last_out===true)
        {
            jQuery(this.tweetpoller_setup.element).find("li:last").slideUp(function(){
                $(this).remove();
            });
        }
    }
    else {
        jQuery(this.tweetpoller_setup.element).append(tweet_form);
    }
    // remember last tweet with highest tweet_id
    if ((tweet.id_str) > this.tweetpoller_setup.since_id) {
        this.tweetpoller_setup.since_id = tweet.id_str;
    }
};

// extends Number prototype with pad() - fill in zeros
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
};
