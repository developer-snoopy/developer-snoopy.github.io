(function() {
  "use strict";

  const menuHost = document.querySelector("#site-menu");
  if (!menuHost) return;

  fetch("partials/menu.html")
    .then(response => {
      if (!response.ok) throw new Error(`Menu request failed: ${response.status}`);
      return response.text();
    })
    .then(html => {
      menuHost.innerHTML = html;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const activePage = {
        "portfolio-details.html": "portfolio.html",
        "service-details.html": "experiences.html"
      }[currentPage] || currentPage;

      menuHost.querySelectorAll("[data-page]").forEach(link => {
        link.classList.toggle("active", link.dataset.page === activePage);
      });

      const mobileToggle = menuHost.querySelector(".mobile-nav-toggle");
      if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
          document.body.classList.toggle("mobile-nav-active");
          mobileToggle.classList.toggle("bi-list");
          mobileToggle.classList.toggle("bi-x");
        });
      }

      menuHost.querySelectorAll("#navmenu a").forEach(link => {
        link.addEventListener("click", () => {
          if (document.body.classList.contains("mobile-nav-active") && !link.querySelector(".toggle-dropdown")) {
            document.body.classList.remove("mobile-nav-active");
            mobileToggle?.classList.add("bi-list");
            mobileToggle?.classList.remove("bi-x");
          }
        });
      });

      menuHost.querySelectorAll(".toggle-dropdown").forEach(toggle => {
        toggle.addEventListener("click", event => {
          event.preventDefault();
          event.stopImmediatePropagation();
          toggle.parentElement.classList.toggle("active");
          toggle.parentElement.nextElementSibling?.classList.toggle("dropdown-active");
        });
      });

      document.dispatchEvent(new CustomEvent("site-menu-loaded"));
    })
    .catch(error => {
      console.error("Unable to load the shared menu.", error);
    });
})();
