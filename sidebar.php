<?php
// Start PHP tag to begin PHP code

// Check if some condition is met (this could be any condition you need)
$condition = true;

// If condition is met, include the HTML element
if ($condition) {
  echo '<div class="d-flex" id="wrapper"><div id="sidebar" style="z-index: 1000;" class="active"><div class="d-flex justify-content-center mb-5"><img class="side-logo" src="/assets/regular_logo.png"></div><ul class="list-group list-group-flush"><li><button class="btn-toggle d-block w-100 border-0 text-light list-group-item text-start" data-bs-toggle="collapse" data-bs-target="#activities-collapse" aria-expanded="true">Activities</button><div class="collapse show" id="activities-collapse" style=""><ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4"><li><a href="/" class="nav_activity_link link-light text-decoration-none rounded p-1 px-2 me-5">Home</a></li><li><a href="/quiz/" class="nav_activity_link link-light text-decoration-none rounded p-1 px-2 me-5">Quiz</a></li><li><a href="/matchup/" class="nav_activity_link link-light text-decoration-none rounded p-1 px-2 me-5">Matchup</a></li><li><a href="/fill-in-the-blank/" class="nav_activity_link link-light text-decoration-none rounded p-1 px-2 me-5">Fill in the blank</a></li><li><a href="/equations/?json=physics_equations.json" class="nav_activity_link link-light text-decoration-none rounded p-1 px-2 me-5">Equations</a></li></ul></div></li><li><a href="/about" class="list-group-item">About</a></li><li><a href="/create" class="list-group-item">Create</a></li><li><a href="/contact/" class="list-group-item">Contact us</a></li></ul></div></div>';
}
