const bannerText = document.querySelector(".banner.home span span");
const bannerTextOptions = [
    ["games", "blue"],
    ["proxies", "green"],
    ["apps", "yellow"],
    ["tools", "orange"],
    ["everything", "#9B0022"]
]

var tick = 0;
var currentItem = 0;
var removingText = true;
var currentLetter = 0;

function bannerTextEdit() {
    console.log(tick)
    if (removingText == false && tick == 9) {
        bannerText.innerText += bannerTextOptions[currentItem][0][currentLetter];
        bannerText.style.color = bannerTextOptions[currentItem][1];
        currentLetter++

        if (bannerText.innerText.length == bannerTextOptions[currentItem][0].length) {
            removingText = true;
            tick = 0;
            currentItem++;
            if (currentItem >= bannerTextOptions.length) {
                currentItem = 0;
            }
        }
    } else if (tick == 9 && removingText == true) {
        bannerText.innerText = bannerText.innerText.slice(0, -1);
        if (bannerText.innerText.length == 0) {
            removingText = false;
            currentLetter = 0;
        }
    } else {
        tick++
    }
}

setInterval(bannerTextEdit, 200)