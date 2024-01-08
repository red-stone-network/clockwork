const contextMenu = document.getElementById("contextmenu")
const appPanel = document.getElementById("apppanel");
const appBar = document.getElementById("appbar");
const loadBar = document.getElementById("cw-load-bar");
const finder = document.querySelector(".finder");
const finderBox = document.querySelector(".finder-box");
const settingsLeftBox = document.querySelector("#apppanel\\:sys_settings .left .selections")
const settingsRightBox = document.querySelector("#apppanel\\:sys_settings .right")

const yes = true;
const no = false;

var currentApp = "home";

var apps = null;
var appData = [];
var themeData = [];
var themes = null;
var plugins = null;

// Version numbers for v1 use BASE.FEATURE.PATCH, with FEATURE combining MAJOR and MINOR.

// Version numbers for v2 are similar to semantic versioning v2.0.0

// BASE.MAJOR.MINOR.PATCH

// can append -betaVERSION or -rcVERSION to the end, can also have -indev, 
// to signify versions that are not for any user's consumption

// BASE is the base this version is based on (0 is clockwork v1 beta, 
// 1 is clockwork v1 release, 2 is clockwork v2)

// MAJOR is non-backwards-compatible feature changes (for example, 
// changes that require app developers to update their apps)

// MINOR is backwards-compatible feature changes

// PATCH is backwards-compatible changes for security and bug fixes only

var version = "2.0.0.0-beta15.2";
var versionNickname = "New Shoe"

contextMenu.style.display = "none";

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max)
}

// The Settings app uses this to load its UI

/*
--- TYPES OF CONTENTS ---

- scriptbox is used for scripted items.
- it should contain a function value under the name "value"
- can also contain a function value under the name "interval", will run every clock update [NOT MADE YET]
- the first parameter is always the content box

- dropdown is a dropdown obviously
- should contain a label value and a linkedSetting value
- should contain a values value, which is an array containing arrays formatted as ["id","label"]

- text is used as a one-line text box
- should contain a label value and a linkedSetting value
- should also contain a placeholderText value
*/


if (document.location.href.endsWith("?debug")) {
    window.onerror = function (e) {
        alert(e)
    }
    settingsMenu.push({
        screenName: "Debug Mode",
        screenIcon: "/assets/images/ui/clockwork.png",
        screenContents: [{
            type: "scriptbox",
            value: function (div) {
                var btn = document.createElement("btn")
                btn.innerText = "Eval"
                btn.onclick = function () { var a = prompt(); eval(a) }
                div.appendChild(btn);

                var btn = document.createElement("btn")
                btn.innerText = "Install app"
                btn.onclick = function () { var a = prompt("json url"); promptInstallApp(a) }
                div.appendChild(btn);

                var btn = document.createElement("btn")
                btn.innerText = "Install theme"
                btn.onclick = function () { var a = prompt("css url"); promptInstallTheme(a) }
                div.appendChild(btn);
            }
        }]
    })
}

function loadSettingsScreen(prescreen) {
    var screen = typeof prescreen == "string" ?
        settingsMenu.indexOf(settingsMenu.find((me) => me.screenName == prescreen)) :
        prescreen;

    settingsCurrentScreen = screen;
    while (settingsRightBox.firstChild) {
        settingsRightBox.removeChild(settingsRightBox.lastChild);
    }

    let h2 = document.createElement("h2");
    h2.innerText = settingsMenu[screen].screenName;
    settingsRightBox.appendChild(h2);

    for (let i = 0; i < settingsMenu[screen].screenContents.length;) {
        let div = document.createElement("div");
        if (settingsMenu[screen].screenContents[i].label) {
            let label = document.createElement("span");
            label.className = "label";
            label.innerText = settingsMenu[screen].screenContents[i].label;
            div.appendChild(label);
        }

        if (settingsMenu[screen].screenContents[i].type == "text") {
            let textbox = document.createElement("input");
            textbox.placeholder = settingsMenu[screen].screenContents[i].placeholderText;
            textbox.value = eval(settingsMenu[screen].screenContents[i].linkedSetting);
            textbox.className = "text";
            textbox.dataset.linked = settingsMenu[screen].screenContents[i].linkedSetting;

            textbox.onchange = (e) => {
                eval(`${e.target.dataset.linked} = "${e.target.value}"`);
                localStorage.setItem('settings', JSON.stringify(settings));
            }

            div.appendChild(textbox);
        }
        if (settingsMenu[screen].screenContents[i].type == "dropdown") {
            let dropdown = document.createElement("select");

            for (let j = 0; j < settingsMenu[screen].screenContents[i].values.length;) {
                let option = document.createElement("option");
                option.value = settingsMenu[screen].screenContents[i].values[j][0]
                option.innerText = settingsMenu[screen].screenContents[i].values[j][1]
                dropdown.appendChild(option);
                ++j;
            }

            dropdown.value = eval(settingsMenu[screen].screenContents[i].linkedSetting);
            dropdown.className = "dropdown";
            dropdown.dataset.linked = settingsMenu[screen].screenContents[i].linkedSetting;

            dropdown.onchange = (e) => {
                eval(`${e.target.dataset.linked} = "${e.target.value}"`);
                localStorage.setItem('settings', JSON.stringify(settings));
            }

            div.appendChild(dropdown);
        }
        if (settingsMenu[screen].screenContents[i].type == "scriptbox") {
            settingsMenu[screen].screenContents[i].value(div);
        }

        settingsRightBox.appendChild(div);
        ++i;
    }
}

function loadSettingsMenu() { // Loads up the settings menu (shocker)
    for (let i = 0; i < settingsMenu.length;) {
        let div = document.createElement("div");
        div.innerHTML = `<img src="${settingsMenu[i].screenIcon}"> <span>${settingsMenu[i].screenName}</span>`
        div.dataset.num = i;
        div.onclick = (e) => {
            loadSettingsScreen(Number(div.dataset.num))
        };
        settingsLeftBox.appendChild(div);
        ++i;
    }
}
loadSettingsMenu();

function setupScreenSwap(screen) {
    var children = document.querySelectorAll("div.setup-screen");
    let i = 0;
    while (i != children.length) {
        if (children[i].id == "setup-screen-" + screen) children[i].className = "setup-screen visible"
        else children[i].className = "setup-screen";
        i++;
    }
}

function setupScreenClose() {
    setupScreenSwap("");
    document.getElementById("clockwork-setup").className = "clockwork-panel clockwork-panel-fadeout";
    document.getElementById("clockwork-content").style = "";
    setTimeout(function () {
        document.getElementById("clockwork-setup").style = "display: none;"
    }, 300);
}

// The stuff that you can search up using the Finder



// ULTRAVIOLET ENCODING AND DECODING
// THIS IS REQUIRED FOR USING A PROXY
function encodeUV(str) {
    if (!str) return str;
    return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

function decodeUV(str) {
    if (!str) return str;
    let [input, ...search] = str.split('?');

    return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
}

const cdns = [
    [
        "https://cdn.statically.io/gh/red-stone-network/clockwork/main/README.md",
        "https://cdn.statically.io/%g/%u/%r/%b/%p"
    ],
    [
        "https://cdn.jsdelivr.net/gh/red-stone-network/clockwork@main/README.md",
        "https://cdn.jsdelivr.net/%g/%u/%r@%b/%p"
    ],
    [
        "https://rawcdn.githack.com/red-stone-network/clockwork/main/README.md",
        "https://%Gcdn.githack.com/%u/%r/%b/%p"
    ]
]
var currentCDN = null;

function cleanUrl(url) {
    if (url[0] == "@") {
        var result = url.match(/@(gh|gl)\/([a-zA-Z_\-0-9]+)\/([a-zA-Z_\-0-9]+)@([a-zA-Z_\-0-9]+)\/(.+)/)
        return currentCDN
            .replace("%G", (function () {
                if (result[1] == "gh") return "raw"
                else return "gl"
            })())
            .replace("%g", result[1])
            .replace("%u", result[2])
            .replace("%r", result[3])
            .replace("%b", result[4])
            .replace("%p", result[5])
    }
    return url
}

var defaultSettings = {
    // Lock screen settings
    lock: {
        enabled: false,
        passcode: "0000",
    },
    clockType: "12h",
    clockFont: "asap",
    dyslexicFont: false,
    // Proxy settings
    proxy: "none",
    proxyUrl: "",
    wallpaper: "/assets/images/wallpapers/default.png",
}
var settings = null;

// moveInArray
function moveInArray(arr, old_index, new_index) {
    var old_item = arr[old_index];
    arr.splice(old_index, 1);

    arr.splice(new_index, 0, old_item);
    return arr;
}

var firstBoot = false;

// get settings
// if no settings, will add defaults + mark this as the first boot
if (localStorage.getItem("settings") == null || localStorage.getItem("settings") == "!!reset") {
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    settings = defaultSettings;
    firstBoot = true;
} else {
    settings = JSON.parse(localStorage.getItem("settings"));
}

// make sure all required settings for clockwork are there
if (settings.dyslexicFont == null) {
    settings.dyslexicFont = false
    localStorage.setItem("settings", JSON.stringify(settings));
}

if (!settings.proxy) {
    settings.proxy = "none";
    settings.proxyUrl = "";
    localStorage.setItem("settings", JSON.stringify(settings));
}

// get themes
if (localStorage.getItem("themes") == null || localStorage.getItem("themes") == "!!reset") {
    localStorage.setItem("themes", JSON.stringify([]));
    themes = [];
} else {
    themes = JSON.parse(localStorage.getItem("themes"));
}

// get plugins
if (localStorage.getItem("plugins") == null || localStorage.getItem("plugins") == "!!reset") {
    localStorage.setItem("plugins", JSON.stringify([]));
    plugins = [];
} else {
    plugins = JSON.parse(localStorage.getItem("plugins"));
}

// get apps
if (localStorage.getItem("apps") == null || localStorage.getItem("apps") == "!!reset") {
    apps = [
        // CLOCKWORK APP STORE
        "/assets/apps/store.json",
        // MUENSTER
        "/assets/apps/muenster.json"
    ];
    localStorage.setItem("apps", JSON.stringify(apps));
} else {
    apps = JSON.parse(localStorage.getItem("apps"));
}

loadBar.max = apps.length + themes.length + plugins.length + 1;
loadBar.value = 0;

function checkCDN(i) {
    let response = fetch(cdns[i][0], {
        cache: "reload",
        mode: "cors",
    }).then((response) => {
        if (response.ok) {
            currentCDN = cdns[i][1]
            ++loadBar.value
            for (let i = 0; i < apps.length; i++) {
                installApp(apps[i], {
                    start: true
                });
            }
            for (let i = 0; i < themes.length; i++) {
                installTheme(themes[i]);
                ++loadBar.value;
            }

            for (let i = 0; i < plugins.length; i++) {
                installPlugin(plugins[i]);
                ++loadBar.value;
            }
        } else {
            checkCDN(++i)
        }
    })
}
checkCDN(0)

document.getElementById("clockwork-content").style = "display: none;";

// loading screen
function checkForFinish() {
    if (loadBar.max == loadBar.value) {
        checkFinder();
        document.getElementById("clockwork-loading").style = "display: none;";
        if (firstBoot) {
            document.getElementById("clockwork-setup").style = "";
            setupScreenSwap("welcome")
        } else if (settings.lock.enabled == true || settings.lock.enabled == "true") {
            document.getElementById("clockwork-lock").style = "";
            document.getElementById("clockwork-lock").className = "clockwork-panel clockwork-panel-fadein";
            pcodeInput.focus();
        } else {
            document.getElementById("clockwork-content").style = "";
            sendNotification("Welcome to Clockwork", "Clockwork is currently running " + version + " " + versionNickname)
            sendNotification("Please update your bookmarklet or file", "beta15 adds useful changes to the bookmarklet - please update it if you haven't!")
        }
    } else {
        setTimeout(checkForFinish, 500);
    }
}
setTimeout(checkForFinish, 500);

// sidebar clock
function sideBarClock() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    if (settings.clockFont == "asap") document.getElementById('appsidebar-clock').style.fontFamily = '"Asap", sans-serif'
    else if (settings.clockFont == "varela") document.getElementById('appsidebar-clock').style.fontFamily = '"Varela Round", sans-serif'
    else document.getElementById('appsidebar-clock').style.fontFamily = 'monospace';

    if (settings.dyslexicFont == "true") {
        document.body.style.fontFamily = "OpenDyslexic, Dyslexic, sans-serif"
        document.getElementById('appsidebar-clock').style.fontFamily = 'OpenDyslexic, Dyslexic, sans-serif';
    } else {
        document.body.style.fontFamily = '"Asap", "Roboto Flex", Roboto, sans-serif'
    };

    if (settings.clockType == "12h") {
        if (h > 12) {
            document.getElementById('appsidebar-clock').innerHTML = (h - 12) + ":" + m + ":" + s + " PM";
        } else {
            document.getElementById('appsidebar-clock').innerHTML = h + ":" + m + ":" + s + " AM";
        }
    } else {
        document.getElementById('appsidebar-clock').innerHTML = h + ":" + m + ":" + s;
    }
    document.querySelector('#clockwork-content').style.backgroundImage = `url(${settings.wallpaper})`
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}
sideBarClock();
setInterval(sideBarClock, 500);

// main stuff

// plugins
function installPlugin(url) {
    var script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
    document.getElementById("cw_manageplugins_span").innerHTML += `${url} - <a onclick="uninstallPlugin('${url}')">Uninstall</a><br>`
    if (!plugins.includes(url)) {
        plugins.push(url);
        localStorage.setItem("plugins", JSON.stringify(plugins));
    }
}

function uninstallPlugin(url) {
    var found = plugins.indexOf(url);
    if (typeof found == "number") {
        if (confirm("Are you sure you would like to uninstall this plugin? Clockwork will have to restart!")) {
            plugins.splice(found, 1);
            localStorage.setItem("plugins", JSON.stringify(plugins));
            document.location.reload();
        }
    } else {
        alert("ERROR: Plugin does not exist!")
    }
}

// apps
async function installApp(url, params) {
    if (url === null | url === undefined) {
        url = prompt("ID is undefined or null, enter a URL (or leave blank to cancel)");
    }
    if (url === null || url === undefined) {
        throw "ID is undefined or null";
    }
    try {
        url = cleanUrl(url);
        let response = await fetch(url, {
            cache: "reload",
            mode: "cors",
        });

        if (response.ok) {
            if (appData.find(function (o) {
                return o.url == url
            })) {
                throw "App already installed!";
            }
            let json = await response.text();
            json = JSON.parse(json);
            let myIframe = document.createElement("IFRAME");
            myIframe.src = "about:blank";
            myIframe.id = "apppanel:" + url;
            myIframe.className = "app";
            appPanel.appendChild(myIframe);
            var myAppData = {
                name: json.name,
                desc: json.desc,
                url: url,
                appUrl: json.url,
                version: json.version,
                encodedUrl: json.encodedUrl,
                permissions: json.permissions,
                icon: json.icon
            }
            var finderTerms = json?.finderTerms;
            var myFinderData = {
                searchText: (function () {
                    if (finderTerms == null) {
                        return [json.name.toLowerCase()];
                    } else {
                        return [json.name.toLowerCase()].concat(finderTerms);
                    }
                })(),
                name: json.name,
                icon: json.icon,
                onclick: `openApp('${url}','${json.url}',${json.encodedUrl});`
            }
            appData.push(myAppData);
            searchables.unshift(myFinderData);

            appBar.innerHTML += `<btn id="appbar:${url}" 
      onclick="openApp('${url}','${json.url}',${json.encodedUrl})" 
      oncontextmenu="appContextMenu('${url}')"
      draggable="true">
      <img draggable="false" src="${json.icon}"></btn>`;

            // THIS IS IN THE MANAGE APPS PART OF SETTINGS
            /*document.getElementById("cw_manageapps_span").innerHTML += `<details class="mngappspnl" id="mngapps:${url}">
            <summary>
            <img src="${json.icon}"> 
            <span>${json.name}</span> `+
            (function () {
              if (typeof json.desc == "string") {
                return json.desc;
              } else {
                return "No description";
              }
            })()
            +`
            </summary>
            <p>
            <btn onclick="closeApp('${url}')">Close app</btn><br>
            <btn onclick="uninstallApp('${url}')">Uninstall app</btn>
            </p>
            </details>`*/
            if (settingsMenu[settingsCurrentScreen]?.screenName == "Manage Apps") loadSettingsScreen(settingsCurrentScreen);

            if (apps.includes(url) == false) {
                apps.push(url);
                localStorage.setItem("apps", JSON.stringify(apps));
            }
            document.getElementById("appbar:" + url).style = "order: " + apps.indexOf(url) + ";";
            /*document.getElementById("appbar:"+url).addEventListener("dragstart", (event) =>{
            event.dataTransfer.setData("text/plain", url);
            });
            document.getElementById("appbar:"+url).addEventListener("dragover", (event) => {
              event.preventDefault();
              return false;
            });
                document.getElementById("appbar:"+url).addEventListener("drop", (event) => {
                  var daita = event.dataTransfer.getData("text/plain");
              //daita = event.target.textContent;
              event.preventDefault();
                  alert(daita);
                });*/

        } else {
            var retry = confirm("HTTP error while installing app: " + response.status + "\nApp url: " + url + "\nRetry?");
            if (retry == true) {
                if (params.start == true) {
                    --loadBar.value;
                    --loadBar.value;
                }
                installApp(url, params);
            }
        }
    } catch (error) {
        alert("Error: " + error);
    }
    if (params.start) {
        ++loadBar.value;
    }
}

async function promptInstallApp(url, params) {
    let response = await fetch(cleanUrl(url), {
        cache: "reload",
        mode: "cors",
    });

    if (response.ok) {
        let json = await response.text();
        json = JSON.parse(json);

        if (json.permissions.includes("noUninstall")) {
            throw "invalidAppPermissionError";
        }

        var prompt = document.getElementById("clockwork-prmpt").cloneNode(true);
        prompt.id = "installprompt-" + (Math.ceil(Math.random() * 9999999));
        prompt.className = "clockwork-panel clockwork-panel-fadein";

        prompt.querySelector(".prmpt-title").innerHTML = `App installation confirmation`;
        prompt.querySelector(".prmpt-text").innerHTML = `Are you sure you want to install ${json.name}?`;
        prompt.querySelector(".prmpt-yes").onclick = function () {
            installApp(url, params);
            prompt.className = "clockwork-panel clockwork-panel-fadeout";
            setTimeout(function () {
                prompt.style = "display: none;"
            }, 300)
        }
        prompt.querySelector(".prmpt-no").onclick = function () {
            prompt.className = "clockwork-panel clockwork-panel-fadeout";
            setTimeout(function () {
                prompt.style = "display: none;"
            }, 300)
        }

        prompt.style = "";

        document.body.appendChild(prompt);
    } else {
        var retry = confirm("HTTP error while getting app data: " + response.status + "\nApp url: " + cleanUrl(url) + "\nRetry?");
        if (retry == true) {
            promptInstallApp(url, params);
        }
    }
}

function openApp(app, url, encoded) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    currentApp = app;
    for (const child of document.getElementById("appbar").children) {
        child.className = "";
        if (child.id == "appbar:" + app) {
            child.className = "appbtnopen";
        }
    }
    for (const child of appPanel.children) {
        child.className = "app";
        if (child.id == "apppanel:" + app) {
            child.className = "app appopen";
            if (child.tagName == "IFRAME" || child.tagName == "EMBED") {
                if ("about:blank" == child.src) {
                    var trueurl = "";
                    if (encoded == true) {
                        var i829X = (function () {
                            function HFeg8(j92Ie) {
                                var ZiWfX = "";
                                for (var kk291 = 0; kk291 < j92Ie.length; kk291 += 2) {
                                    ZiWfX += String.fromCharCode(parseInt(j92Ie.substr(kk291, 2), 16))
                                }
                                return ZiWfX
                            };
                            return eval('HFeg8("6465636F646543572875726C29")')
                        })();
                        trueurl = eval(i829X);
                    } else {
                        trueurl = url;
                    }
                    if (settings.proxy == "uv") {
                        if (settings.proxyUrl.length > 10) {
                            trueurl = settings.proxyUrl + encodeUV(trueurl)
                        } else {
                            trueurl = "https://toddler-kicking-machine.umlach.org/service/" + encodeUV(trueurl)
                        }
                    }
                    child.src = trueurl;
                    child.onload = function () {
                        child.contentWindow.postMessage(child.id.slice(9), "*");
                    }
                }
            }
        }
    }
    for (const child of appBar.children) {
        child.className = child.id == "appbar:" + app ? "open" : "";
    }
}

function closeApp(app) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    for (const child of appPanel.children) {
        if (child.id == "apppanel:" + app) {
            child.className = "app";
            if (child.tagName == "IFRAME" || child.tagName == "EMBED") {
                child.src = "about:blank";
            }
        }
    }
    if (app == currentApp) {
        openApp("sys_home")
    }
}

function moveApp(app, type, plus) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    var appIndex = apps.indexOf(app);
    if (appIndex != undefined) {
        if (type == "add") {
            apps = moveInArray(apps, appIndex, appIndex + plus);
        } else {
            apps = moveInArray(apps, appIndex, plus);
        }
        for (let i = 0; i < apps.length; i++) {
            var z = document.getElementById("appbar:" + apps[i]);
            if (z) {
                z.style = "order: " + i + ";";
            }
        }
        localStorage.setItem("apps", JSON.stringify(apps));
    } else {
        throw "app does not exist at";
    }
}

function uninstallApp(app) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    var entry = appData.find(function (o) {
        return o.url == app
    });

    if (entry.permissions.includes("noUninstall")) {
        alert("This is a system app, which means you cannot uninstall it.");
        throw "noUninstallAppError";
    }

    var ask = confirm("Are you sure you want to uninstall this app?");
    if (ask == true) {
        let index = apps.indexOf(app);
        if (typeof index == "number") {
            apps.splice(index, 1);
            document.getElementById("apppanel:" + app).remove();
            document.getElementById("appbar:" + app).remove();
            appData.splice(appData.indexOf(entry), 1);
        }
        localStorage.setItem("apps", JSON.stringify(apps));
    }
    if (app == currentApp) {
        openApp("sys_home")
    }

    if (settingsMenu[settingsCurrentScreen]?.screenName == "Manage Apps") loadSettingsScreen(settingsCurrentScreen);
}

// context menu when u right click an app icon
function appContextMenu(app) {
    event.preventDefault();
    const {
        clientX: mouseX,
        clientY: mouseY
    } = event;

    contextMenu.style.display = "block";
    contextMenu.style.left = mouseX + "px";
    if (mouseY > window.innerHeight) {
        contextMenu.style.top = mouseY - 25 + "px";
    } else {
        contextMenu.style.top = mouseY - 25 - contextMenu.offsetHeight + "px";
    }

    setTimeout(function () {
        contextMenu.className = "visible";
        contextMenu.style.top = Number(contextMenu.style.top.slice(0, -2)) + 25 + "px";
    }, 50);

    document.getElementById("cm:closeapp").onclick = function () {
        closeApp(app);
    };
    document.getElementById("cm:uninstallapp").onclick = function () {
        uninstallApp(app);
    };

    document.getElementById("cm:mleft").onclick = function () {
        moveApp(app, 'add', -1);
    };
    document.getElementById("cm:mright").onclick = function () {
        moveApp(app, 'add', 1);
    };
}

// themes
async function reloadThemes() {
    document.querySelector("#cw_managethemes_span").innerHTML = "";
    document.querySelector("stylesheets").innerHTML = "";
    for (let i = 0; i < themes.length; i++) {
        await installTheme(themes[i]);
    }
}

async function installTheme(url) {
    url = cleanUrl(url)
    if (url === null | url === undefined) {
        url = prompt("ID is undefined or null, enter a URL (or leave blank to cancel)");
    }
    if (url === null || url === undefined) {
        throw "ID is undefined or null";
    }
    if (document.getElementById("theme:" + url) != null) {
        document.getElementById("theme:" + url).remove()
    }
    try {
        let response = await fetch(url, {
            cache: "reload",
            mode: "cors",
        });

        if (response.ok) {
            // get the response body (the method explained below)
            let style = await response.text();
            let html = '<style id="theme:' + style + '">' + style + "</style>";

            let title = style.match(/^\/\*theme title: ([^\n]+)\*\/$/m)[1];
            let desc = style.match(/^\/\*theme desc: ([^\n]+)\*\/$/m);

            if (!title) throw "PropertyMissing";

            themeData.push({
                url: url,
                title: title,
                desc: desc,
            })

            /*document.getElementById("cw_managethemes_span").innerHTML += `<details class="mngthmspnl" id="mngthms:${url}">
            <summary>
            <span>${title}</span> `+
            (function() {
              if (!desc) {
                return "No description";
              } else {
                return desc[1];
              }
            })()
            +`
            </summary>
            <p>
            <btn onclick="moveTheme('${url}','add',-1)">Move Up</btn> <btn onclick="moveTheme('${url}','add',1)">Move Down</btn><br>
            <btn onclick="uninstallTheme('${url}')">Uninstall Theme</btn>
            </p>
            </details>`*/

            document.querySelector("stylesheets").innerHTML = html + document.querySelector("stylesheets").innerHTML;
            if (themes.includes(url) == false) {
                themes.push(url);
                localStorage.setItem("themes", JSON.stringify(themes));
            }
            if (settingsMenu[settingsCurrentScreen]?.screenName == "Manage Themes") loadSettingsScreen(settingsCurrentScreen);
        } else {
            alert("HTTP error while installing theme: " + response.status + "\nTheme url: " + url);
        }
    } catch (error) {
        alert("Error: " + error);
    }
}

async function moveTheme(app, type, plus) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    var appIndex = themes.indexOf(app);
    if (appIndex != undefined) {
        if (type == "add") {
            themes = moveInArray(themes, appIndex, appIndex + plus);
            themeData = moveInArray(themeData, appIndex, appIndex + plus);
        } else {
            themes = moveInArray(themes, appIndex, plus);
            themeData = moveInArray(themeData, appIndex, plus);
        }

        localStorage.setItem("themes", JSON.stringify(themes));
        if (settingsMenu[settingsCurrentScreen]?.screenName == "Manage Themes") loadSettingsScreen(settingsCurrentScreen);
        await reloadThemes();
    } else {
        throw "app does not exist at";
    }
}

async function uninstallTheme(app) {
    if (app == null || app == undefined) {
        throw "app ID is undefined";
    }
    var appIndex = themes.indexOf(app);
    if (appIndex != undefined) {
        themes.splice(appIndex, 1);

        localStorage.setItem("themes", JSON.stringify(themes));
        if (settingsMenu[settingsCurrentScreen]?.screenName == "Manage Themes") loadSettingsScreen(settingsCurrentScreen);
        await reloadThemes();
    } else {
        throw "app does not exist at";
    }
}

async function promptInstallTheme(url) {
    let response = await fetch(cleanUrl(url), {
        cache: "reload",
        mode: "cors",
    });

    if (response.ok) {
        let style = await response.text();
        let title = style.match(/^\/\*theme title: ([^\n]+)\*\/$/m)[1];
        let desc = style.match(/^\/\*theme desc: ([^\n]+)\*\/$/m);

        var prompt = document.getElementById("clockwork-prmpt").cloneNode(true);
        prompt.id = "installthemeprompt-" + (Math.ceil(Math.random() * 9999999));
        prompt.className = "clockwork-panel clockwork-panel-fadein";

        prompt.querySelector(".prmpt-title").innerHTML = `Theme installation confirmation`;
        prompt.querySelector(".prmpt-text").innerHTML = `Are you sure you want to install ${title}?`;
        prompt.querySelector(".prmpt-yes").onclick = function () {
            installTheme(url);
            prompt.className = "clockwork-panel clockwork-panel-fadeout";
            setTimeout(function () {
                prompt.style = "display: none;"
            }, 300)
        }
        prompt.querySelector(".prmpt-no").onclick = function () {
            prompt.className = "clockwork-panel clockwork-panel-fadeout";
            setTimeout(function () {
                prompt.style = "display: none;"
            }, 300)
        }

        prompt.style = "";

        document.body.appendChild(prompt);
    } else {
        var retry = confirm("HTTP error while getting theme data: " + response.status + "\nTheme url: " + url + "\nRetry?");
        if (retry == true) {
            promptInstallApp(url, params);
        }
    }
}

// settings
function changeSetting(setting, value) {
    alert("settings." + setting + " = " + value)
    if (eval("settings." + setting + " == true")) {
        if (typeof value == "string") {
            var text = "settings." + setting + " = '" + value + "'";
            eval(text)
        } else {
            var text = "settings." + setting + " = " + value;
            eval(text)
        }
        alert(JSON.stringify(settings));
        localStorage.setItem("settings", JSON.stringify(settings));
    }
}

// some stuff for passcodes
const pcodeInput = document.getElementById("passcode");

pcodeInput.oninput = function () {
    if (pcodeInput.value.length == settings.lock.passcode.length) {
        if (pcodeInput.value == settings.lock.passcode) {
            document.getElementById("clockwork-lock").className = "clockwork-panel clockwork-panel-fadeout";
            document.getElementById("clockwork-content").style = "";
            setTimeout(function () {
                document.getElementById("clockwork-lock").style = "display: none;"
            }, 300);
            sendNotification("Welcome to Clockwork", "Clockwork is currently running " + version)
            sendNotification("Please update your bookmarklet or file", "beta15 adds useful changes to the bookmarklet - please update it if you haven't!")
        } else {
            pcodeInput.value = "";
        }
    }
};

function passcodeSettingChange(set) {
    if (false == settings.lock.enabled || (document.getElementById("cpc").value == settings.lock.passcode && true == settings.lock.enabled)) {
        if (set == 'change') {
            if (document.getElementById("npc1").value == document.getElementById("npc2").value) {
                settings.lock.passcode = document.getElementById("npc1").value;
                settings.lock.enabled = true;
                localStorage.setItem('settings', JSON.stringify(settings));
                alert("Success!")
            }
        } else if (set == 'remove') {
            settings.lock.passcode = "0000";
            settings.lock.enabled = false;
            localStorage.setItem('settings', JSON.stringify(settings));
            alert("Success!")
        }
    } else {
        alert("Passcode incorrect.");
    }
}
// notification system
const notificationPanel = document.getElementById("clockwork-notification-panel");
notificationPanel.className = "";

//onclick
function onClick(event) {
    contextMenu.className = "invisible";
    setTimeout(function () {
        contextMenu.style.display = "none";
    }, 250);
    if ((event.isFake || !notificationPanel.contains(event.target.offsetParent)) && notificationPanel.className == "visible") {
        openNotificationPanel();
    }
    if (event.isFake || !finderBox.contains(event.target.offsetParent)) {
        finder.className = "finder invisible";
        finderBox.className = "finder-box invisible";
        setTimeout(function () {
            finder.style = "display: none;";
            finderBox.style = "display: none;";
        }, 250);
    }
}
document.querySelector("body").addEventListener("click", onClick)

//more notif sys

function sendNotification(title, content) {
    let el = document.createElement("DIV");
    el.className = "clockwork-notification";
    el.innerHTML = `<b>${title}</b><br>\n${content}`;
    document.body.appendChild(el);
    setTimeout(function () {
        el.className = "clockwork-notification hide";
    }, 5000);
    setTimeout(function () {
        el.remove();
    }, 5500);
    if (document.getElementById("clockwork-notification-items").innerText == "You're all caught up!") {
        document.getElementById("clockwork-notification-items").innerHTML = "";
    }
    document.getElementById("clockwork-notification-items").innerHTML += `<div><b>${title} <img src="/assets/images/ui/x.png" 
  onclick="notifDestroy(this);"></b>\n${content}</div>`;
    if (!notifPanelOpen) {
        document.getElementById("appsidebar:notifs").src = "/assets/images/ui/ringing-bell.png"
    }
}

var notifPanelOpen = false;

function openNotificationPanel() {
    if (notifPanelOpen == false) {
        setTimeout(function () {
            notificationPanel.className = "visible";
        }, 10)
        document.getElementById("appsidebar:notifs").src = "/assets/images/ui/bell.png"
        notifPanelOpen = true;
    } else {
        notificationPanel.className = "invisible";
        notifPanelOpen = false;
    }
}

function notifDestroy(me) {
    me.parentNode.parentNode.className = "hide";
    setTimeout(() => {
        if (me.parentNode.parentNode.parentNode.children.length == 1) {
            me.parentNode.parentNode.parentNode.innerHTML = "You're all caught up!"
        } else {
            me.parentNode.parentNode.remove();
        }
    }, 500);
}

function clearAllNotifs() {
    var stuff = document.querySelector("#clockwork-notification-items").children;
    for (let item of stuff) {
        item.className = "hide";
        setTimeout(() => {
            if (item.parentNode.parentNode.parentNode.children.length == 1) {
                item.parentNode.innerHTML = "You're all caught up!"
            } else {
                item.remove();
            }
        }, 500);
    }
    setTimeout(() => {
        document.querySelector("#clockwork-notification-items").innerHTML = "You're all caught up!"
    }, 750);
}



// onkeypress
function onKeyPress(e) {
    if (e.ctrlKey && e.key == "/") {
        if (!e.isFake) e.preventDefault();
        if (finder.className == "finder") {
            finder.className = "finder invisible";
            finderBox.className = "finder-box invisible";
            setTimeout(function () {
                finder.style = "display: none;";
                finderBox.style = "display: none;";
            }, 250);
            finder.blur();
        } else {
            finder.className = "finder"
            finderBox.className = "finder-box"
            finder.style = "display: block;"
            finderBox.style = "display: block;"
            finder.focus();
            finder.value = "";
            checkFinder();
        }

    }
    if (e.key == "Enter") {
        if (!e.isFake) e.preventDefault();
        if (document.activeElement == finder) {
            if (finderBox.children.length != 0) {
                finderBox.children.item(0).click();
            }
        }
    }
}
document.body.onkeydown = function (e) {
    onKeyPress(e);
};

// finder system
function checkFinder(str) {
    var match = [];
    if (typeof str != "string" || str.length < 1) {
        match = searchables
    } else {
        var priorityLevel2 = [];
        var priorityLevel3 = [];
        for (let i = 0; i < searchables.length;) {
            var sub = str.toLowerCase()
            if (searchables[i].name.toLowerCase().startsWith(sub)) { // Puts items that start with the text at higher relevance
                priorityLevel3.push(searchables[i]);
                ++i; continue;
            }
            if (searchables[i].name.toLowerCase().includes(sub)) {
                priorityLevel2.push(searchables[i]);
                ++i; continue;
            }

            for (let i2 = 0; i2 < searchables[i].searchText.length;) {
                if (searchables[i].searchText[i2].toLowerCase().includes(sub)) {
                    match.push(searchables[i]);
                    break;
                }

                ++i2;
            }
            ++i;
        }
        while (priorityLevel2[0]) { match.unshift(priorityLevel2[0]); priorityLevel2.splice(0, 1) };
        while (priorityLevel3[0]) { match.unshift(priorityLevel3[0]); priorityLevel3.splice(0, 1) };
    }

    finderBox.innerHTML = "";
    for (let i = 0; i < match.length && i < 12;) {
        var div = document.createElement("div");
        if (!match[i]) {
            ++i; continue;
        }

        if (i == 0 && str != null && str != "") div.className = "best"; // Best result will not turn gray without this!

        div.innerHTML = `${(function () {
            if (typeof match[i].icon == "string") {
                if (match[i].icon.length > 4) {
                    return `<img src="${match[i].icon}">`;
                } else {
                    return "";
                }

            } else {
                return "";
            }
        })()} ${match[i].name}${(function () {
            if (i == 0 && str != null && str != "")
                return ' <span style="font-size:8px">Best result</span>'
            else return "";
        })()}`

        // holy fucking shit WORK DAMN YOU
        // never have i been so inclined to inflict such violence onto a piece of code before
        // fucking hell

        var func = match[i].onclick;
        if (typeof func == "string") {
            //alert(func);
            div.addEventListener("click", Function(func));
        } else {
            div.addEventListener("click", func);
        }
        div.addEventListener("click", function () {
            finder.className = "finder invisible";
            finderBox.className = "finder-box invisible";
            setTimeout(function () {
                finder.style = "display: none;";
                finderBox.style = "display: none;";
            }, 250);
            finder.blur();
        });
        finderBox.appendChild(div);
        ++i;
    }
    if (finderBox.innerHTML == "") {
        finderBox.innerHTML = "No results - try a less specific search"
    }
}
finder.oninput = function () {
    checkFinder(finder.value.toLowerCase());
}

// clockwork.js functions
window.addEventListener('message', function (event) {
    if (event.data.length > 1) {
        if (event.data[0] == "installApp") {
            // event.source.frameElement.id.slice(9)
            if (appData.find(function (o) {
                return o.url == event.data[3]
            }).permissions.includes("installApp")) {
                if (event.data[1] == "installApp") {
                    promptInstallApp(event.data[2], {})
                }
            }
        }
        if (event.data[0] == "installTheme") {
            // event.source.frameElement.id.slice(9)
            if (appData.find(function (o) {
                return o.url == event.data[3]
            }).permissions.includes("installTheme")) {
                if (event.data[1] == "installTheme") {
                    promptInstallTheme(event.data[2])
                }
            }
        }
        if (event.data[0] == "installPlugin") {
            // event.source.frameElement.id.slice(9)
            var app = appData.find(function (o) {
                return o.url == event.data[3]
            });
            if (app.permissions.includes("installPlugin")) {
                if (event.data[1] == "installPlugin") {
                    if (confirm("An app wants to install a plugin on Clockwork. Plugins have FULL ACCESS to EVERYTHING on Clockwork - only install plugins from this app if you truly trust it.\n\nWould you like to install the plugin at:\n" + event.data[2] + "\nThe app trying to install it is named " + app.name + ".")) {
                        installPlugin(event.data[2])
                    }
                }
            }
        }
        if (event.data[0] == "notifications") {
            // event.source.frameElement.id.slice(9)
            var app = appData.find(function (o) {
                return o.url == event.data[3]
            });
            if (app.permissions.includes("notifications")) {
                if (event.data[1] == "sendNotification") {
                    sendNotification(app.name, event.data[2]);
                }
            }
        }
        if (event.data[0] == "base") {
            if (event.data[1] == "openFinder") {
                onKeyPress({
                    ctrlKey: true,
                    key: "/",
                    isFake: true
                })
            } else if (event.data[1] == "onClick") {
                onClick({
                    isFake: true
                })
            }
        }
    }
});

window.onbeforeunload = function (event) { return false };

console.log("%cSTOP!", "color: red; font-family: sans-serif; font-size: 69px;");
console.log("%cThis is a browser feature %conly intended for developers. %cPasting code here could give bad people access to the entirety of Clockwork, which may even include account credentials! Don't put anything here if you don't know what it does.", "font-family: sans-serif; font-size: 20px;", "color: red; font-family: sans-serif; font-size: 20px;", "font-family: sans-serif; font-size: 20px;");
console.log("%cIf you do know what you're doing, just ignore this.", "color: gray; font-family: sans-serif; font-size: 12px;");