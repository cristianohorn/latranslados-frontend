const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector("#site-nav");

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      siteNav.classList.toggle("is-open", !isOpen);
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        siteNav.classList.remove("is-open");
      }
    });

    document.querySelector("#current-year").textContent = String(new Date().getFullYear());

    const galleryTrack = document.querySelector(".gallery-track");
    if (galleryTrack) {
      const prevButton = document.querySelector("[data-gallery-prev]");
      const nextButton = document.querySelector("[data-gallery-next]");

      const step = () => {
        const slide = galleryTrack.querySelector(".gallery-slide");
        const gap = parseFloat(getComputedStyle(galleryTrack).columnGap) || 0;
        return slide ? slide.offsetWidth + gap : galleryTrack.clientWidth;
      };

      const updateButtons = () => {
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        prevButton.disabled = galleryTrack.scrollLeft <= 2;
        nextButton.disabled = galleryTrack.scrollLeft >= maxScroll - 2;
      };

      prevButton.addEventListener("click", () => galleryTrack.scrollBy({ left: -step() }));
      nextButton.addEventListener("click", () => galleryTrack.scrollBy({ left: step() }));
      galleryTrack.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      galleryTrack.querySelectorAll("img").forEach((img) => img.addEventListener("load", updateButtons));
      updateButtons();
    }
