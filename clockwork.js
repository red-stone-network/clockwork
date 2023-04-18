// CLOCKWORK APP COMMUNICATOR
// A script for allowing Clockwork apps to communicate with Clockwork.

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
    window.parent.postMessage(["install_app","installApp",url,clockwork_my_id], "*");
  }
  installTheme(url) {
    window.parent.postMessage(["install_app","installApp",url,clockwork_my_id], "*");
  }
}