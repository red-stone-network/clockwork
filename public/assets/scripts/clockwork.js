// CLOCKWORK APP COMMUNICATOR
// A script for allowing Clockwork apps to communicate with Clockwork.
// Updated for beta11

var clockwork_my_id = null;

window.addEventListener('message', function (event) {
    if (event.data.length > 1) {
        console.log("clockwork.js | ID recieved: " + event.data)
        clockwork_my_id = event.data;
    }
});

document.body.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key == "/") {
        e.preventDefault();
        window.parent.postMessage(["baseFunc", "openFinder"], "*");
    }
});

document.body.addEventListener("click", function (e) {
    window.parent.postMessage(["baseFunc", "onClick"], "*");
});

class Clockwork {
    constructor() {
        this.isEmbedded = (window !== window.parent);
    }
    get isInClockwork() {
        return (window !== window.parent) && (clockwork_my_id != null);
    }
    installApp(url) {
        window.parent.postMessage(["installApp", "installApp", url, clockwork_my_id], "*");
        return true;
    }
    installTheme(url) {
        window.parent.postMessage(["installTheme", "installTheme", url, clockwork_my_id], "*");
        return true;
    }
    installPlugin(url) {
        window.parent.postMessage(["installPlugin", "installPlugin", url, clockwork_my_id], "*");
        return true;
    }
    sendNotification(description) {
        window.parent.postMessage(["notifications", "sendNotification", description, clockwork_my_id], "*");
        return true;
    }
}