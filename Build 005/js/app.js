// ======================================
// AMS Berufe-Quiz
// Build 005
// app.js
// ======================================


// --------------------------------------
// Elemente
// --------------------------------------

const startScreen =
    document.getElementById("startScreen");

const quizScreen =
    document.getElementById("quizScreen");

const resultScreen =
    document.getElementById("resultScreen");

const startButton =
    document.getElementById("startButton");

const endButton =
    document.getElementById("endQuiz");

const restartButton =
    document.getElementById("restartQuiz");


// ======================================
// QUIZ-END-SOUND
// ======================================

const quizCompleteSound =
    new Audio(
        "sounds/quiz-complete.mp3"
    );

quizCompleteSound.volume = 0.60;


// --------------------------------------
// Quiz-Ende-Sound abspielen
// --------------------------------------

function playQuizCompleteSound() {

    try {

        quizCompleteSound.currentTime = 0;

        const playPromise =
            quizCompleteSound.play();

        if (
            playPromise !== undefined
        ) {

            playPromise.catch(
                () => {
                    // Browser kann Audio blockieren.
                    // Das Quiz funktioniert trotzdem.
                }
            );

        }

    } catch (error) {

        console.warn(
            "Quiz-Ende-Sound konnte nicht abgespielt werden."
        );

    }

}


// ======================================
// QUIZ STARTEN
// ======================================

if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            // ----------------------------------
            // Prüfen, ob Fragen vorhanden sind
            // ----------------------------------

            if (
                getQuizData().length === 0
            ) {

                alert(
                    "Bitte laden Sie zuerst eine ODT-Datei mit Fragen."
                );

                return;

            }


            // ----------------------------------
            // Startbildschirm ausblenden
            // ----------------------------------

            startScreen.classList.add(
                "hidden"
            );


            // ----------------------------------
            // Quiz anzeigen
            // ----------------------------------

            quizScreen.classList.remove(
                "hidden"
            );


            // ----------------------------------
            // Werte zurücksetzen
            // ----------------------------------

            aktuelleFrage = 0;

            punkte = 0;

            richtigBeantwortet = 0;


            // ----------------------------------
            // Erste Frage laden
            // ----------------------------------

            ladeFrage();

        }
    );

}


// ======================================
// QUIZ BEENDEN
// ======================================

if (endButton) {

    endButton.addEventListener(
        "click",
        quizBeenden
    );

}


function quizBeenden() {

    // ----------------------------------
    // Quiz-Ende-Sound
    // ----------------------------------

    playQuizCompleteSound();


    // ----------------------------------
    // Quiz ausblenden
    // ----------------------------------

    quizScreen.classList.add(
        "hidden"
    );


    // ----------------------------------
    // Ergebnis anzeigen
    // ----------------------------------

    resultScreen.classList.remove(
        "hidden"
    );


    // ----------------------------------
    // Quizdaten holen
    // ----------------------------------

    const quizData =
        getQuizData();


    const anzahlFragen =
        quizData.length;


    // ----------------------------------
    // Punktestand
    // ----------------------------------

    const finalScore =
        document.getElementById(
            "finalScore"
        );


    if (finalScore) {

        finalScore.textContent =
            punkte + " Punkte";

    }


    // ----------------------------------
    // Richtige Antworten
    // ----------------------------------

    const finalResult =
        document.getElementById(
            "finalResult"
        );


    if (finalResult) {

        finalResult.textContent =
            richtigBeantwortet +
            " von " +
            anzahlFragen +
            " Fragen richtig";

    }


    // ==================================
    // PROZENT BERECHNEN
    // ==================================

    let prozent = 0;


    if (
        anzahlFragen > 0
    ) {

        prozent =
            Math.round(
                (
                    richtigBeantwortet /
                    anzahlFragen
                ) * 100
            );

    }


    // ----------------------------------
    // Prozent anzeigen
    // ----------------------------------

    const finalPercentage =
        document.getElementById(
            "finalPercentage"
        );


    if (finalPercentage) {

        finalPercentage.textContent =
            prozent + " %";

    }


    // ==================================
    // BEWERTUNG
    // ==================================

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    if (resultMessage) {

        let bewertung = "";


        // ----------------------------------
        // 90–100 %
        // ----------------------------------

        if (
            prozent >= 90
        ) {

            bewertung =
                "Hervorragend! Sie haben ein ausgezeichnetes Ergebnis erzielt.";

        }


        // ----------------------------------
        // 70–89 %
        // ----------------------------------

        else if (
            prozent >= 70
        ) {

            bewertung =
                "Sehr gut! Sie haben Ihr Wissen erfolgreich unter Beweis gestellt.";

        }


        // ----------------------------------
        // 50–69 %
        // ----------------------------------

        else if (
            prozent >= 50
        ) {

            bewertung =
                "Gut gemacht! Sie sind auf einem guten Weg.";

        }


        // ----------------------------------
        // Unter 50 %
        // ----------------------------------

        else {

            bewertung =
                "Da geht noch mehr! Mit etwas Übung können Sie Ihr Ergebnis verbessern.";

        }


        resultMessage.textContent =
            bewertung;

    }


    // ==================================
    // ERGEBNISBALKEN
    // ==================================

    const resultProgressBar =
        document.getElementById(
            "resultProgressBar"
        );


    if (resultProgressBar) {

        resultProgressBar.style.width =
            prozent + "%";

    }

}


// ======================================
// NEUSTART
// ======================================

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            // ----------------------------------
            // Ende-Sound stoppen
            // ----------------------------------

            try {

                quizCompleteSound.pause();

                quizCompleteSound.currentTime = 0;

            } catch (error) {

                // Nichts tun

            }


            // ----------------------------------
            // Ergebnis ausblenden
            // ----------------------------------

            resultScreen.classList.add(
                "hidden"
            );


            // ----------------------------------
            // Startbildschirm anzeigen
            // ----------------------------------

            startScreen.classList.remove(
                "hidden"
            );


            // ----------------------------------
            // Werte zurücksetzen
            // ----------------------------------

            aktuelleFrage = 0;

            punkte = 0;

            richtigBeantwortet = 0;

        }
    );

}


// ======================================
// MODERATOR TIMER
// ======================================

const timerButton =
    document.getElementById(
        "timerButton"
    );


const timerOverlay =
    document.getElementById(
        "timerOverlay"
    );


const timerValue =
    document.getElementById(
        "timerValue"
    );


let timer = null;


// ======================================
// TIMER-END-SOUND
// ======================================

const timerEndSound =
    new Audio(
        "sounds/timer-end.mp3"
    );


timerEndSound.volume = 0.65;


// --------------------------------------
// Timer-Ende-Sound abspielen
// --------------------------------------

function playTimerEndSound() {

    try {

        timerEndSound.currentTime = 0;

        const playPromise =
            timerEndSound.play();


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
            "Timer-Sound konnte nicht abgespielt werden."
        );

    }

}


// ======================================
// TIMER BUTTON
// ======================================

if (
    timerButton &&
    timerOverlay &&
    timerValue
) {

    timerButton.addEventListener(
        "click",
        () => {

            // ----------------------------------
            // Timer auf 30 Sekunden setzen
            // ----------------------------------

            let sekunden = 30;


            // ----------------------------------
            // Alten Timer stoppen
            // ----------------------------------

            clearInterval(timer);

            timer = null;


            // ----------------------------------
            // Alten Timer-Sound stoppen
            // ----------------------------------

            try {

                timerEndSound.pause();

                timerEndSound.currentTime = 0;

            } catch (error) {

                // Nichts tun

            }


            // ----------------------------------
            // Startzeit anzeigen
            // ----------------------------------

            timerValue.textContent =
                sekunden;


            // ----------------------------------
            // Overlay anzeigen
            // ----------------------------------

            timerOverlay.classList.add(
                "show"
            );


            // ==================================
            // TIMER STARTEN
            // ==================================

            timer = setInterval(
                () => {

                    sekunden--;


                    timerValue.textContent =
                        sekunden;


                    // ----------------------------------
                    // TIMER ABGELAUFEN
                    // ----------------------------------

                    if (
                        sekunden <= 0
                    ) {

                        clearInterval(timer);

                        timer = null;


                        // ----------------------------------
                        // Klingel-Symbol
                        // ----------------------------------

                        timerValue.textContent =
                            "⏰";


                        // ----------------------------------
                        // Sound abspielen
                        // ----------------------------------

                        playTimerEndSound();


                        // ----------------------------------
                        // Overlay nach 2 Sekunden schließen
                        // ----------------------------------

                        setTimeout(
                            () => {

                                timerOverlay.classList.remove(
                                    "show"
                                );

                            },
                            2000
                        );

                    }

                },
                1000
            );

        }
    );

}


// ======================================
// ENDE app.js
// ======================================