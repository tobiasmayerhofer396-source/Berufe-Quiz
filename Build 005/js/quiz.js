// ======================================
// AMS Berufe-Quiz
// Build 005
// quiz.js
// ======================================

// --------------------------------------
// Quiz-Status
// --------------------------------------

let aktuelleFrage = 0;
let punkte = 0;

let ausgewaehlteAntwort = -1;
let antwortAufgeloest = false;

let richtigBeantwortet = 0;

// Timer für die Auflösung
let revealTimeout = null;


// --------------------------------------
// Sound-System
// --------------------------------------

const sounds = {

    click:
        new Audio("sounds/click.mp3"),

    select:
        new Audio("sounds/select.mp3"),

    reveal:
        new Audio("sounds/reveal.mp3"),

    correct:
        new Audio("sounds/correct.mp3"),

    wrong:
        new Audio("sounds/wrong.mp3")

};


// --------------------------------------
// Thinking-Sound
// --------------------------------------

const thinkingSound =
    new Audio("sounds/thinking.mp3");


// Thinking-Sound soll sich
// automatisch wiederholen

thinkingSound.loop = true;


// Lautstärke

sounds.click.volume = 0.35;
sounds.select.volume = 0.45;
sounds.reveal.volume = 0.40;
sounds.correct.volume = 0.55;
sounds.wrong.volume = 0.50;

thinkingSound.volume = 0.12;


// --------------------------------------
// Sound abspielen
// --------------------------------------

function playSound(soundName) {

    const sound =
        sounds[soundName];


    if (!sound) {

        return;

    }


    try {

        sound.currentTime = 0;


        const playPromise =
            sound.play();


        if (
            playPromise !== undefined
        ) {

            playPromise.catch(
                () => {
                    // Browser kann Audio blockieren.
                    // Quiz funktioniert trotzdem.
                }
            );

        }

    } catch (error) {

        console.warn(
            "Sound konnte nicht abgespielt werden:",
            soundName
        );

    }

}


// --------------------------------------
// Thinking-Sound starten
// --------------------------------------

function startThinkingSound() {

    try {

        thinkingSound.currentTime = 0;

        thinkingSound.loop = true;


        const playPromise =
            thinkingSound.play();


        if (
            playPromise !== undefined
        ) {

            playPromise.catch(
                () => {
                    // Browser kann Audio blockieren.
                }
            );

        }

    } catch (error) {

        console.warn(
            "Thinking-Sound konnte nicht abgespielt werden."
        );

    }

}


// --------------------------------------
// Thinking-Sound stoppen
// --------------------------------------

function stopThinkingSound() {

    try {

        thinkingSound.pause();

        thinkingSound.currentTime = 0;

    } catch (error) {

        console.warn(
            "Thinking-Sound konnte nicht gestoppt werden."
        );

    }

}


// --------------------------------------
// Sounds global verfügbar machen
// --------------------------------------

window.playQuizSound =
    playSound;

window.startThinkingSound =
    startThinkingSound;

window.stopThinkingSound =
    stopThinkingSound;


// --------------------------------------
// Elemente
// --------------------------------------

const question =
    document.getElementById("question");

const answers =
    document.getElementById("answers");

const questionCounter =
    document.getElementById("questionCounter");

const scoreDisplay =
    document.getElementById("scoreDisplay");

const progressBar =
    document.getElementById("progressBar");

const nextButton =
    document.getElementById("nextQuestion");

const backButton =
    document.getElementById("backQuestion");


// --------------------------------------
// Quiz-Daten
// --------------------------------------

function getQuizData() {

    if (
        Array.isArray(window.quizData) &&
        window.quizData.length > 0
    ) {

        return window.quizData;

    }


    return [];

}


// --------------------------------------
// Quiz-Statistik
// --------------------------------------

function aktualisiereStatistik() {

    window.quizStats = {

        punkte:
            punkte,

        richtig:
            richtigBeantwortet,

        beantwortet:
            aktuelleFrage

    };

}


// --------------------------------------
// Frage laden
// --------------------------------------

function ladeFrage() {

    const quizData =
        getQuizData();


    // Alten Reveal-Timer stoppen

    if (revealTimeout) {

        clearTimeout(revealTimeout);

        revealTimeout = null;

    }


    // Keine Fragen vorhanden

    if (
        quizData.length === 0
    ) {

        stopThinkingSound();


        if (question) {

            question.textContent =
                "Keine Fragen geladen.";

        }

        return;

    }


    // Quiz beendet

    if (
        aktuelleFrage >= quizData.length
    ) {

        beendeQuiz();

        return;

    }


    // Status zurücksetzen

    ausgewaehlteAntwort = -1;

    antwortAufgeloest = false;


    // Aktuelle Frage

    const frage =
        quizData[aktuelleFrage];


    // ----------------------------------
    // Frage anzeigen
    // ----------------------------------

    if (question) {

        question.textContent =
            frage.frage || "";

    }


    // ----------------------------------
    // Fragezähler
    // ----------------------------------

    if (questionCounter) {

        questionCounter.textContent =
            `Frage ${aktuelleFrage + 1} / ${quizData.length}`;

    }


    // ----------------------------------
    // Punktestand
    // ----------------------------------

    if (scoreDisplay) {

        scoreDisplay.textContent =
            `💰 ${punkte} Punkte`;

    }


    // ----------------------------------
    // Fortschrittsbalken
    // ----------------------------------

    if (progressBar) {

        const fortschritt =
            (
                (aktuelleFrage + 1) /
                quizData.length
            ) * 100;


        progressBar.style.width =
            `${fortschritt}%`;

    }


    // ----------------------------------
    // Antworten löschen
    // ----------------------------------

    if (!answers) {

        stopThinkingSound();

        return;

    }


    answers.innerHTML = "";


    const buchstaben =
        ["A", "B", "C", "D"];


    // ----------------------------------
    // Antworten erzeugen
    // ----------------------------------

    if (
        Array.isArray(frage.antworten)
    ) {

        frage.antworten.forEach(
            (antwort, index) => {

                const button =
                    document.createElement("button");


                button.className =
                    "answerButton";


                button.type =
                    "button";


                button.innerHTML =
                    `<strong>${buchstaben[index] || ""})</strong> ${antwort}`;


                button.addEventListener(
                    "click",
                    () => {

                        antwortKlick(index);

                    }
                );


                answers.appendChild(
                    button
                );

            }
        );

    }


    // ----------------------------------
    // Weiter deaktivieren
    // ----------------------------------

    if (nextButton) {

        nextButton.disabled = true;

    }


    // ----------------------------------
    // Thinking-Sound starten
    // ----------------------------------

    startThinkingSound();


    // Statistik aktualisieren

    aktualisiereStatistik();

}


// --------------------------------------
// Antwort anklicken
// --------------------------------------

function antwortKlick(index) {

    // Bereits aufgelöst?

    if (antwortAufgeloest) {

        return;

    }


    if (!answers) {

        return;

    }


    const buttons =
        answers.querySelectorAll(
            "button"
        );


    // ----------------------------------
    // ERSTER KLICK
    // ----------------------------------

    if (
        ausgewaehlteAntwort !== index
    ) {

        // Thinking-Sound sofort stoppen

        stopThinkingSound();


        // Alte Auswahl entfernen

        buttons.forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

            }
        );


        // Neue Auswahl markieren

        if (buttons[index]) {

            buttons[index].classList.add(
                "selected"
            );

        }


        ausgewaehlteAntwort =
            index;


        // Auswahl-Sound

        playSound("select");


        return;

    }


    // ----------------------------------
    // ZWEITER KLICK
    // Antwort auflösen
    // ----------------------------------

    antwortAufgeloest = true;


    // Sicherheitshalber Thinking-Sound stoppen

    stopThinkingSound();


    const quizData =
        getQuizData();


    const frage =
        quizData[aktuelleFrage];


    // ----------------------------------
    // Reveal-Sound
    // ----------------------------------

    playSound("reveal");


    // ----------------------------------
    // Reveal-Effekt
    // ----------------------------------

    if (buttons[index]) {

        buttons[index].classList.add(
            "answerReveal"
        );

    }


    // ----------------------------------
    // Nach 2 Sekunden auflösen
    // ----------------------------------

    revealTimeout =
        setTimeout(
            () => {

                revealTimeout = null;


                if (buttons[index]) {

                    buttons[index].classList.remove(
                        "answerReveal"
                    );

                }


                // --------------------------------
                // RICHTIG
                // --------------------------------

                if (
                    index ===
                    Number(frage.richtig)
                ) {

                    if (buttons[index]) {

                        buttons[index].classList.remove(
                            "selected"
                        );


                        buttons[index].classList.add(
                            "correct"
                        );

                    }


                    // Punkte

                    punkte +=
                        Number(frage.punkte) || 0;


                    // Richtige Antworten

                    richtigBeantwortet++;


                    // Correct-Sound

                    playSound("correct");

                }


                // --------------------------------
                // FALSCH
                // --------------------------------

                else {

                    if (buttons[index]) {

                        buttons[index].classList.remove(
                            "selected"
                        );


                        buttons[index].classList.add(
                            "wrong"
                        );

                    }


                    // Richtige Antwort anzeigen

                    const richtigeAntwort =
                        Number(frage.richtig);


                    if (
                        buttons[richtigeAntwort]
                    ) {

                        buttons[
                            richtigeAntwort
                        ].classList.add(
                            "correct"
                        );

                    }


                    // Wrong-Sound

                    playSound("wrong");

                }


                // --------------------------------
                // Punktestand
                // --------------------------------

                if (scoreDisplay) {

                    scoreDisplay.textContent =
                        `💰 ${punkte} Punkte`;

                }


                // --------------------------------
                // Statistik
                // --------------------------------

                aktualisiereStatistik();


                // --------------------------------
                // Weiter freigeben
                // --------------------------------

                if (nextButton) {

                    nextButton.disabled =
                        false;

                }

            },

            2000
        );

}


// --------------------------------------
// Nächste Frage
// --------------------------------------

function naechsteFrage() {

    const quizData =
        getQuizData();


    if (
        quizData.length === 0
    ) {

        return;

    }


    // Nur nach Auflösung weiter

    if (!antwortAufgeloest) {

        return;

    }


    // Thinking sicher stoppen

    stopThinkingSound();


    // Klick-Sound

    playSound("click");


    // Reveal-Timer stoppen

    if (revealTimeout) {

        clearTimeout(revealTimeout);

        revealTimeout = null;

    }


    // Nächste Frage

    aktuelleFrage++;


    // Quiz beendet?

    if (
        aktuelleFrage >= quizData.length
    ) {

        beendeQuiz();

        return;

    }


    // Neue Frage

    ladeFrage();

}


// --------------------------------------
// Zurück
// --------------------------------------

function vorherigeFrage() {

    if (
        aktuelleFrage <= 0
    ) {

        return;

    }


    // Thinking stoppen

    stopThinkingSound();


    // Reveal-Timer stoppen

    if (revealTimeout) {

        clearTimeout(revealTimeout);

        revealTimeout = null;

    }


    // Klick-Sound

    playSound("click");


    // Eine Frage zurück

    aktuelleFrage--;


    // Frage laden

    ladeFrage();

}


// --------------------------------------
// Quiz beenden
// --------------------------------------

function beendeQuiz() {

    // Thinking stoppen

    stopThinkingSound();


    // Reveal-Timer stoppen

    if (revealTimeout) {

        clearTimeout(revealTimeout);

        revealTimeout = null;

    }


    // Statistik aktualisieren

    aktualisiereStatistik();


    // Eigene Quiz-Beenden-Funktion
    // aus app.js verwenden

    if (
        typeof window.quizBeenden ===
        "function"
    ) {

        window.quizBeenden();

        return;

    }


    // ----------------------------------
    // Fallback
    // ----------------------------------

    const quizScreen =
        document.getElementById(
            "quizScreen"
        );


    const resultScreen =
        document.getElementById(
            "resultScreen"
        );


    if (quizScreen) {

        quizScreen.style.display =
            "none";

    }


    if (resultScreen) {

        resultScreen.style.display =
            "block";

    }


    const finalScore =
        document.getElementById(
            "finalScore"
        );


    if (finalScore) {

        finalScore.textContent =
            `${punkte} Punkte`;

    }


    const finalResult =
        document.getElementById(
            "finalResult"
        );


    if (finalResult) {

        const quizData =
            getQuizData();


        finalResult.textContent =
            `Sie haben ${richtigBeantwortet} von ${quizData.length} Fragen richtig beantwortet.`;

    }

}


// --------------------------------------
// Quiz zurücksetzen
// --------------------------------------

function quizZuruecksetzen() {

    // Thinking stoppen

    stopThinkingSound();


    // Reveal-Timer stoppen

    if (revealTimeout) {

        clearTimeout(revealTimeout);

        revealTimeout = null;

    }


    // Werte zurücksetzen

    aktuelleFrage = 0;

    punkte = 0;

    richtigBeantwortet = 0;

    ausgewaehlteAntwort = -1;

    antwortAufgeloest = false;


    // Statistik

    aktualisiereStatistik();


    // Erste Frage

    ladeFrage();

}


// --------------------------------------
// Funktionen global verfügbar machen
// --------------------------------------

window.ladeFrage =
    ladeFrage;

window.antwortKlick =
    antwortKlick;

window.naechsteFrage =
    naechsteFrage;

window.vorherigeFrage =
    vorherigeFrage;

window.quizZuruecksetzen =
    quizZuruecksetzen;

window.beendeQuiz =
    beendeQuiz;


// --------------------------------------
// Navigation
// --------------------------------------

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            naechsteFrage();

        }
    );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            vorherigeFrage();

        }
    );

}


// ======================================
// ENDE quiz.js
// ======================================