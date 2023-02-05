function start() {

  ////CONFIG////

  var link = "https://example.com/index.html"; // link to app webpage
  var id = "ExampleIFrame"; // a UNIQUE id to identify the frame for your app
  var title = "Example App"; // title shown in navbar
  var uninstallId = "insert url location here"; // set this to the url location of your script
  
  ////SCRIPT////
  
  var ExampleLink = document.createElement("a");
  var ExampleIFrame = document.createElement("iframe");
  
  ExampleIFrame.style = "display: none;";
  ExampleIFrame.className = "app "+id;
  ExampleIFrame.id = id;
  ExampleIFrame.src = "about:blank";
  
  ExampleLink.href = "javascript:openapp('"+ ExampleIFrame.id +"','" + link + "');" ;
  ExampleLink.innerHTML = title; 
  ExampleLink.uninstallId = uninstallId;
  ExampleLink.className = id; 
  ExampleLink.addEventListener('dblclick', (e) => {
    uninstallApp(ExampleLink.uninstallId, ExampleLink.className);
  });
  
  document.getElementById("navbar").appendChild(ExampleLink);
  document.getElementById("main").appendChild(ExampleIFrame);
}

start();
