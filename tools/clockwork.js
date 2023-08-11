// Basically this is the script that allows Clockwork apps to communicate with Clockwork.

var clockwork_my_id = null;

window.addEventListener('message', function(event) {
  if (event.data.length > 1) {
    console.log("CLOCKWORK | Recieved my ID: "+event.data)
    clockwork_my_id = event.data;
  }
});

class Clockwork {
  constructor() {
    this.isEmbedded = (window !== window.parent);
  }
  installApp(url) {
    window.parent.postMessage(["installApp","installApp",url,clockwork_my_id], "*");
  }
  installTheme(url) {
    window.parent.postMessage(["installTheme","installTheme",url,clockwork_my_id], "*");
  }
  sendNotification(description) {
    window.parent.postMessage(["notifications","sendNotification",description,clockwork_my_id], "*");
  }
}
