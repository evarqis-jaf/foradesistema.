document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ELEMENTOS PRINCIPAIS
    const pageLoader = document.getElementById("pageLoader");
    const header = document.getElementById("header");
    const currentYear = document.getElementById("currentYear");

    // 1. LOADER
    function hideLoader() {
        if (pageLoader) {
            pageLoader.classList.add("hidden");

            setTimeout(function () {
                pageLoader.style.display = "none";
            }, 500);
        }
    }

    window.addEventListener("load", hideLoader);

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        setTimeout(hideLoader, 2500);
    }

    // 2. ANO AUTOMÁTICO
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 3. CABEÇALHO AO DESCER A PÁGINA
    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();

    // 4. SISTEMA DE NOTIFICAÇÕES
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    // 5. MODO CLARO E ESCURO
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    function getSavedTheme() {
        try {
            return localStorage.getItem("evarqis-theme");
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem("evarqis-theme", theme);
        } catch (error) {
            console.warn("Não foi possível guardar o tema.");
        }
    }

    function applyTheme(theme) {
        const darkMode = theme === "dark";

        body.classList.toggle("dark-mode", darkMode);

        if (themeToggle) {
            themeToggle.textContent = darkMode ? "☀️" : "🌙";
            themeToggle.setAttribute(
                "aria-label",
                darkMode ? "Ativar modo claro" : "Ativar modo escuro"
            );
            themeToggle.setAttribute("title", darkMode ? "Modo claro" : "Modo escuro");
        }
    }

    const savedTheme = getSavedTheme();
    applyTheme(savedTheme === "dark" ? "dark" : "light");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const newTheme = body.classList.contains("dark-mode")
                ? "light"
                : "dark";

            applyTheme(newTheme);
            saveTheme(newTheme);
        });
    }

    // 6. PESQUISA DOS CARTÕES DA PÁGINA INICIAL
    const portalSearch = document.getElementById("portalSearch");
    const portalSearchInput = document.getElementById("portalSearchInput");
    const areaCards = document.querySelectorAll(".area-card");

    function filterAreas() {
        if (!portalSearchInput || areaCards.length === 0) return;

        const searchText = portalSearchInput.value
            .trim()
            .toLowerCase();

        let visibleCards = 0;

        areaCards.forEach(function (card) {
            const sector = card.getAttribute("data-sector") || "";
            const cardText = card.textContent || "";

            const searchableText = (sector + " " + cardText).toLowerCase();

            const matches = searchableText.includes(searchText);

            card.style.display = matches ? "" : "none";

            if (matches) {
                visibleCards++;
            }
        });

        if (searchText && visibleCards === 0) {
            showToast("Não encontramos nenhuma área com esse nome.");
        }
    }

    if (portalSearch) {
        portalSearch.addEventListener("submit", function (event) {
            event.preventDefault();
            filterAreas();
        });
    }

    if (portalSearchInput) {
        portalSearchInput.addEventListener("input", filterAreas);
    }

    // 7. SLIDER DE BANNERS
    const bannerSlides = document.querySelectorAll(".banner-slide");
    const bannerDots = document.querySelectorAll(".banner-dot");
    const bannerPrev = document.getElementById("bannerPrev");
    const bannerNext = document.getElementById("bannerNext");

    let currentBanner = 0;
    let bannerTimer = null;

    function showBanner(index) {
        if (bannerSlides.length === 0) return;

        currentBanner =
            (index + bannerSlides.length) % bannerSlides.length;

        bannerSlides.forEach(function (slide, position) {
            slide.classList.toggle(
                "active",
                position === currentBanner
            );
        });

        bannerDots.forEach(function (dot, position) {
            dot.classList.toggle(
                "active",
                position === currentBanner
            );

            dot.setAttribute(
                "aria-current",
                position === currentBanner ? "true" : "false"
            );
        });
    }

    function stopBannerTimer() {
        if (bannerTimer) {
            clearInterval(bannerTimer);
            bannerTimer = null;
        }
    }

    function startBannerTimer() {
        stopBannerTimer();

        if (bannerSlides.length <= 1) return;

        bannerTimer = setInterval(function () {
            showBanner(currentBanner + 1);
        }, 5000);
    }

    function changeBanner(index) {
        showBanner(index);
        startBannerTimer();
    }

    if (bannerSlides.length > 0) {
        showBanner(0);
        startBannerTimer();
    }

    if (bannerPrev) {
        bannerPrev.addEventListener("click", function () {
            changeBanner(currentBanner - 1);
        });
    }

    if (bannerNext) {
        bannerNext.addEventListener("click", function () {
            changeBanner(currentBanner + 1);
        });
    }

    bannerDots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            changeBanner(index);
        });
    });

    // 8. ANIMAÇÕES AO ENTRAR NO ECRÃ
    if ("IntersectionObserver" in window) {
        const animatedElements = document.querySelectorAll(
            ".area-card, .section-heading, .account-content, .footer-main"
        );

        const observer = new IntersectionObserver(
            function (entries, currentObserver) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });
    }

    // 9. EFEITO DE CLIQUE NOS CARTÕES
    areaCards.forEach(function (card) {
        card.addEventListener("pointerdown", function () {
            card.classList.add("pressed");
        });

        card.addEventListener("pointerup", function () {
            card.classList.remove("pressed");
        });

        card.addEventListener("pointerleave", function () {
            card.classList.remove("pressed");
        });
    });

    console.log("EVARQIS: portal carregado.");
});
