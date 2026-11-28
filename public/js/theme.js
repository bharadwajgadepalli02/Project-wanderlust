// Immediate execution to prevent flash of wrong theme
(function () {
    const savedTheme = localStorage.getItem("roamhaven_theme_mode") || "light";
    const savedColor = localStorage.getItem("roamhaven_theme_color") || "#0d6efd";
    const savedHover = localStorage.getItem("roamhaven_theme_hover") || "#0b5ed7";

    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    document.documentElement.style.setProperty("--theme-color", savedColor);
    document.documentElement.style.setProperty("--theme-hover", savedHover);
})();

document.addEventListener("DOMContentLoaded", () => {
    const htmlEl = document.documentElement;
    const darkToggleBtn = document.getElementById("darkModeToggle");
    const darkIcon = document.getElementById("darkModeIcon");
    const colorCircle = document.getElementById("currentThemeCircle");
    const colorBtns = document.querySelectorAll(".color-palette-btn");

    function syncUI() {
        const currentMode = htmlEl.getAttribute("data-bs-theme") || "light";
        if (darkIcon) {
            if (currentMode === "dark") {
                darkIcon.classList.remove("fa-moon");
                darkIcon.classList.add("fa-sun");
            } else {
                darkIcon.classList.remove("fa-sun");
                darkIcon.classList.add("fa-moon");
            }
        }

        const currentColor = htmlEl.style.getPropertyValue("--theme-color") || "#0d6efd";
        if (colorCircle) {
            colorCircle.style.backgroundColor = currentColor;
        }

        colorBtns.forEach((btn) => {
            if (btn.getAttribute("data-color") === currentColor) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // Toggle Dark / Light mode
    if (darkToggleBtn) {
        darkToggleBtn.addEventListener("click", () => {
            const currentMode = htmlEl.getAttribute("data-bs-theme") || "light";
            const newMode = currentMode === "dark" ? "light" : "dark";

            htmlEl.setAttribute("data-bs-theme", newMode);
            localStorage.setItem("roamhaven_theme_mode", newMode);
            syncUI();
        });
    }

    // Palette Color selection
    colorBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const color = btn.getAttribute("data-color");
            const hover = btn.getAttribute("data-hover") || color;

            htmlEl.style.setProperty("--theme-color", color);
            htmlEl.style.setProperty("--theme-hover", hover);

            localStorage.setItem("roamhaven_theme_color", color);
            localStorage.setItem("roamhaven_theme_hover", hover);

            syncUI();
        });
    });

    syncUI();
});
