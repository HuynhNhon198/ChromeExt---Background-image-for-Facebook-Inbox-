chrome.storage.local.get('bgChat_HuynhNhon', function (obj) {
    if (Object.keys(obj).length === 0) {
        chrome.storage.local.set({
            bgChat_HuynhNhon: []
        });
    }
})
chrome.storage.local.get('bgChatMess_HuynhNhon', function (obj) {
    if (Object.keys(obj).length === 0) {
        chrome.storage.local.set({
            bgChatMess_HuynhNhon: []
        });
    }
})
chrome.browserAction.setPopup({popup:''});  //disable browserAction's popup

chrome.browserAction.onClicked.addListener(()=>{
    chrome.tabs.create({url:'options.html'});
});