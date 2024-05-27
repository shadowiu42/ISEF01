$(document).ready(function () {
    // Benutzer-Authentifizierung
    const users = [
        { username: 'User01', password: 'pass01' },
        { username: 'User02', password: 'pass02' }
    ];

    let currentUser = users[0]; // Standardmäßiger Benutzer

    // Kategorien und Beiträge laden
    function loadCategories() {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        $('#categories').empty();
        $('#categories').append(`<a href="#" class="list-group-item list-group-item-action category-item" data-category="all">Alle Kategorien</a>`);
        categories.forEach(category => {
            $('#categories').append(`<a href="#" class="list-group-item list-group-item-action category-item" data-category="${category}">${category}</a>`);
        });
        updateQuestionCategoryOptions(categories);
    }

    function loadQuestions(categoryFilter = 'all') {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        $('#questions-list').empty();

        if (categoryFilter !== 'all') {
            questions = questions.filter(question => question.category === categoryFilter);
        }

        questions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        questions.forEach((question, index) => {
            $('#questions-list').append(`
                <div class="list-group-item">
                    <div class="question-item" data-index="${index}">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>${question.text}</h5>
                                <p><small>Kategorie: ${question.category}</small></p>
                                <p><small>Erstellt von: ${question.user} am ${question.timestamp}</small></p>
                            </div>
                            <button class="btn btn-link toggle-answers">Antworten anzeigen</button>
                        </div>
                        <div class="answers-container" style="display: none;">
                            <div id="answers-list-${index}" class="list-group mt-2">
                                <!-- Antworten werden hier eingefügt -->
                            </div>
                            <form class="add-answer-form" data-index="${index}">
                                <div class="form-group">
                                    <label for="answerText-${index}">Antworttext</label>
                                    <input type="text" class="form-control" id="answerText-${index}" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Antwort hinzufügen</button>
                            </form>
                        </div>
                    </div>
                </div>
            `);
            loadAnswers(index, question.answers);
        });
    }

    function loadAnswers(index, answers) {
        let answersList = $(`#answers-list-${index}`);
        answersList.empty();
        answers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        answers.forEach(answer => {
            answersList.append(`
                <div class="list-group-item">
                    <p>${answer.text}</p>
                    <small>Geantwortet von: ${answer.user} am ${answer.timestamp}</small>
                </div>
            `);
        });
    }

    // Event Listener für das Hinzufügen einer neuen Kategorie
    $('#addCategoryForm').submit(function (event) {
        event.preventDefault();
        let categoryName = $('#categoryName').val().trim();
        if (categoryName) {
            let categories = JSON.parse(localStorage.getItem('categories')) || [];
            if (!categories.includes(categoryName)) {
                categories.push(categoryName);
                localStorage.setItem('categories', JSON.stringify(categories));
                loadCategories();
                $('#addCategoryModal').modal('hide');
                $('#categoryName').val('');
            } else {
                alert('Diese Kategorie existiert bereits.');
            }
        }
    });

    // Event Listener für das Hinzufügen einer neuen Frage
    $('#addQuestionForm').submit(function (event) {
        event.preventDefault();
        let questionText = $('#questionText').val().trim();
        let questionCategory = $('#questionCategory').val();
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        
        if (questionText && questionCategory) {
            let newQuestion = {
                text: questionText,
                category: questionCategory,
                user: currentUser.username,
                timestamp: new Date().toLocaleString(),
                answers: []
            };
            questions.push(newQuestion);
            localStorage.setItem('questions', JSON.stringify(questions));
            loadQuestions();
            $('#addQuestionModal').modal('hide');
            $('#questionText').val('');
        }
    });

    // Event Listener für das Hinzufügen einer neuen Antwort
    $(document).on('submit', '.add-answer-form', function (event) {
        event.preventDefault();
        let index = $(this).data('index');
        let answerText = $(`#answerText-${index}`).val().trim();
        if (answerText) {
            let questions = JSON.parse(localStorage.getItem('questions')) || [];
            let question = questions[index];
            let newAnswer = {
                text: answerText,
                user: currentUser.username,
                timestamp: new Date().toLocaleString()
            };
            question.answers.push(newAnswer);
            questions[index] = question;
            localStorage.setItem('questions', JSON.stringify(questions));
            loadAnswers(index, question.answers);
            $(`#answerText-${index}`).val('');
        }
    });

    // Event Listener für Kategorie-Auswahl bei neuen Fragen
    function updateQuestionCategoryOptions(categories) {
        $('#questionCategory').empty();
        categories.forEach(category => {
            $('#questionCategory').append(`<option value="${category}">${category}</option>`);
        });
    }

    // Benutzer wechseln
    $(document).on('click', '.user-switch', function () {
        let username = $(this).data('username');
        currentUser = users.find(user => user.username === username);
        $('#currentUser').text(currentUser.username);
    });

    // Antworten ein- und ausklappen
    $(document).on('click', '.toggle-answers', function () {
        let answersContainer = $(this).closest('.question-item').find('.answers-container');
        answersContainer.slideToggle();
        $(this).text(answersContainer.is(':visible') ? 'Antworten verbergen' : 'Antworten anzeigen');
    });

    // Kategorie filtern
    $(document).on('click', '.category-item', function (event) {
        event.preventDefault();
        let category = $(this).data('category');
        loadQuestions(category);
        $('.category-item').removeClass('active');
        $(this).addClass('active');
    });

    // Daten zurücksetzen
    $('#resetData').click(function () {
        if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
            localStorage.removeItem('categories');
            localStorage.removeItem('questions');
            loadCategories();
            loadQuestions();
        }
    });

    // Initiales Laden der Kategorien und Fragen
    loadCategories();
    loadQuestions();
});
