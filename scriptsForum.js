$(document).ready(function () {
    const users = [
        { username: 'User01', password: 'pass01' },
        { username: 'User02', password: 'pass02' }
    ];

    let currentUser = users[0]; 

    function loadCategories() {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.sort(); // Alphabetische sortiren 
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
                        <h5 class="question-title">${question.text}</h5>
                        <p>${question.questionText}</p>
                        <p class="question-meta">In: ${question.category} | Erstellt von: ${question.user} | Am: ${question.timestamp}</p>
                        <hr>
                        <button class="btn btn-link toggle-answers" data-visible="false">Antworten anzeigen</button>
                        <div class="answers-container" style="display: none;">
                            <div id="answers-list-${index}" class="list-group mt-2">
                                <!-- Antworten werden hier eingefügt -->
                            </div>
                            <form class="add-answer-form mt-3" data-index="${index}">
                                <div class="form-group d-flex">
                                    <input type="text" class="form-control" id="answerText-${index}" placeholder="Antwort schreiben..." required>
                                    <button type="submit" class="btn btn-primary ml-2">Absenden</button>
                                </div>
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
                <div class="list-group-item answer-item">
                    <p>${answer.text}</p>
                    <small class="answer-meta">Geantwortet von: ${answer.user} | Am: ${answer.timestamp}</small>
                </div>
            `);
        });
    }

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

    $('#addQuestionForm').submit(function (event) {
        event.preventDefault();
        let questionTitle = $('#questionTitle').val().trim();
        let questionCategory = $('#questionCategory').val();
        let questionText = $('#questionText').val().trim();
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        
        if (questionTitle && questionCategory && questionText) {
            let newQuestion = {
                text: questionTitle,
                category: questionCategory,
                user: currentUser.username,
                timestamp: new Date().toLocaleString(),
                answers: [],
                questionText: questionText
            };
            questions.push(newQuestion);
            localStorage.setItem('questions', JSON.stringify(questions));
            loadQuestions();
            $('#addQuestionModal').modal('hide');
            $('#questionTitle').val('');
            $('#questionText').val('');
        }
    });

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

    function updateQuestionCategoryOptions(categories) {
        $('#questionCategory').empty();
        categories.forEach(category => {
            $('#questionCategory').append(`<option value="${category}">${category}</option>`);
        });
    }

    $(document).on('click', '.user-switch', function () {
        let username = $(this).data('username');
        currentUser = users.find(user => user.username === username);
        $('#currentUser').text(currentUser.username);
    });

    $(document).on('click', '.toggle-answers', function () {
        let answersContainer = $(this).closest('.question-item').find('.answers-container');
        let isVisible = $(this).data('visible');
        if (isVisible) {
            $(this).text('Antworten anzeigen');
        } else {
            $(this).text('Antworten verbergen');
        }
        $(this).data('visible', !isVisible);
        answersContainer.slideToggle();
    });
    

    $(document).on('click', '.category-item', function (event) {
        event.preventDefault();
        let category = $(this).data('category');
        loadQuestions(category);
        $('.category-item').removeClass('active');
        $(this).addClass('active');
    });

    $('#resetData').click(function () {
        if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
            localStorage.removeItem('categories');
            localStorage.removeItem('questions');
            loadCategories();
            loadQuestions();
        }
    });

    loadCategories();
    loadQuestions();
});
