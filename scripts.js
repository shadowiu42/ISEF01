$(document).ready(function () {
    // Funktion zum Laden der gespeicherten Fragen und Antworten
    function loadQuestions() {
        var storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
        storedQuestions.forEach(function (question) {
            var newQuestionCard = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5>User fragt: ${question.text}</h5>
                        ${question.answers.map(answer => `<p>${answer}</p>`).join('')}
                        <input type="text" class="form-control mb-2" placeholder="Schreibe hier deine Antwort">
                        <button class="btn btn-primary btn-antworten">Antworten</button>
                    </div>
                </div>
            `;
            $('#questions-container').prepend(newQuestionCard);
        });
    }

    // Funktion zum Speichern der Fragen und Antworten im Local Storage
    function saveQuestions() {
        var questions = [];
        $('#questions-container .card').each(function () {
            var questionText = $(this).find('h5').text().replace('User fragt: ', '');
            var answers = [];
            $(this).find('p').each(function () {
                answers.push($(this).text());
            });
            questions.push({ text: questionText, answers: answers });
        });
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    // Fragen beim Laden der Seite laden
    loadQuestions();

    // Neue Frage hinzufügen und speichern
    $('#addQuestionForm').submit(function (event) {
        event.preventDefault();
        var newQuestion = $('#newQuestion').val();
        if (newQuestion) {
            var newQuestionCard = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5>User fragt: ${newQuestion}</h5>
                        <input type="text" class="form-control mb-2" placeholder="Schreibe hier deine Antwort">
                        <button class="btn btn-primary btn-antworten">Antworten</button>
                    </div>
                </div>
            `;
            $('#newQuestion').val('');
            $('#questions-container').prepend(newQuestionCard);
            saveQuestions(); // Speichern nach Hinzufügen einer neuen Frage
        }
    });

    // Antworten hinzufügen und speichern
    $(document).on('click', '.btn-antworten', function () {
        var answerInput = $(this).siblings('input');
        var answerText = answerInput.val();
        if (answerText) {
            var newAnswer = `<p>${answerText}</p>`;
            $(newAnswer).insertBefore(answerInput);
            answerInput.val('');
            saveQuestions(); // Speichern nach Hinzufügen einer Antwort
        }
    });
});
