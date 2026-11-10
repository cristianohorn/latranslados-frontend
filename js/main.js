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

    // Carrosséis (galeria e depoimentos): rolagem com snap + setas que avançam um item.
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const prevButton = carousel.querySelector("[data-carousel-prev]");
      const nextButton = carousel.querySelector("[data-carousel-next]");
      if (!track || !prevButton || !nextButton) return;

      const step = () => {
        const item = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return item ? item.offsetWidth + gap : track.clientWidth;
      };

      const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevButton.disabled = track.scrollLeft <= 2;
        nextButton.disabled = track.scrollLeft >= maxScroll - 2;
      };

      prevButton.addEventListener("click", () => track.scrollBy({ left: -step() }));
      nextButton.addEventListener("click", () => track.scrollBy({ left: step() }));
      track.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      track.querySelectorAll("img").forEach((img) => img.addEventListener("load", updateButtons));
      updateButtons();
    });

    // Faixa de consentimento de cookies (LGPD).
    const cookieBanner = document.querySelector(".cookie-banner");
    const CONSENT_KEY = "lt-cookie-consent";
    const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };

    if (cookieBanner) {
      if (!readConsent()) cookieBanner.hidden = false;

      cookieBanner.addEventListener("click", (event) => {
        const choice = event.target.closest("[data-cookie-choice]")?.dataset.cookieChoice;
        if (!choice) return;
        try { localStorage.setItem(CONSENT_KEY, choice); } catch {}
        window.gtag?.("consent", "update", { analytics_storage: choice, ad_storage: choice, ad_user_data: choice });
        cookieBanner.hidden = true;
      });

      document.querySelector("[data-cookie-open]")?.addEventListener("click", () => {
        cookieBanner.hidden = false;
        cookieBanner.querySelector("[data-cookie-choice='granted']").focus();
      });
    }

    // Eventos do GA4: cliques de contato, com a seção onde o link está.
    const linkLocation = (link) => {
      if (link.closest(".whatsapp-float")) return "botao_flutuante";
      if (link.closest(".site-header")) return "menu";
      if (link.closest(".site-footer")) return "rodape";
      if (link.closest(".contact-band")) return "faixa_contato";
      return link.closest("section[id]")?.id || "outro";
    };

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || typeof window.gtag !== "function") return;
      const href = link.getAttribute("href");
      let name = null;
      if (href.startsWith("https://wa.me/")) name = "whatsapp_click";
      else if (href.startsWith("tel:")) name = "phone_click";
      else if (href.includes("instagram.com")) name = "instagram_click";
      if (name) window.gtag("event", name, { link_location: linkLocation(link), link_url: href });
    });
