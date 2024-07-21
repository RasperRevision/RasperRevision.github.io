const footer = `<footer class="row py-5 my-5 border-top">
          <div class="col mb-3">
            <a href="/"><img src="/assets/wide_logo.png" height=75 class="mb-2"></a>
            <div>
              <p>Copyright © 2024</p>
              <a class="text-white" href="https://github.com/RasperRevision/RasperRevision.github.io" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-github"
                  viewBox="0 0 16 16">
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
              </a>
            </div>
          </div>

          <div class="col-md mb-3"></div>
          <div class="col-md mb-3"></div>

          <div class="col mb-3">
            <h5>Activities</h5>
            <menu class="nav flex-column">
              <li class="nav-item mb-2"><a href="/"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Home</a>
              </li>
              <li class="nav-item mb-2"><a href="/matchup/"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Matchup</a>
              </li>
              <li class="nav-item mb-2"><a href="/quiz/"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Quiz</a>
              </li>
              <li class="nav-item mb-2"><a href="/fill-in-the-blank"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Fill in
                  the
                  blank</a>
              </li>
              <li class="nav-item mb-2"><a href="/equations/?json=physics_equations.json"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Equations</a>
              </li>
            </menu>
          </div>

          <div class="col mb-3">
            <h5>Useful links</h5>
            <menu class="nav flex-column">
              <li class="nav-item mb-2"><a href="/contact"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Contact
                  us</a></li>
              <li class="nav-item mb-2"><a href="/create"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Create</a>
              </li>
              <li class="nav-item mb-2"><a
                  href="https://github.com/RasperRevision/RasperRevision.github.io/blob/main/LICENSE"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover"
                  target="_blank">License</a>
              </li>
              <li class="nav-item mb-2"><a href="/privacy-policy"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">Privacy
                  policy</a>
              </li>
              <li class="nav-item mb-2"><a href="/about"
                  class="link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">About</a>
              </li>
            </menu>
          </div>
        </footer>`;

document.addEventListener('DOMContentLoaded', () => {
  const footer_element = document.createElement('div');
  footer_element.innerHTML = footer;
  footer_element.classList.add('container');
  document.querySelector('.main_wrapper').appendChild(footer_element);
});