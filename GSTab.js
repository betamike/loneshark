var GSActions = {     
    "none" : 0,
    "song" : 1, 
    "artist" : 2, 
    "album" : 3, 
    "playlist" : 4, 
    "user" : 5, 
    "search" : 6 };

function GSTab(tab)
{
    this.tab = tab;

    domainPattern = new RegExp("((https?://)?(staging\.)?(preview|listen)\.grooveshark\.com)/?#?(/.*/.*/[0-9a-zA-Z]*)?");
    domainMatch = domainPattern.exec(tab.url);

    this.domain = domainMatch[1]; 
    this.fragment = (domainMatch[5] == undefined) ? "" : domainMatch[5];

    newUrl = this.domain + "/#" + this.fragment;
    chrome.tabs.update(this.tab.id, { url: newUrl }, this.updateTab);
}

GSTab.isGroovesharkURL = function( url )
{
    gsPattern = new RegExp("((https?://)?(staging\.)?(preview|listen)\.grooveshark\.com)/?#?(/.*/.*/[0-9a-zA-Z]*)?");
    return gsPattern.test(url);
}

GSTab.prototype.getTab = function() { return this.tab; };

GSTab.prototype.setFragment = function (newFragment, updateCallback) 
{
    this.fragment = newFragment;
    
    newUrl = this.domain + "/#" + this.fragment;

    console.log("new: " + newUrl + " old: " + this.tab.url);
    
    //prevents page from refreshing
    if (newUrl == this.tab.url)
    {
        return;
    }

    if (updateCallback == null)
    {
        chrome.tabs.update(this.tab.id, { url: newUrl }, this.updateTab);
    }
    else 
    {
        localTab = this.tab
        chrome.tabs.update(this.tab.id, { url: newUrl }, function(tab) { 
                localTab = tab; updateCallback(tab); });
    }
}

GSTab.prototype.updateTab = function(tab) { this.tab = tab} 

GSTab.prototype.getFragment = function() {  return this.fragment; }

GSTab.prototype.getAction = function ()
{
    action = GSActions.none;

    if (this.fragment == "")
    {
        return action;
    }

    segments = this.fragment.split("/");
    switch (segments[1])
    {
        case "song":
        case "s":
            action = GSActions.song;
            break;

        case "album":
            action = GSActions.album;
            break;
        case "artist":
            action = GSActions.artist;
            break;
            
        case "playlist":
        case "p":
            action = GSActions.playlist;
            break;

        case "user":
        case "u":
            action = GSActions.user;
            break;
            
        case "search":
            action = GSActions.search;
            break;
    }

    return action;
}

GSTab.prototype.getToken = function ()
{
    segments = this.fragment.split("/");

    return (segments != null) ? segments[segments.length - 1] : null;

}
