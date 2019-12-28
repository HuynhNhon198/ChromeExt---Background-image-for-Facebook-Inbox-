chrome.storage.local.get('bgChat_HuynhNhon', function (obj) {
    if (Object.keys(obj).length === 0) {
        chrome.storage.local.set({
            bgChat_HuynhNhon: []
        });
    }
})
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://www.facebook.com/huynhnhon198";
    chrome.tabs.create({ url: newURL });
});