// =====================================
// Berufe Quiz - Alpha 1.0
// app.js
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Elemente
    const startButton = document.getElementById("startQuiz");
    const startScreen = document.getElementById("startScreen");
    const quizScreen = document.getElementById("quizScreen");

    const menuButton = document.getElementById("menuButton");
    const moderatorPanel = document.getElementById("moderatorPanel");
    const closePanel = document.getElementById("closePanel");
    const overlay = document.getElementById("overlay");

    const fullscreenButton = document.getElementById("fullscreen");

    // --------------------------
    // Quiz starten
    // --------------------------

    if (startButton) {
        startButton.addEventListener("click", () => {

            startScreen.classList.add("hidden");
            quizScreen.classList.remove("hidden");

        });
    }

    // --------------------------
    // Moderator-Menü
    // --------------------------

    function openModerator() {

        moderatorPanel.classList.add("open");
        overlay.classList.add("show");

    }

    function closeModerator() {

        moderatorPanel.classList.remove("open");
        overlay.classList.remove("show");

    }

    if (menuButton) {
        menuButton.addEventListener("click", openModerator);
    }

    if (closePanel) {
        closePanel.addEventListener("click", closeModerator);
    }

    if (overlay) {
        overlay.addEventListener("click", closeModerator);
    }

    // --------------------------
    // Vollbild
    // --------------------------

    if (fullscreenButton) {

        fullscreenButton.addEventListener("click", () => {

            if (!document.fullscreenElement) {

                document.documentElement.requestFullscreen();

            } else {

                document.exitFullscreen();

            }

        });

    }

    // --------------------------
    // Tastenkürzel
    // --------------------------

    document.addEventListener("keydown", (event) => {

        switch (event.key.toLowerCase()) {

            case "m":

                if (moderatorPanel.classList.contains("open")) {
                    closeModerator();
                } else {
                    openModerator();
                }

                break;

            case "escape":

                closeModerator();

                break;

        }

    });

});
