const html = `<header class="d-flex justify-content-between main_header align-items-center">
  <div class="p-0 ms-5">
    <a href="/" aria-label="Home"><img height="70" src="/assets/wide_logo.png" aria-label="Rasper Revision Logo"></a>
  </div>
  <ul class="nav h-100 d-none d-md-flex align-items-center">
    <li class="nav-item fs-5"><a style="display: inline !important" href="/create"
        class="nav-link link-light header-link">Create</a>
    </li>
    <li class="nav-item fs-5"><a style="display: inline !important" href="/contact" class="nav-link link-light header-link">Contact
        us</a>
    </li>
    <li class="nav-item fs-5"><a style="display: inline !important" href="/about" class="nav-link link-light header-link">About</a>
    </li>
    <li class="nav-item fs-5"><a style="display: inline !important" href="/privacy-policy"
        class="nav-link link-light header-link">Privacy Policy</a></li>
  </ul>
</header>

<div class="d-flex sidebar-wrapper" id="wrapper">
  <div id="sidebar" style="z-index: 1000;">
    <a class="d-flex justify-content-center mb-5" href="/">
      <img class="side-logo" src="/assets/regular_logo_notext.png">
    </a>
    <ul class="list-group list-group-flush">
      <li><a href="/create" class="list-group-item">Create</a></li>
      <li><a href="/contact/" class="list-group-item">Contact us</a></li>
      <li><a href="/about" class="list-group-item">About</a></li>
      <li><a href="/privacy-policy/" class="list-group-item">Privacy Policy</a></li>
    </ul>
  </div>
</div>
`;

const sidebar_header_wrapper = document.createElement('div');
sidebar_header_wrapper.innerHTML = html;
document.querySelector('.main_wrapper').insertBefore(sidebar_header_wrapper, document.querySelector('.main_wrapper').children[0]);

var icon = document.createElement('div');
var icon1 = document.createElement('div');
var icon2 = document.createElement('div');
var icon3 = document.createElement('div');

icon.classList.add('hamburger-icon');
icon1.classList.add('icon-1');
icon2.classList.add('icon-2');
icon3.classList.add('icon-3');

icon.appendChild(icon1);
icon.appendChild(icon2);
icon.appendChild(icon3);
document.body.appendChild(icon);

icon.addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('active');
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
});