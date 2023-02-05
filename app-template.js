////CONFIG////

var link = "https://example.com/index.html"; // link to app webpage
var id = "ExampleIFrame"; // a UNIQUE id to identify the frame for your app
var title = "Example App"; // title shown in navbar
var uninstallId = "https://sub64.netlify.app/clockwork-beta/protohub.js"; // set this to the url location of your script

////SCRIPT////

var ExampleLink = document.createElement("a");
var ExampleIFrame = document.createElement("iframe");

ExampleIFrame.style = "display: none;";
ExampleIFrame.className = "app";
ExampleIFrame.id = id; 
ExampleIFrame.src = "about:blank";

ExampleLink.href = "javascript:openapp('"+ ExampleIFrame.id +"','" + link + "');" ;
ExampleLink.innerHTML = "Example"; 
ExampleLink.uninstallId = uninstallId;
ExampleLink.addEventListener('dblclick', (e) => {
  uninstallApp(ExampleLink.uninstallId, [ExampleLink,ExampleIFrame]);
});

document.getElementById("navbar").appendChild(ExampleLink);
document.getElementById("main").appendChild(ExampleIFrame);
