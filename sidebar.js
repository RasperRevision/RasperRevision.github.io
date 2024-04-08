var icon = document.createElement('div')
var icon1 = document.createElement('div');
var icon2 = document.createElement('div');
var icon3 = document.createElement('div');

icon.id = "icon";
icon.classList.add('hamburger-icon');
icon1.id = "a";
icon1.classList.add('icon-1');
icon2.id = "b";
icon2.classList.add('icon-2');
icon3.id = "c";
icon3.classList.add('icon-3');

icon.appendChild(icon1);
icon.appendChild(icon2);
icon.appendChild(icon3);
document.body.appendChild(icon);

var wrapperDiv = document.createElement("div");
wrapperDiv.classList.add("d-flex");
wrapperDiv.id = "wrapper";

var sidebarDiv = document.createElement("div");
sidebarDiv.id = "sidebar";
sidebarDiv.style.zIndex = 1000;

var sidebarHeading = document.createElement("div");
sidebarHeading.classList.add("sidebar-heading");
sidebarHeading.textContent = "Rasper Revision";

var ulElement = document.createElement("ul");
ulElement.classList.add("list-group", "list-group-flush");

var firstListItem = document.createElement("li");
firstListItem.classList.add("mb-1");

var buttonElement = document.createElement("button");
buttonElement.classList.add("btn-toggle", "d-block", "w-100", "rounded", "border-0", "collapsed", "text-light", "list-group-item", "text-start");
buttonElement.setAttribute("data-bs-toggle", "collapse");
buttonElement.setAttribute("data-bs-target", "#activities-collapse");
buttonElement.textContent = "Activities";

var collapseDiv = document.createElement("div");
collapseDiv.classList.add("collapse");
collapseDiv.id = "activities-collapse";

var innerUlElement = document.createElement("ul");
innerUlElement.classList.add("btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small", "ms-4");

var innerListItems = [
  { text: "Home", href: "/" },
  { text: "Quiz", href: "/quiz/" },
  { text: "Matchup", href: "/matchup/" },
  { text: "Fill in the blank", href: "/fill-in-the-blank/" }
];

innerListItems.forEach(function (item) {
  var innerLiElement = document.createElement("li");
  var innerAnchorElement = document.createElement("a");
  innerAnchorElement.textContent = item.text;
  innerAnchorElement.href = item.href;
  innerAnchorElement.classList.add("nav_activity_link", "link-light", "text-decoration-none", "rounded", "p-1", "px-2", "me-5");
  innerLiElement.appendChild(innerAnchorElement);
  innerUlElement.appendChild(innerLiElement);
});

collapseDiv.appendChild(innerUlElement);

firstListItem.appendChild(buttonElement);
firstListItem.appendChild(collapseDiv);

ulElement.appendChild(firstListItem);

var listItems = [
  { text: "About", href: "/about" },
  { text: "Create", href: "/create" },
  { text: "Contact us", href: "/contact/" }
];

listItems.forEach(function (item) {
  var liElement = document.createElement("li");
  var anchorElement = document.createElement("a");
  anchorElement.textContent = item.text;
  anchorElement.href = item.href;
  anchorElement.classList.add("list-group-item");
  liElement.appendChild(anchorElement);
  ulElement.appendChild(liElement);
});

sidebarDiv.appendChild(sidebarHeading);
sidebarDiv.appendChild(ulElement);

wrapperDiv.appendChild(sidebarDiv);

document.body.appendChild(wrapperDiv);

icon.addEventListener('click', function () {
  sidebarDiv.classList.toggle('active');
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
});
