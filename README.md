QuizBuddy
QuizBuddy ist ein webbasiertes Quizsystem, das es Benutzern ermöglicht, Fragen zu verschiedenen Themen zu erstellen, zu bearbeiten und zu beantworten. Es umfasst verschiedene Funktionen wie Game Mode, Benutzerprofile, Foren und eine Auswertungsseite.

Inhaltsverzeichnis
Installation
Verwendung
Dateistruktur
Funktionen
Technologien
Mitwirkende
Lizenz
Installation
Repository klonen:

Installation
1. Repository klonen:
git clone https://github.com/dein-benutzername/quizbuddy.git

2. In das Projektverzeichnis wechseln:
git clone https://github.com/dein-benutzername/quizbuddy.git

3. Abhängigkeiten installieren:
Stelle sicher, dass due Node.js und npm istalliert hast. 
npm install

4. Starten von Github
https://shadowiu42.github.io/ISEF01/index.html


Verwendung
1. Anmelden oder Registrieren:

Melde dich mit deiner E-Mail-Adresse und deinem Passwort an oder erstelle einen neuen Account.

2. Quiz erstellen und bearbeiten:

Gehe zu "Meine Stapel" und erstelle neue Fragekacheln.
Bearbeite bestehende Fragen und füge Antworten hinzu.

3. Game Mode:

Wähle einen Stapel aus und starte das Quiz im Game Mode.
Beantworte die Fragen innerhalb des Zeitlimits und sammle Punkte.

4. Forum:

Diskutiere Fragen und Antworten im Forum.
Erstelle neue Kategorien und Themen.

5. Auswertung:

Sieh dir nach dem Abschluss eines Quiz die detaillierte Auswertung 
deiner Antworten an.

Dateistruktur
quizbuddy/
├── img/                 # Bilder und Logos
├── js/                  # JavaScript-Dateien
│   ├── gamemode.js      # Spielmodus-Skript
│   ├── scriptsForum.js  # Forum-Skript
│   ├── scriptsMeineStapel.js # Skript für "Meine Stapel"
├── styles/              # CSS-Dateien
│   └── styles.css       # Hauptstylesheet
├── auswertung.html      # Auswertungsseite
├── forum.html           # Forumseite
├── gamemode.html        # Spielmodus-Seite
├── index.html           # Startseite
├── lernen.html          # Lernseite
├── meinStapel.html      # "Meine Stapel"-Seite
├── registierung.html    # Registrierungsseite
├── README.md            # Diese README-Datei
└── package.json         # npm Konfigurationsdatei


Funktionen
Benutzerregistrierung und -anmeldung: Benutzer können sich registrieren und anmelden.
Stapelverwaltung: Benutzer können Fragekacheln erstellen, bearbeiten und löschen.
Spielmodus: Interaktive Quizspiele mit Zeitlimit und Punktesystem.
Forum: Diskussionen und Fragen in verschiedenen Kategorien.
Auswertung: Detaillierte Analyse der Quiz-Ergebnisse.

Technologien
Frontend: HTML, CSS, JavaScript, jQuery, Bootstrap
Backend: Node.js (optional für serverseitige Logik, falls benötigt)
Sonstiges: Lokaler Speicher (LocalStorage) für die Speicherung von Benutzerdaten und Quizfragen

Mitwirkende
Namen eintragen.

Lizenz
Dieses Projekt steht unter der MIT-Lizenz...