const icon = document.getElementById("icon");
const icon1 = document.getElementById("a");
const icon2 = document.getElementById("b");
const icon3 = document.getElementById("c");

var wrapperDiv = document.createElement("div");
wrapperDiv.classList.add("d-flex");
wrapperDiv.id = "wrapper";

var sidebarDiv = document.createElement("div");
sidebarDiv.classList.add("bg-darker");
sidebarDiv.id = "sidebar";

var sidebarHeading = document.createElement("div");
sidebarHeading.classList.add("sidebar-heading");
sidebarHeading.textContent = "Rasper Revision";

var ulElement = document.createElement("ul");
ulElement.classList.add("list-group", "list-group-flush");

var listItems = [
      {text: "About", href: "/about"},
      {text: "Create", href: "/create"},
      {text: "Contact us", href: "/contact/"}
];

listItems.forEach(function(item) {
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
