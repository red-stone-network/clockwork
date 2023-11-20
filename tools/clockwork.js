// Basically this is the script that allows Clockwork apps to communicate with Clockwork. Mainly 

var clockwork_my_id = null;

window.addEventListener('message', function (event) {
    if (event.data.length > 1) {
        console.log("CLOCKWORK | Recieved my ID: " + event.data)
        clockwork_my_id = event.data;
    }
});

class Clockwork {
    constructor() {
        this.isEmbedded = (window !== window.parent);
    }
    installApp(url) {
        window.parent.postMessage(["installApp", "installApp", url, clockwork_my_id], "*");
    }
    installTheme(url) {
        window.parent.postMessage(["installTheme", "installTheme", url, clockwork_my_id], "*");
    }
    sendNotification(description) {
        window.parent.postMessage(["notifications", "sendNotification", description, clockwork_my_id], "*");
    }

    // no permissions required for the following variables and functions
    requestFullscreen(url) {
        window.parent.postMessage(["base", "requestFullscreen", url, clockwork_my_id], "*");
    }
    get isActiveApp() {
        return false;
    }
}

document.addEventListener('keypress', function () {
    if (e.ctrlKey && e.key == "/") {
        window.parent.postMessage(["base", "openFinder", url, clockwork_my_id], "*");
    }
})