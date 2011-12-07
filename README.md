#Tweetpoller - jQuery Plugin

##About

This jQuery Plugin load a number of tweets from the Twitter API and displays them in a HTML list (li - Element). It also updates every n seconds and place new tweets at the top of list.

##Usage

Select an <ul> Element in DOM and use tweetpoller() methode.
Exsample:

```javascript
$(function(){
	$("#twitter-tweets").tweetpoller(
        {
        "filter_value"          :   "TAGESSCHAU",
        "filter_attr"           :   "screen_name",
        "time"                  :   20*1000,
        "count"                 :   7,
        "read_more_link_text"   :   "Mehr Tweets ..."
        }
    );
});
```

### Parameter
* **filter_attr** - Twitter API attribute like 'screen_name' or 'user_id'
* **filter_value** - Twitter API attribute value (Twitter Account)
* **time** - polling interval in ms
* **count** - how many tweets are seen
* **read_more_link** - (boolean) if a "Read More ..." link appends after the <ul>
* **read_more_link_text** - text for link like "Read More ..."
* **fade_last_out** - (boolean) fade out last if new tweets are available


