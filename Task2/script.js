const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const pageTitle = document.getElementById("pageTitle");
const pageContent = document.getElementById("pageContent");

// Mobile toggle
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Routing stub + active state
navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    navLinks.forEach(item => item.classList.remove("active"));
    this.classList.add("active");

    const page = this.getAttribute("data-page");
    pageTitle.textContent = page;
    pageContent.textContent =
      "You clicked on " + page + ". This is a JavaScript routing stub for now.";

    if (window.innerWidth <= 768) {
      sidebar.classList.remove("show");
    }
  });
});