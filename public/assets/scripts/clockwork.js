// CLOCKWORK APP COMMUNICATOR
// A script for allowing Clockwork apps to communicate with Clockwork.
// Updated for beta16

var clockwork_my_id = null;
var clockwork_my_app_type = null;

window.addEventListener("message", function (event) {
  if (event.data.length > 1) {
    if (event.data[0] == "id") {
      console.log("clockwork.js | ID recieved: " + event.data[1]);
      clockwork_my_app_type = "iframe";
      clockwork_my_id = event.data[1];
    } else if (event.data[0] == "isActiveApp") {
      event.data[2](event.data[1]);
    }
  }
});

var query_id = new URLSearchParams(document.location.search).get(
  "clockwork-app-id"
);

if (query_id) {
  clockwork_my_id = query_id;
  clockwork_my_app_type = "embed";
  console.log("clockwork.js | ID recieved, assuming embed: " + query_id);
  console.warn("clockwork.js | WARNING! <embed>s only support single-page apps unless you add your own way to transfer the clockwork-app-id search parameter from one page to another!")
}

document.addEventListener("load", function () {
  document.body.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key == "/") {
      e.preventDefault();
      window.parent.postMessage(["baseFunc", "openFinder"], "*");
    }
  });

  document.body.addEventListener("click", function (e) {
    window.parent.postMessage(["baseFunc", "onClick"], "*");
  });
});

class Clockwork {
  constructor() {
    this.isEmbedded = window !== window.parent;
    this.type = clockwork_my_app_type
  }
  get isInClockwork() {
    return window !== window.parent && clockwork_my_id != null;
  }
  installApp(url) {
    window.parent.postMessage(
      ["installApp", "installApp", url, clockwork_my_id],
      "*"
    );
    return true;
  }
  installTheme(url) {
    window.parent.postMessage(
      ["installTheme", "installTheme", url, clockwork_my_id],
      "*"
    );
    return true;
  }
  installPlugin(url) {
    window.parent.postMessage(
      ["installPlugin", "installPlugin", url, clockwork_my_id],
      "*"
    );
    return true;
  }
  sendNotification(description) {
    window.parent.postMessage(
      ["notifications", "sendNotification", description, clockwork_my_id],
      "*"
    );
    return true;
  }
  isActiveApp(returnFunction) {
    if (clockwork_my_app_type == "iframe") {
      window.parent.postMessage(["base", "isActiveApp", returnFunction], "*");
    } else {
      console.warn(
        "clockwork.js | Unable to get active app via " +
          clockwork_my_app_type +
          "!"
      );
      returnFunction(null);
    }
  }
}
