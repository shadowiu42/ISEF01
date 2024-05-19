$(document).ready(function () {
    // Funktion zum Laden der gespeicherten Stapel
    function loadStacks() {
        var storedStacks = JSON.parse(localStorage.getItem('stacks')) || [];

        // Überprüfen, ob vordefinierte Stapel bereits vorhanden sind
        var predefinedStacks = ['Allgemein Wissen', 'Physik', 'Mathe'];
        storedStacks = storedStacks.filter(function (stack) {
            return !predefinedStacks.includes(stack.title);
        });

        storedStacks.forEach(function (stack) {
            addStackToDOM(stack.title);
        });
    }

    // Funktion zum Speichern der Stapel
    function saveStacks() {
        var stacks = [];
        $('#card-container .card:not(.add-card-container)').each(function () {
            var title = $(this).find('.card-title').text();
            stacks.push({ title: title });
        });
        localStorage.setItem('stacks', JSON.stringify(stacks));
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
        $('#card-container .add-card-container').before(newCard);
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
        $(this).closest('.col-md-4').remove();
        saveStacks(); // Speichern nach Löschen eines Stapels
    });

    // Event Listener für das Bearbeiten eines Stapels
    $(document).on('click', '.btn-edit', function () {
        var cardTitle = $(this).siblings('.card-title').text();
        $('#editCardModalLabel').text(`Bearbeite ${cardTitle}`);
        $('#editCardModal').modal('show');
        // Hier wird die Logik für das Bearbeiten eines Stapels hinzugefügt
        // Öffne ein Modal, um Fragen und Antworten hinzuzufügen
    });

    // Event Listener für das Speichern von Fragen und Antworten
    $('#editCardForm').submit(function (event) {
        event.preventDefault();
        var question = $('#question').val();
        var answer = $('#answer').val();
        var isCorrect = $('#correct').is(':checked');

        if (question && answer) {
            var newQuestion = `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5>${question}</h5>
                        <p>${answer} ${isCorrect ? '(Richtig)' : ''}</p>
                    </div>
                </div>
            `;
            $('#questionsList').append(newQuestion);
            $('#question').val('');
            $('#answer').val('');
            $('#correct').prop('checked', false);
        }
    });

    // Laden der Stapel beim Start der Seite
    loadStacks();
});
