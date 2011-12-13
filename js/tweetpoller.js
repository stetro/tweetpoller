/*
Tweetpoller loads new tweets from timeline

Settings:
        ->  time
            // pollingintervall
        ->  element
            // selected ul element for tweets (li)
        ->  filter_value
            // user_id to load from
        ->  filter_attr
            // filter attr like 'screen_name' or 'user_id'
        ->  count
            // max viewed tweets
        ->  fade_last_out
            // keep max viewed tweet, fading out the last tweet
        ->  read_more_link
            // show link for more
        ->  read_more_link_text
            // linktext for more
        ->  loading_element
            // loading element
    
Author : Steffen Troester (stetro)
Website: stetro.wordpress.com
    
*/

// class Tweetpoller setup with args

function Tweetpoller(args, element) {
    // basic settings
    this.tweetpoller_setup = {
        "time": 20000,
        // pollingintervall
        "element": element,
        // selected ul element for tweets (li)
        "filter_value": "0",
        // user_id to load from
        "filter_attr": "user_id",
        // filter attr like 'screen_name' or 'user_id'
        "since_id": "0",
        // to load new items
        "count": 10,
        // max viewed tweets
        "fade_last_out": true,
        // keep max viewed tweet, fading out the last tweet
        "read_more_link": true,
        // show link for more
        "read_more_link_text": "show more on twitter",
        // linktext for more
        "play_sound" : false,
        // play sound if new tweet arrived
        "loading_element" : "#tweetpoller-loader"
        // loading element
    };

    // check and validate attributes
    for (var setting in args) {
        if (setting == "time" && !isNaN(args.time)) {
            this.tweetpoller_setup.time = args.time;
        }
        if (setting == "filter_attr") {
            this.tweetpoller_setup.filter_attr = args.filter_attr;
        }
        if (setting == "filter_value") {
            this.tweetpoller_setup.filter_value = args.filter_value;
        }
        if (setting == "count" && !isNaN(args.count)) {
            this.tweetpoller_setup.count = args.count;
        }
        if (setting == "fade_last_out") {
            this.tweetpoller_setup.fade_last_out = (args.fade_last_out === true);
        }
        if (setting == "read_more_link") {
            this.tweetpoller_setup.read_more_link = (args.read_more_link === true);
        }
        if (setting == "read_more_link_text") {
            this.tweetpoller_setup.read_more_link_text = args.read_more_link_text;
        }
        if(setting == "loading_element"){
            this.tweetpoller_setup.loading_element = args.loading_element;
        }
    }
}


// check twitter timeline first time !
Tweetpoller.prototype.load_timeline = function() {
    var _object = this; // reference for callback methode
    // jQuery Callback for cross-scripting
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?" + this.tweetpoller_setup.filter_attr + "=" + this.tweetpoller_setup.filter_value + "&count=" + this.tweetpoller_setup.count + "&callback=?";
    // fadeIn loading Element 
    $(this.tweetpoller_setup.loading_element).fadeIn();
    // load JSON file from twitter API
    jQuery.getJSON(url, function(data) {
        // if data is empty
        if (data.length === 0) {
            return 0; // ERROR
        }
        // add read_more - link if setting is set
        if (_object.tweetpoller_setup.read_more_link === true) {
            // load screenname from first tweet
            var screen_name = data[0].user.screen_name;
            // get link_text
            var url_text = _object.tweetpoller_setup.read_more_link_text;
            // generate url element
            var more_link = '<div id="twitter-bottom"><a href="http://twitter.com/' + screen_name + '">' + url_text + '</a></div>';
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
        // fadeOut loadingelement
        $(_object.tweetpoller_setup.loading_element).fadeOut();
        // show tweets via slideDown()
        jQuery(_object.tweetpoller_setup.element).find(".tweet").slideDown('fast');

    });
    this.set_polling();
};

// check twitter timeline and start new 
Tweetpoller.prototype.check_timeline = function() {
    var _object = this; // reference for callback methode
    // jQuery Callback for cross-scripting
    var url = "http://api.twitter.com/1/statuses/user_timeline.json?" + this.tweetpoller_setup.filter_attr + "=" + this.tweetpoller_setup.filter_value + "&since_id=" + this.tweetpoller_setup.since_id + "&callback=?";
    // fadeIn loading Element 
    $(this.tweetpoller_setup.loading_element).fadeIn();
    // load JSON file from twitter API
    jQuery.getJSON(url, function(data) {
        // go through all tweets
        jQuery.each(data, function(key) {
            // print all tweets ( true->prepand )
            _object.print_tweet(data[key], true);
        });
        // fadeOut loading Element 
        $(_object.tweetpoller_setup.loading_element).fadeOut();
        // slideDown hidden tweets
        jQuery(_object.tweetpoller_setup.element).find(".tweet").slideDown('fast');

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
    // generate d.m.Y h:i:s
    var format_date = date.getDay().pad(2) + "." + date.getMonth().pad(2) + "." + date.getFullYear() + " - " + date.getHours().pad(2) + ":" + date.getMinutes().pad(2) + ":" + date.getSeconds().pad(2);
    // generate tweetitem
    var tweet_form = '<li class="tweet">' + tweet.text + '<div class="datum">' + format_date + '</li></li>';
    // chose prepend or append
    if (dir === true) {
        //prepand tweet
        jQuery(this.tweetpoller_setup.element).prepend(tweet_form);
        // remove last item if fade_last_out setting is true
        if (this.tweetpoller_setup.fade_last_out === true) {
            jQuery(this.tweetpoller_setup.element).find("li:last").slideUp('fast', function() {
                $(this).remove();
            });
        }
    }
    else {
        // append tweet
        jQuery(this.tweetpoller_setup.element).append(tweet_form);
    }
    // remember last tweet with highest tweet_id
    if ((tweet.id_str) > this.tweetpoller_setup.since_id) {
        this.tweetpoller_setup.since_id = tweet.id_str;
    }
};

// extends Number prototype with pad() - fill in zeros 
Number.prototype.pad = function(len) {
    return (new Array(len + 1).join("0") + this).slice(-len);
};