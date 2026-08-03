// =======================================
// Berufe Quiz - Alpha 1.0
// moderator.js
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Moderator-Modus geladen");

    const restartButton = document.getElementById("restartQuiz");

    if (restartButton) {
        restartButton.addEventListener("click", () => {

            if (confirm("Quiz wirklich neu starten?")) {
                location.reload();
            }

        });
    }

    const solutionButton = document.getElementById("showSolution");

    if (solutionButton) {
        solutionButton.addEventListener("click", () => {
            alert("Diese Funktion wird in Version 0.4 erweitert.");
        });
    }

});
