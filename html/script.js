/* why wont site update!!! */

var html = "<iframe id='frame' src='https://redstone-nw.netlify.app/clockwork-app/index.html' width='100%' frameborder='0' style='height:100%; top:0; left:0; bottom:0; right:0; margin:0; width:100%; border:none; padding:0; overflow:hidden; z-index:999999;'> Your browser doesn't support iframes 🤡 </iframe>";
var myWindow = window.open("", Math.random.toString(), "width=1000,height=600,fullscreen=yes");
myWindow.document.body.style = "background-color: black; color:#888; margin: 0;";
myWindow.document.body.innerHTML = html;
myWindow.document.title = document.title;

var link = document.createElement('link');
link.rel = 'icon';
myWindow.document.head.appendChild(link);
link.href = document.querySelector("link[rel~='icon']").href;
document.location.reload();
