/* Used across the Clockwork main pages */

document.querySelector(".navbar").innerHTML = `<a href="https://discord.gg/Sb8NzVbqX8">Discord</a> | 
<a href="/converter/">Convert v1 apps to v2</a> |
© 2023 <a href="https://redstonenetwork.rit.cl/">Redstone Network</a>`


// for /converter/
function generateV2Code() {
    var v1c = document.querySelector("textarea").value;

    var appName = v1c.match(/title {0,1}= {0,1}"([^"]+)"/);
    if (appName) appName = appName[1];

    var appLink = v1c.match(/link {0,1}= {0,1}"([^"]+)"/);
    if (appLink) appLink = appLink[1];

    if (!appName || !appLink) {
        alert("Invalid app!");
        throw "InvalidApp";
    }

    var v2c = `{
  "name": "${appName}",
  "desc": "Converted from v1 to v2",
  "url": "${appLink}",
  "encodedUrl": "no",
  "icon": "https://redstone-nw.netlify.app/assets/icon.png",
  "author": "Type your name here",
  "permissions": []
}`;

    document.querySelector("textarea").value = v2c;
    document.querySelector("#instruction").innerHTML = "Now, you can copy the contents of the textarea into a .JSON file and save it somewhere. Make sure the service you use serves the correct Content-Type headers for .JSON files, such as Github Pages or Vercel.";
}

// for /get-started/
if (document.location.pathname.startsWith("/get-started")) {
    const url = "https://" + document.location.hostname + "/os/"
    const htmlPage = `
  <!DOCTYPE html>
  <html>
  <body>
  <iframe src="about:blank" id="${btoa(url)}"></iframe>
  <style>
  * {
    margin: 0;
    padding: 0;
    overflow-y: hidden;
  }
  iframe {
    width: 100%;
    height: 100vh;
    border: none;
  }
  </style>
  <script src="https://${document.location.hostname}/assets/scripts/hidden-name.js"></script>
  <script>
  document.querySelector("iframe").src = atob(
    document.querySelector("iframe").id
  );
  window.onbeforeunload = function (event) { return false };
  </script>
  </body>
  </html>`.replace(/\n/g, "").replace(/  /g, "");

    const aboutBlanker = `javascript:
  var win = window.open("","_blank","popup=yes");
  win.location.origin = 'https://google.com';
  win.document.write(\`${htmlPage}\`);`
    document.querySelector("#blanker").href = aboutBlanker;
    document.querySelector("#file").href = "data:text/html," + htmlPage;
    document.querySelector("#file2").href = "data:text/html," + htmlPage;
}