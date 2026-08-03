// =======================================
// Berufe Quiz - Alpha 1.0
// quiz.js
// =======================================

const quizData = [
    {
        frage: "Was macht ein Polizist?",

        antworten: [
            "Brände löschen",
            "Für Sicherheit sorgen",
            "Kranke behandeln",
            "Häuser bauen"
        ],

        richtig: 1
    }
];

let aktuelleFrage = 0;

const frageElement = document.getElementById("question");
const antwortenElement = document.getElementById("answers");
const frageCounter = document.getElementById("questionCounter");
const nextButton = document.getElementById("nextQuestion");

function ladeFrage() {

    const frage = quizData[aktuelleFrage];

    frageCounter.textContent =
        `Frage ${aktuelleFrage + 1} von ${quizData.length}`;

    frageElement.textContent = frage.frage;

    antwortenElement.innerHTML = "";

    frage.antworten.forEach((antwort, index) => {

        const button = document.createElement("button");

        button.textContent = antwort;

        button.onclick = () => pruefeAntwort(index, button);

        antwortenElement.appendChild(button);

    });

}

function pruefeAntwort(index, button) {

    const frage = quizData[aktuelleFrage];

    const buttons = antwortenElement.querySelectorAll("button");

    buttons.forEach(btn => btn.disabled = true);

    if (index === frage.richtig) {

        button.style.background = "#2D9359";
        button.style.color = "white";

    } else {

        button.style.background = "#C61932";
        button.style.color = "white";

        buttons[frage.richtig].style.background = "#2D9359";
        buttons[frage.richtig].style.color = "white";

    }

}

if (nextButton) {

    nextButton.addEventListener("click", () => {

        aktuelleFrage++;

        if (aktuelleFrage >= quizData.length) {

            alert("Quiz beendet!");

            aktuelleFrage = 0;

        }

        ladeFrage();

    });

}

document.addEventListener("DOMContentLoaded", ladeFrage);
