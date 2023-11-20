const names = [
    ["Clever | Connect every student to a world of learning", "clever.com"],
    ["Campus Student", "infinitecampus.org"],
    ["Google Classroom", "classroom.google.com"]
]
const item = names[Math.floor(Math.random() * names.length)]

document.title = item[0];
var link = document.createElement('link');
link.rel = 'icon';
link.href = `https://www.google.com/s2/favicons?domain=${item[1]}&sz=32`
document.head.appendChild(link);