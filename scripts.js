$(document).ready(function() {
    // Funktion zum Laden der gespeicherten Fragen und Antworten
    function loadQuestions() {
        var storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
        // Sortieren der Fragen nach Zeitstempel absteigend
        storedQuestions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        storedQuestions.forEach(function(question) {
            addQuestionToDOM(question);
        });
    }

    function addQuestionToDOM(question) {
        var newQuestionCard = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5>${question.user} fragt: ${question.text} <small>${new Date(question.timestamp).toLocaleString()}</small></h5>
                    ${question.answers.map(answer => `<p>${answer.user} Antwort: ${answer.text} <small>${new Date(answer.timestamp).toLocaleString()}</small></p>`).join('')}
                    <input type="text" class="form-control mb-2" placeholder="Schreibe hier deine Antwort">
                    <button class="btn btn-primary btn-antworten">Antworten</button>
                </div>
            </div>
        `;
        $('#questions-container').prepend(newQuestionCard);
    }

    // Funktion zum Speichern der Fragen und Antworten im Local Storage
    function saveQuestions() {
        var questions = [];
        $('#questions-container .card').each(function() {
            var questionText = $(this).find('h5').text().replace(' fragt:', '');
            var user = questionText.substring(0, questionText.indexOf(' fragt'));
            questionText = questionText.substring(questionText.indexOf(' fragt') + 6);
            var answers = [];
            $(this).find('p').each(function() {
                var text = $(this).text();
                var answerUser = text.substring(0, text.indexOf(' Antwort:'));
                text = text.substring(text.indexOf(' Antwort:') + 9);
                answers.push({ user: answerUser, text: text, timestamp: $(this).find('small').text() });
            });
            questions.push({ user: user, text: questionText, answers: answers, timestamp: $(this).find('small').text() });
        });
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    // Fragen beim Laden der Seite laden
    loadQuestions();

    // Neue Frage hinzufügen und speichern
    $('#addQuestionForm').submit(function(event) {
        event.preventDefault();
        var newQuestion = $('#newQuestion').val();
        var username = 'AngemeldeterBenutzer'; // Hier musst du den angemeldeten Benutzernamen einfügen
        if (newQuestion) {
            var question = {
                user: username,
                text: newQuestion,
                answers: [],
                timestamp: new Date().toISOString()
            };
            addQuestionToDOM(question);
            $('#newQuestion').val('');
            saveQuestions(); // Speichern nach Hinzufügen einer neuen Frage
        }
    });

    // Antworten hinzufügen und speichern
    $(document).on('click', '.btn-antworten', function() {
        var answerInput = $(this).siblings('input');
        var answerText = answerInput.val();
        var username = 'AngemeldeterBenutzer'; // Hier musst du den angemeldeten Benutzernamen einfügen
        if (answerText) {
            var answer = {
                user: username,
                text: answerText,
                timestamp: new Date().toISOString()
            };
            var newAnswer = `<p>${answer.user} Antwort: ${answer.text} <small>${new Date(answer.timestamp).toLocaleString()}</small></p>`;
            $(newAnswer).insertBefore(answerInput);
            answerInput.val('');
            saveQuestions(); // Speichern nach Hinzufügen einer Antwort
        }
    });
});
