var user;

/**
 * used to useremail from the browser.
 */
chrome.identity.getProfileUserInfo(function(userInfo) {
    user = userInfo;
});