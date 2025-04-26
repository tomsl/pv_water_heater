# Shelly PV-Überschuss Steuerung (Heizstab)

**Projektbeschreibung:**  
Dieses Projekt nutzt einen **Shelly 3EM**, um die aktuelle PV-Überschussleistung auszulesen, und schaltet über einen **Shelly 1PM** einen Heizstab im Boiler zu, sobald genug Überschuss vorhanden ist.

Ziel:  
Die erzeugte Sonnenenergie optimal nutzen und überschüssigen Strom sinnvoll zum Erwärmen des Boilers verwenden.

---

## Funktionsweise

- Der **Shelly 1PM** fragt zyklisch den **Shelly 3EM** ab.
- Wenn die Leistung auf der konfigurierten Phase einen definierten Überschuss überschreitet (z.B. mehr als 1000 W frei), wird der Heizstab eingeschaltet.
- Wird der Überschuss wieder zu klein, wird der Heizstab abgeschaltet.
- Eine Hysterese verhindert zu häufiges Ein- und Ausschalten.

---

## Voraussetzungen

- **Shelly 3EM** (Messung des Netzanschlusses)
- **Shelly 1PM** (Schalten des Heizstabs)
- WLAN-Verbindung zwischen den Geräten
- Optional: Authentifizierung auf dem 3EM (unterstützt Basis-Auth)

---

## Verwendung

1. **Skript auf Shelly 1PM laden:**  
   Verwende die Weboberfläche unter `http://<IP-des-1PM>/scripts`, erstelle ein neues Script und füge den bereitgestellten Code ein.

2. **Konfiguration anpassen:**
   - `em_ip` → IP-Adresse deines Shelly 3EM
   - `selectedPhase` → zu überwachende Phase (1 = L1, 2 = L2, 3 = L3)
   - `heaterPower` → Leistung deines Heizstabs (in Watt, z.B. 1000)
   - `minExcess` → gewünschter Mindestüberschuss, der verbleiben soll (z.B. 50 W)
   - Optional: `authHeader` → Base64-Auth-String, falls der 3EM gesichert ist

3. **Skript starten und speichern.**  
   Das Skript wird automatisch alle 10 Sekunden den Status prüfen und entsprechend schalten.

---

## Lizenz

Dieses Projekt steht unter der [MIT Lizenz](LICENSE).

> **Hinweis:**  
> Dieses Projekt erfolgt ohne Garantie auf Funktion oder Haftung für Schäden, insbesondere durch fehlerhaftes Schalten oder falsche Konfiguration!


