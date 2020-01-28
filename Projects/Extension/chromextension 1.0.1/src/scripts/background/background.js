//JSON object with email and id
var user;

/**
 * used to useremail from the browser.
 */
chrome.identity.getProfileUserInfo(function(userInfo) {
    user = userInfo;
});

// alert(user)

/**
 * Message listener from the content script, which eventually fires the sendMessage.
 * Used to transfer the user value from background script  to content script
 */
chrome.extension.onRequest.addListener(function(request, sender) {
    returnMessage(request.message);
});


/**
 * gets into action on request from content scripts.
 * @param {just a request message from content script} messageToReturn 
 */
function returnMessage(messageToReturn) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            message: user.email
        });
    });
}


// chrome.tabs.onUpdated.addListener(alert("HandleUpdate"));
// chrome.tabs.onRemoved.addListener(alert("HandleRemove"));
// chrome.tabs.onReplaced.addListener(alert("HandleReplace"));
