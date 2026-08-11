// ======================================
// AMS Berufe-Quiz
// Build 004
// odt-import.js
// ======================================

// --------------------------------------
// ODT importieren
// --------------------------------------

async function importODT(file) {

    if (!file) {
        throw new Error("Keine Datei ausgewählt.");
    }

    if (typeof JSZip === "undefined") {
        throw new Error(
            "JSZip wurde nicht geladen."
        );
    }

    console.log(
        "Importiere:",
        file.name
    );


    // ----------------------------------
    // ODT als ZIP öffnen
    // ----------------------------------

    const arrayBuffer =
        await file.arrayBuffer();

    const zip =
        await JSZip.loadAsync(arrayBuffer);


    // ----------------------------------
    // content.xml holen
    // ----------------------------------

    const contentFile =
        zip.file("content.xml");

    if (!contentFile) {
        throw new Error(
            "content.xml wurde nicht gefunden."
        );
    }

    const xmlText =
        await contentFile.async("text");


    // ----------------------------------
    // XML lesen
    // ----------------------------------

    const parser =
        new DOMParser();

    const xml =
        parser.parseFromString(
            xmlText,
            "application/xml"
        );


    // ----------------------------------
    // Absätze auslesen
    // ----------------------------------

    const paragraphs = [];

    const nodes =
        xml.getElementsByTagName("text:p");

    for (const node of nodes) {

        const text =
            node.textContent
                .replace(/\u00A0/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        if (text) {
            paragraphs.push(text);
        }
    }


    console.log(
        "Gefundene Textabsätze:",
        paragraphs.length
    );


    // ----------------------------------
    // Fragen parsen
    // ----------------------------------

    const fragen =
        parseFragen(paragraphs);


    if (fragen.length === 0) {

        throw new Error(
            "Keine Fragen gefunden. " +
            "Bitte das ODT-Format prüfen."
        );
    }


    // ----------------------------------
    // WICHTIG:
    // Direkt für quiz.js speichern
    // ----------------------------------

    window.quizData = fragen;


    console.log(
        "✅ Fragen importiert:",
        fragen.length
    );

    console.log(
        window.quizData
    );


    return fragen;
}


// --------------------------------------
// Fragen erkennen
// --------------------------------------

function parseFragen(paragraphs) {

    const fragen = [];

    let aktuelleFrage = null;


    for (
        let i = 0;
        i < paragraphs.length;
        i++
    ) {

        const zeile =
            paragraphs[i].trim();


        // --------------------------------
        // Neue Frage
        // --------------------------------

        const frageMatch =
            zeile.match(
                /^(\d+)\.\s*Frage\s+(\d+)\s*Punkte?\s*[\/:]\s*(.*)$/i
            );


        if (frageMatch) {

            // Vorherige Frage speichern

            if (aktuelleFrage) {

                if (
                    istGueltigeFrage(
                        aktuelleFrage
                    )
                ) {

                    fragen.push(
                        aktuelleFrage
                    );

                }

            }


            // Neue Frage

            aktuelleFrage = {

                nummer:
                    Number(
                        frageMatch[1]
                    ),

                punkte:
                    Number(
                        frageMatch[2]
                    ),

                frage:
                    frageMatch[3].trim(),

                antworten: [
                    "",
                    "",
                    "",
                    ""
                ],

                richtig:
                    -1

            };


            continue;
        }


        // Wenn noch keine Frage
        // begonnen wurde

        if (!aktuelleFrage) {
            continue;
        }


        // --------------------------------
        // Antworten A-D
        // --------------------------------

        const antwortMatch =
            zeile.match(
                /^([ABCD])\)\s*(.*)$/i
            );


        if (antwortMatch) {

            const buchstabe =
                antwortMatch[1]
                    .toUpperCase();

            const index =
                buchstabe.charCodeAt(0)
                - 65;

            aktuelleFrage
                .antworten[index] =
                    antwortMatch[2].trim();


            continue;
        }


        // --------------------------------
        // Richtige Antwort
        // --------------------------------

        const richtigMatch =
            zeile.match(
                /^Antwort\s*:\s*([ABCD])\s*$/i
            );


        if (richtigMatch) {

            const buchstabe =
                richtigMatch[1]
                    .toUpperCase();


            aktuelleFrage.richtig =
                buchstabe.charCodeAt(0)
                - 65;


            continue;
        }


        // --------------------------------
        // Mehrzeilige Frage
        // --------------------------------

        if (
            aktuelleFrage.antworten.every(
                antwort => antwort === ""
            ) &&
            aktuelleFrage.richtig === -1
        ) {

            aktuelleFrage.frage +=
                " " + zeile;

            continue;
        }


        // --------------------------------
        // Mehrzeilige Antwort
        // --------------------------------

        if (
            aktuelleFrage.richtig === -1
        ) {

            const letzteAntwort =
                [...aktuelleFrage.antworten]
                    .reverse()
                    .find(
                        antwort =>
                            antwort !== ""
                    );


            if (letzteAntwort !== undefined) {

                const index =
                    aktuelleFrage
                        .antworten
                        .lastIndexOf(
                            letzteAntwort
                        );


                aktuelleFrage
                    .antworten[index] +=
                    " " + zeile;

            }

        }

    }


    // ----------------------------------
    // Letzte Frage speichern
    // ----------------------------------

    if (aktuelleFrage) {

        if (
            istGueltigeFrage(
                aktuelleFrage
            )
        ) {

            fragen.push(
                aktuelleFrage
            );

        }

    }


    return fragen;
}


// --------------------------------------
// Frage überprüfen
// --------------------------------------

function istGueltigeFrage(frage) {

    if (!frage) {
        return false;
    }


    if (!frage.frage) {
        return false;
    }


    if (
        !Array.isArray(
            frage.antworten
        )
    ) {

        return false;

    }


    if (
        frage.antworten.length !== 4
    ) {

        return false;

    }


    if (
        frage.antworten.some(
            antwort =>
                !antwort ||
                antwort.trim() === ""
        )
    ) {

        return false;

    }


    if (
        frage.richtig < 0 ||
        frage.richtig > 3
    ) {

        return false;

    }


    return true;
}


// --------------------------------------
// Datei-Auswahl einrichten
// --------------------------------------

function setupODTImport() {

    const fileInput =
        document.getElementById(
            "odtFile"
        );


    if (!fileInput) {

        console.warn(
            'Element "odtFile" nicht gefunden.'
        );

        return;

    }


    fileInput.addEventListener(
        "change",
        async function(event) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const status =
                document.getElementById(
                    "importStatus"
                );


            if (status) {

                status.textContent =
                    "⏳ Fragen werden geladen...";

            }


            try {

                const fragen =
                    await importODT(file);


                if (status) {

                    status.textContent =
                        `✅ ${fragen.length} Fragen geladen`;

                }


            } catch (error) {

                console.error(
                    "ODT-Import:",
                    error
                );


                if (status) {

                    status.textContent =
                        "❌ " +
                        error.message;

                }

            }

        }
    );

}


// --------------------------------------
// Start
// --------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    setupODTImport
);