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

    // Funktion zum Speichern der Fragen für einen Stapel
    function saveQuestions(stackTitle) {
        var questions = [];

        $('#questionsList .question-card').each(function () {
            var questionText = $(this).find('.question-text').text();
            var answers = [];
            $(this).find('.answer-text').each(function () {
                var answerText = $(this).text().replace(' (Richtig)', '').trim();
                var isCorrect = $(this).hasClass('correct');
                answers.push({ text: answerText, correct: isCorrect });
            });
            questions.push({ text: questionText, answers: answers });
        });

        localStorage.setItem('questions_' + stackTitle, JSON.stringify(questions));

        console.log('Questions saved for', stackTitle, ':', questions);
    }

    // Funktion zum Hinzufügen einer Frage zum DOM
    function addQuestionToDOM(question, answers) {
        var answersHTML = '';
        answers.forEach(function (answer) {
            var correctText = answer.correct ? ' (Richtig)' : '';
            answersHTML += `
                <div>
                    <p class="answer-text ${answer.correct ? 'correct' : ''}" style="${answer.correct ? 'font-weight: bold; color: white; padding: 5px; border-radius: 5px;' : ''}">
                        ${answer.text}${correctText}
                    </p>
                </div>
            `;
        });
    
        var questionCard = `
            <div class="card mb-2 question-card">
                <div class="card-body">
                    <h5 class="question-text">${question}</h5>
                    ${answersHTML}
                    <button class="btn btn-sm btn-danger btn-delete-question">Frage löschen</button>
                </div>
            </div>
        `;
        $('#questionsList').append(questionCard);
    }

    // Event Listener für das Hinzufügen einer neuen Frage
    $('#editCardForm').submit(function (event) {
        event.preventDefault();
        var question = $('#question').val();
        var answers = [];
        $('#editCardForm .answer-input').each(function () {
            var answerText = $(this).val().trim(); // Entfernt unnötige Leerzeichen
            var isCorrect = $(this).siblings('.form-check').find('.correct-answer').is(':checked');
            answers.push({ text: answerText, correct: isCorrect });
        });
    
        if (question && answers.length) {
            addQuestionToDOM(question, answers);
            var stackTitle = $('#editCardModalLabel').text().replace('Bearbeite ', '');
            saveQuestions(stackTitle);
            $('#question').val('');
            $('.answer-input').val('');
            $('.correct-answer').prop('checked', false);
            $('#additionalAnswers').empty();
            addAnswerField(); // Hinzufügen des ersten Antwortfelds
        }
    });
    

    // Event Listener für das automatische Hinzufügen eines weiteren Antwortfelds
    $(document).on('input', '.answer-input:last', function () {
        var answerText = $(this).val().trim();
        if (answerText !== '') {
            addAnswerField();
        }
    });

    // Event Listener für das Markieren einer einzigen richtigen Antwort
    $(document).on('change', '.correct-answer', function () {
        $('.correct-answer').not(this).prop('checked', false);
        console.log(`Correct answer selected: ${$(this).siblings('.answer-input').val()}`);
    });

    // Funktion zum Hinzufügen eines weiteren Antwortfelds
    function addAnswerField() {
        var uniqueID = 'correctAnswer_' + Date.now(); // Eindeutige ID für jedes Antwortfeld
        var answerHTML = `
            <div class="form-group">
                <input type="text" class="form-control answer-input" placeholder="Weitere Antworten hinzufügen">
                <div class="form-check">
                    <input class="form-check-input correct-answer" type="radio" name="correctAnswer">
                    <label class="form-check-label">Richtig</label>
                </div>
            </div>
        `;
        $('#additionalAnswers').append(answerHTML);
    }

    // Event Listener für das Löschen einer Frage
    $(document).on('click', '.btn-delete-question', function () {
        $(this).closest('.question-card').remove();
        var stackTitle = $('#editCardModalLabel').text().replace('Bearbeite ', '');
        saveQuestions(stackTitle);
    });

    // Event Listener für den Lernen-Button
    $(document).on('click', '.btn-learn', function () {
        var cardTitle = $(this).siblings('.card-title').text();
        localStorage.setItem('currentLearningStack', cardTitle);
        window.location.href = 'lernen.html';
    });

    if (window.location.pathname.includes('lernen.html')) {
        loadLearningQuestions();
    }

    function loadLearningQuestions() {
        var stackTitle = localStorage.getItem('currentLearningStack');
        var storedQuestions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
        
        if (storedQuestions.length === 0) {
            $('#questionsContainer').append('<p>Keine Fragen in diesem Stapel.</p>');
            $('#evaluateBtn').hide();
            return;
        }

        storedQuestions.forEach((question, index) => {
            var questionHtml = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${question.text}</h5>
                        ${question.answers.map((answer, i) => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="question${index}" id="answer${index}-${i}" value="${answer.text}">
                                <label class="form-check-label" for="answer${index}-${i}">
                                    ${answer.text}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            $('#questionsContainer').append(questionHtml);
        });

        $('#evaluateBtn').click(evaluateAnswers);
        $('#backBtn').click(function() {
            window.location.href = 'index.html'; // Zurück zur Übersicht
        });
    }

    function evaluateAnswers() {
        var stackTitle = localStorage.getItem('currentLearningStack');
        var storedQuestions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
        var correctCount = 0;

        storedQuestions.forEach((question, index) => {
            var selectedAnswer = $(`input[name="question${index}"]:checked`).val();
            var correctAnswer = question.answers.find(answer => answer.correct).text;

            if (selectedAnswer === correctAnswer) {
                correctCount++;
            }
        });

        alert(`Du hast ${correctCount} von ${storedQuestions.length} Fragen richtig beantwortet.`);
    }

    // Laden der Stapel beim Start der Seite
    loadStacks();
    addAnswerField(); // Hinzufügen des ersten Antwortfelds beim Start der Seite
});

function saveQuestionToCache(question) {
    let stackTitle = $('#editCardModalLabel').text().replace('Bearbeite ', '');
    let questions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
    questions.push(question);
    localStorage.setItem('questions_' + stackTitle, JSON.stringify(questions));
    console.log('Questions saved to cache:', questions);
}

function displayQuestion(question) {
    const questionsList = document.getElementById('questionsList');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('card', 'mb-2');

    let answersHtml = '';
    question.answers.forEach((answer) => {
        console.log(`Display Answer: ${answer.text}, Correct: ${answer.correct}`); // Konsolen-Log hinzugefügt
        answersHtml += `<p class="answer-text ${answer.correct ? 'correct' : ''}" style="${answer.correct ? 'color: black;' : ''}">${answer.text}${answer.correct ? ' (Richtig)' : ''}</p>`;
    });

    questionDiv.innerHTML = `
        <div class="card-body">
            <h5 class="question-text">${question.text}</h5>
            ${answersHtml}
        </div>
    `;

    questionsList.appendChild(questionDiv);
    console.log('Displayed question:', question);
}

function loadQuestionsFromCache() {
    let stackTitle = $('#editCardModalLabel').text().replace('Bearbeite ', '');
    let questions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
    console.log('Questions loaded from cache for', stackTitle, ':', questions);
    questions.forEach(question => {
        displayQuestion(question);
    });
}
