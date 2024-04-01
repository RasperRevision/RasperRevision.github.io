const icon = document.getElementById("icon");
const icon1 = document.getElementById("a");
const icon2 = document.getElementById("b");
const icon3 = document.getElementById("c");
const sidebar = document.createElement('div');

sidebar.classList.add('d-flex');
sidebar.id = 'wrapper';
sidebar.createTextNode(`<div class="bg-darker" id="sidebar">
      <div class="sidebar-heading">
        Rasper Revision
      </div>
      <ul class="list-group list-group-flush">
        <li class="mb-1">
          <button class="btn-toggle d-block w-100 rounded border-0 collapsed text-light list-group-item text-start"
            data-bs-toggle="collapse" data-bs-target="#activities-collapse">
            Activities
          </button>
          <div class="collapse" id="activities-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4">
              <li>
                <a href="/"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded text-light p-1 px-2">Home</a>
              </li>
              <li>
                <a href="/matchup/"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded text-light p-1 px-2">Matchup</a>
              </li>
              <li>
                <a href="/quiz/"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded text-light p-1 px-2">Quiz</a>
              </li>
              <li>
                <a href="/fill-in-the-blank/"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded text-light p-1 px-2">Fill in
                  the blank</a>
              </li>
            </ul>
          </div>
        </li>

        <a href="/about" class="list-group-item">About</a>
        <a href="/create" class="list-group-item">Create</a>
        <a href="/contact/" class="list-group-item">Contact us</a>
      </ul>
    </div>`);
document.body.appendChild(sidebar);

icon.addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('active');
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
});
