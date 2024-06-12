const defaultQuestions = {
    'Allgemein Wissen': [
        {
            text: "Was ist die Hauptstadt von Deutschland?",
            answers: [
                { text: "Berlin", correct: true },
                { text: "München", correct: false },
                { text: "Hamburg", correct: false },
                { text: "Köln", correct: false }
            ]
        },
        {
            text: "Welches Tier ist das größte Landraubtier?",
            answers: [
                { text: "Eisbär", correct: true },
                { text: "Löwe", correct: false },
                { text: "Tiger", correct: false },
                { text: "Wolf", correct: false }
            ]
        },
        {
            text: "Wer schrieb 'Faust'?",
            answers: [
                { text: "Johann Wolfgang von Goethe", correct: true },
                { text: "Friedrich Schiller", correct: false },
                { text: "Gotthold Ephraim Lessing", correct: false },
                { text: "Heinrich Heine", correct: false }
            ]
        },
        {
            text: "Welches Land ist für das Essen 'Sushi' bekannt?",
            answers: [
                { text: "Japan", correct: true },
                { text: "China", correct: false },
                { text: "Thailand", correct: false },
                { text: "Vietnam", correct: false }
            ]
        }
    ],
    'Physik': [
        {
            text: "Was ist die Formel für die Berechnung der Geschwindigkeit?",
            answers: [
                { text: "v = s/t", correct: true },
                { text: "v = m * a", correct: false },
                { text: "v = E/q", correct: false },
                { text: "v = F * r", correct: false }
            ]
        },
        {
            text: "Welches Teilchen hat eine negative Ladung?",
            answers: [
                { text: "Elektron", correct: true },
                { text: "Proton", correct: false },
                { text: "Neutron", correct: false },
                { text: "Photon", correct: false }
            ]
        },
        {
            text: "Was beschreibt das Ohmsche Gesetz?",
            answers: [
                { text: "Spannung = Widerstand * Strom", correct: true },
                { text: "Spannung = Masse * Beschleunigung", correct: false },
                { text: "Kraft = Masse * Beschleunigung", correct: false },
                { text: "Leistung = Spannung * Strom", correct: false }
            ]
        },
        {
            text: "Welche Farbe hat ein Photon?",
            answers: [
                { text: "Photonen haben keine Farbe", correct: true },
                { text: "Rot", correct: false },
                { text: "Blau", correct: false },
                { text: "Grün", correct: false }
            ]
        }
    ],
    'Mathe': [
        {
            text: "Was ist die Lösung der Gleichung 2x + 3 = 7?",
            answers: [
                { text: "x = 2", correct: true },
                { text: "x = 3", correct: false },
                { text: "x = 1", correct: false },
                { text: "x = 4", correct: false }
            ]
        },
        {
            text: "Was ist die Fläche eines Kreises mit Radius r?",
            answers: [
                { text: "πr²", correct: true },
                { text: "2πr", correct: false },
                { text: "πr", correct: false },
                { text: "2r", correct: false }
            ]
        },
        {
            text: "Was ist die Ableitung von x²?",
            answers: [
                { text: "2x", correct: true },
                { text: "x", correct: false },
                { text: "x²", correct: false },
                { text: "1", correct: false }
            ]
        },
        {
            text: "Was ist die Summe der Winkel in einem Dreieck?",
            answers: [
                { text: "180 Grad", correct: true },
                { text: "90 Grad", correct: false },
                { text: "360 Grad", correct: false },
                { text: "270 Grad", correct: false }
            ]
        }
    ]
};

$(document).ready(function () {
    // Funktion zum Laden der gespeicherten Stapel
    function loadStacks() {
        var storedStacks = JSON.parse(localStorage.getItem('stacks')) || [];
        console.log('Stored stacks before adding predefined:', storedStacks);

        // Vordefinierte Stapel
        var predefinedStacks = ['Allgemein Wissen', 'Physik', 'Mathe'];

        // Überprüfen, ob vordefinierte Stapel bereits vorhanden sind
        predefinedStacks.forEach(function (title) {
            if (!storedStacks.some(stack => stack.title === title)) {
                storedStacks.push({ title: title });
                localStorage.setItem('questions_' + title, JSON.stringify(defaultQuestions[title]));
            }
        });

        // Entferne Duplikate in storedStacks
        storedStacks = storedStacks.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.title === value.title
            ))
        );

        console.log('Stored stacks after adding predefined and removing duplicates:', storedStacks);

        // Fügen Sie die gespeicherten Stapel dem DOM hinzu
        $('#card-container').empty(); // Vorherige Kacheln entfernen
        storedStacks.forEach(function (stack) {
            addStackToDOM(stack.title);
        });

        // Speichern Sie die aktualisierten Stapel
        localStorage.setItem('stacks', JSON.stringify(storedStacks));
        console.log('Final stored stacks:', storedStacks);

        // "+" Kachel hinzufügen
        addPlusCard();
    }

    // Funktion zum Speichern der Stapel
    function saveStacks() {
        var stacks = [];
        $('#card-container .card:not(.add-card-container)').each(function () {
            var title = $(this).find('.card-title').text();
            if (title !== '+') {
                stacks.push({ title: title });
            }
        });
        localStorage.setItem('stacks', JSON.stringify(stacks));
        console.log('Stacks saved:', stacks);
    }

    // Funktion zum Hinzufügen eines Stapels zum DOM
    function addStackToDOM(title) {
        var newCard = `
            <div class="col-md-4 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <button class="btn btn-edit">Bearbeiten</button>
                        <button class="btn btn-delete">Löschen</button>
                        <button class="btn btn-learn">Lernen</button>
                    </div>
                </div>
            </div>
        `;
        $('#card-container').append(newCard); // Ändern zu append
    }

    // Funktion zum Hinzufügen der "+" Kachel
    function addPlusCard() {
        // Überprüfen, ob die "+" Kachel bereits existiert
        if ($('#card-container .add-card-container').length === 0) {
            var plusCard = `
                <div class="col-md-4 mb-4 add-card-container">
                    <div class="card text-center add-card" data-toggle="modal" data-target="#addCardModal">
                        <div class="card-body">
                            <h5 class="card-title">+</h5>
                        </div>
                    </div>
                </div>
            `;
            $('#card-container').append(plusCard); // "+" Kachel hinzufügen
        }
    }

    // Event Listener für das Hinzufügen eines neuen Stapels
    $('#addCardForm').submit(function (event) {
        event.preventDefault();
        var cardTitle = $('#cardTitle').val();
        if (cardTitle) {
            addStackToDOM(cardTitle);
            $('#addCardModal').modal('hide');
            $('#cardTitle').val('');
            saveStacks(); // Speichern nach Hinzufügen eines neuen Stapels
        }
    });

    // Event Listener für das Löschen eines Stapels
    $(document).on('click', '.btn-delete', function () {
        var cardTitle = $(this).siblings('.card-title').text();
        localStorage.removeItem('questions_' + cardTitle);
        $(this).closest('.col-md-4').remove();
        saveStacks(); // Speichern nach Löschen eines Stapels
    });

    // Event Listener für das Bearbeiten eines Stapels
    $(document).on('click', '.btn-edit', function () {
        var cardTitle = $(this).siblings('.card-title').text();
        $('#editCardModalLabel').text(`Bearbeite ${cardTitle}`);
        $('#editCardModal').modal('show');
        loadQuestions(cardTitle); // Fragen laden
    });

    // Funktion zum Laden der Fragen für einen Stapel
    function loadQuestions(stackTitle) {
        var storedQuestions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
        console.log('Questions loaded for', stackTitle, ':', storedQuestions);

        $('#questionsList').empty(); // Löscht den aktuellen Inhalt, um Duplikate zu vermeiden
        storedQuestions.forEach(function (question) {
            addQuestionToDOM(question.text, question.answers);
        });
    }

