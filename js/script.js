"use strict"

let fragenliste, i = 0;

// Funktionen DEFINIEREN
function printFrage(i) {                                                    // Parameter i = Index
    let request = new XMLHttpRequest();                                     // 6 Schritte (Verbindung mit JSON-File): 1.Instanz erstellen
    request.onload = function() {                                           // 2.Handler-Funktion registrieren - wenn Ergebniss geladen wurde ...
        if(request.status === 200) {                                        // HTTP-Statuscode: Wert 200 -> Anfrage ist erfolgreich
            let json;
            if(request.responseType === "json"){
                json = request.response;                                    // Variable json ist mein JSON-File, hier erfolgt die Zuweisung
            }
            else {
                json = JSON.parse(request.responseText);                    // HTML-Antwort als Zeichenkette
            }
            fragenliste = json.bergquiz;                                    // json File.key -> value von bergquiz in Variable fragenliste speichern
            document.querySelector("#frage").innerHTML = fragenliste[i].nummer + fragenliste[i].frage;              //DOM-Manipulation mit querySelector (ID), weise Frage meinem innterhtml zu

            // Shuffle array
            let answers = ["#label0","#label1","#label2"];
            let shuffled = answers.sort(() => 0.5 - Math.random());         // antworten durcheinander mischen in Variable shuffled
            console.log(shuffled)

            document.querySelector(shuffled[0]).innerHTML = fragenliste[i].richtig;                                 // shuffled0 könnte dann "#label1" sein
            document.querySelector(shuffled[1]).innerHTML = fragenliste[i].falsch1;                                 // Zuweisung
            document.querySelector(shuffled[2]).innerHTML = fragenliste[i].falsch2;
            console.log(fragenliste[i].frage)
        }
    };
    request.open("GET","quiz.json");                                        // 3.Anfrage-Methode mit GET und URL (laden der JSON-Datei)
    request.responseType = "json";                                          // 4.JSON zurückgeben
    request.setRequestHeader("Accept","application/json");                  // 5. nur JSON zulassen
    request.send();                                                         // 6. Anfrage absenden
};


function next() {
    if(i < fragenliste.length - 1) {
        auswertung();
        i++;                        // ähnlich wie Schleife, nach eine Frage wiederholt sich alles -> i wird 1 größer, solange bis i 5 ist
        printFrage(i);
    } else {
        auswertung();
        showResult();
    }
};


let auswertung = function() {
    // Auswertung - Funktion suchen welcher button gechecked ist + Sicherung des labels in Variable userAnswer
    let userAnswer;                                                         // Variable userAnwer erstellen (leer), in der Funktion global
    if(document.querySelector("#answer0").checked) {
        let label0 = document.querySelector("#label0");
        userAnswer = label0.innerHTML;                                     // Variable userAnswer befüllen
    };
    if(document.querySelector("#answer1").checked) {
        let label1 = document.querySelector("#label1");
        userAnswer = label1.innerHTML;
    };
    if(document.querySelector("#answer2").checked) {
        let label2 = document.querySelector("#label2");
        userAnswer = label2.innerHTML;
    };

    // Prüfung ob Antwort richtig ist - Ergebnis zeigen und in Webstorage abspeichern
    if(userAnswer == fragenliste[i].richtig){
        document.querySelector("#frageResult").innerHTML = "Die Antwort ist richtig";
        sessionStorage.setItem(`antwort ${i}`, "richtig");                  // i -> für jede Iteration neuen Key mit Value-Ergebnis
    } else {
        document.querySelector("#frageResult").innerHTML ="Die Antwort ist falsch";
        sessionStorage.setItem(`antwort ${i}`, "falsch");
    }
    // alle radio button nicht checken
    document.querySelector("#answer0").checked = false;
    document.querySelector("#answer1").checked = false;
    document.querySelector("#answer2").checked = false;
};

let showResult = function() {
    // Iteriere über Webstorage und Sicherung aller richtigen Antworten
    let sammelRichtig = 0;                                                  // man geht von 0 richtigen Antworten aus
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);                                   // speichere key in Variable
        let wert = sessionStorage.getItem(key);                            // gibt mir Wert zurück -> richtig oder falsch. wenn i = 0, dann ist key "antwort 0" und value zb. "richtig"
        if(wert == "richtig"){
            sammelRichtig++;                                               // um 1 erhöhen wenn richtig
        }
    }
    console.log(sammelRichtig);
    // Zeigt dem user das Ergebnis
    document.querySelector("#showResult").innerHTML = "Du hast richtig: " + sammelRichtig;
    // Button restart wird freigeschalten
    document.querySelector("#restartbutton").disabled = false;
    // Bestätigungs-Button ausgegraut
    document.querySelector("#button").disabled = true;
};

// wird ausgeführt beim Klicken von Button restart
let restart = function() {
    i = 0;                                                                  // damit es wieder von vorne losgeht -> bei Index 0
    printFrage(i);
    // Buttons wieder umkehren
    document.querySelector("#restartbutton").disabled = true;               // restart-Button ist ausgegraut
    document.querySelector("#button").disabled = false;                     // bestätigen ist aktiviert
    // Deaktivieren von Ergebnis
    document.querySelector("#showResult").innerHTML = "";
    document.querySelector("#frageResult").innerHTML = "";
};

// Funktionen AUSFÜHREN
printFrage(i);
document.querySelector("#button").addEventListener("click", next);          // mit addEventlistener weiter klicken registrieren
document.querySelector("#restartbutton").addEventListener("click", restart);
