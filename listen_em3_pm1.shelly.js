/**
* PV-Überschusssteuerung für Heizstab
* Steuerung von Shelly 1PM mit Daten von 3EM
* author: tomsl@tomsl.it
* version: 1.1
* license: MIT
*/

let em_ip = "192.168.1.1";           // IP deines 3EM
let selectedPhase = 1;               // Phase L1 ...1, L2 ... 2, L3 ... 3
let isRequestInProgress = false;
let updateInterval = 10;             // Sekündliches Abfrageintervall

let authHeader = "";                 // hier den base-auth string eingragen, wenn der 3em sicheren zugang benutzt.

// Heizstab-Konfiguration
let heaterPower = 1000;              // Watt Leistung vom Heizstab (oder der Phase des Heizstabs)
let minExcess = 50;                  // Mind. Überschuss, der belassen werden soll

let switchState = false;             // Aktueller Schaltzustand (EIN/AUS)
let enableLog = false;               // ❌ Log-Ausgabe deaktiviert für PROD

function log() {
  if (enableLog) {
    print.apply(null, arguments);
  }
}

function getPhasePower(data, phase) {
  return data.emeters[phase - 1].power;
}

function pollEM() {
  if (isRequestInProgress) {
    log("Anfrage läuft bereits, überspringe.");
    return;
  }
  isRequestInProgress = true;

  Shelly.call("http.request", {
    method: "GET",
    url: "http://" + em_ip + "/status",
    headers: { "Authorization": authHeader }
  }, function (res, err) {
    isRequestInProgress = false;

    if (err || res.code !== 200) {
      log("Fehler bei http.request - Code:", res.code, "Error:", JSON.stringify(err));
      return;
    }

    let data = JSON.parse(res.body);
    let phasePower = getPhasePower(data, selectedPhase);
    log("Phase L" + selectedPhase + ": " + phasePower + " W");

    let thresholdOn = -(heaterPower + minExcess);  // z.B. -1050
    let thresholdOff = -minExcess;                 // z.B. -50

    if (!switchState && phasePower < thresholdOn) {
      log("Überschuss groß genug (" + phasePower + " W), schalte EIN");
      switchState = true;
      Shelly.call("Switch.Set", { id: 0, on: true });

    } else if (switchState && phasePower > thresholdOff) {
      log("Nicht mehr genug Überschuss (" + phasePower + " W), schalte AUS");
      switchState = false;
      Shelly.call("Switch.Set", { id: 0, on: false });

    } else {
      log("Kein Wechsel nötig – bleibt " + (switchState ? "EIN" : "AUS"));
    }
  });
}

Timer.set(updateInterval * 1000, true, pollEM);
