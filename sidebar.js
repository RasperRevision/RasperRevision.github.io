const icon = document.getElementById("icon");
const icon1 = document.getElementById("a");
const icon2 = document.getElementById("b");
const icon3 = document.getElementById("c");

var wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("d-flex");
  wrapperDiv.id = "wrapper";

  // Create the sidebar div with class "bg-darker" and id "sidebar"
  var sidebarDiv = document.createElement("div");
  sidebarDiv.classList.add("bg-darker");
  sidebarDiv.id = "sidebar";

  // Create the sidebar heading
  var sidebarHeading = document.createElement("div");
  sidebarHeading.classList.add("sidebar-heading");
  sidebarHeading.textContent = "Rasper Revision";

  // Create the ul element with class "list-group list-group-flush"
  var ulElement = document.createElement("ul");
  ulElement.classList.add("list-group", "list-group-flush");

  // Create the first list item with class "mb-1" and its content
  var firstListItem = document.createElement("li");
  firstListItem.classList.add("mb-1");

  // Create the button element with class "btn-toggle" and attributes
  var buttonElement = document.createElement("button");
  buttonElement.classList.add("btn-toggle", "d-block", "w-100", "rounded", "border-0", "collapsed", "text-light", "list-group-item", "text-start");
  buttonElement.setAttribute("data-bs-toggle", "collapse");
  buttonElement.setAttribute("data-bs-target", "#activities-collapse");
  buttonElement.textContent = "Activities";

  // Create the collapse div with class "collapse" and id "activities-collapse"
  var collapseDiv = document.createElement("div");
  collapseDiv.classList.add("collapse");
  collapseDiv.id = "activities-collapse";

  // Create the inner ul element with class "btn-toggle-nav"
  var innerUlElement = document.createElement("ul");
  innerUlElement.classList.add("btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small", "ms-4");

  // Create inner list items and anchor elements
  var innerListItems = [
    {text: "Home", href: "/"},
    {text: "Quiz", href: "/quiz/"},
    {text: "Matchup", href: "/matchup/"},
    {text: "Fill in the blank", href: "/fill-in-the-blank/"}
  ];

  innerListItems.forEach(function(item) {
    var innerLiElement = document.createElement("li");
    var innerAnchorElement = document.createElement("a");
    innerAnchorElement.textContent = item.text;
    innerAnchorElement.href = item.href;
    innerAnchorElement.classList.add("link-body-emphasis", "d-inline-flex", "text-decoration-none", "rounded", "text-light", "p-1", "px-2");
    innerLiElement.appendChild(innerAnchorElement);
    innerUlElement.appendChild(innerLiElement);
  });

  // Append the button and inner ul to the collapse div
  collapseDiv.appendChild(innerUlElement);

  // Append the button and collapse div to the first list item
  firstListItem.appendChild(buttonElement);
  firstListItem.appendChild(collapseDiv);

  // Append the first list item to the ul
  ulElement.appendChild(firstListItem);

  // Create the other list items and anchor elements
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

  // Append the sidebar heading and ul to the sidebar div
  sidebarDiv.appendChild(sidebarHeading);
  sidebarDiv.appendChild(ulElement);

  // Append the sidebar div to the wrapper div
  wrapperDiv.appendChild(sidebarDiv);

  // Finally, append the wrapper div to the body of the document
  document.body.appendChild(wrapperDiv);

icon.addEventListener('click', function () {
  sidebarDiv.classList.toggle('active');
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
});
