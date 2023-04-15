// CLOCKWORK APP COMMUNICATOR
// A script for allowing Clockwork apps to communicate with Clockwork.

class Clockwork {
  constructor() {
    this.isEmbedded = (window !== window.parent);
  }
  installApp(url) {
    window.parent.postMessage(["install_app","installApp",url], "*");
  }
  installTheme(url) {
    window.parent.postMessage(["install_app","installApp",url], "*");
  }
}
