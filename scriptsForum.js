$(document).ready(function () {
    
    const defaultCategories = ['Allgemein Wissen', 'Physik', 'Mathe'];

    const defaultQuestions = {
        'Allgemein Wissen': [
            {
                text: "Was ist die Hauptstadt von Deutschland?",
                answers: [{ text: "Berlin", user: "User01", timestamp: new Date().toLocaleString() }]
            },
            {
                text: "Welches Tier ist das größte Landraubtier?",
                answers: [{ text: "Eisbär", user: "User02", timestamp: new Date().toLocaleString() }]
            }
        ],
        'Physik': [
            {
                text: "Was ist die Formel für die Berechnung der Geschwindigkeit?",
                answers: [{ text: "v = s/t", user: "User01", timestamp: new Date().toLocaleString() }]
            },
            {
                text: "Welches Teilchen hat eine negative Ladung?",
                answers: [{ text: "Elektron", user: "User02", timestamp: new Date().toLocaleString() }]
            }
        ],
        'Mathe': [
            {
                text: "Was ist die Lösung der Gleichung 2x + 3 = 7?",
                answers: [{ text: "x = 2", user: "User01", timestamp: new Date().toLocaleString() }]
            },
            {
                text: "Was ist die Fläche eines Kreises mit Radius r?",
                answers: [{ text: "πr²", user: "User02", timestamp: new Date().toLocaleString() }]
            }
        ]
    };

    // Funktion um Bilder hinzuzufügen
    function convertImageToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function() {
          callback(reader.result);
        };
        reader.readAsDataURL(file);
      }

    function loadCategories() {
        // Verwenden Sie die vordefinierten Kategorien anstelle von LocalStorage
        let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories.slice();
        categories.sort(); // Alphabetische sortiren 
        $('#categories').empty();
        $('#categories').append(`<a href="#" class="list-group-item list-group-item-action category-item" data-category="all">Alle Kategorien</a>`);
        categories.forEach(category => {
            $('#categories').append(`<a href="#" class="list-group-item list-group-item-action category-item" data-category="${category}">${category}</a>`);
        });
        updateQuestionCategoryOptions(categories);
    }

    // Update des Event Handlers für das Hinzufügen einer Kategorie
    $('#addCategoryForm').submit(function (event) {
        event.preventDefault();
        let categoryName = $('#categoryName').val().trim();
        if (categoryName) {
            let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories.slice();
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

    function loadQuestions(categoryFilter = 'all') {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];

        // Fügen Sie die vordefinierten Fragen hinzu, wenn der LocalStorage leer ist
        if (questions.length === 0) {
            Object.keys(defaultQuestions).forEach(category => {
                defaultQuestions[category].forEach(question => {
                    question.category = category;
                    questions.push(question);
                });
            });
            localStorage.setItem('questions', JSON.stringify(questions));
        }

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
                        <p>${question.questionText || ''}</p>
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
                                <input type="file" class="form-control ml-2 answer-image" accept="image/*" data-index="${index}" style="display: none;" id="fileInput-${index}">
                                <label for="fileInput-${index}" class="btn btn-link ml-2"><i class="fas fa-paperclip"></i></label>
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
        answers.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        answers.forEach(answer => {
            let answerItem =`
                <div class="list-group-item answer-item">
                    <p>${answer.text}</p>
                    ${answer.image ? `<img src="${answer.image}" class="img-fluid">` : ''}
                    <small class="answer-meta">Geantwortet von: ${answer.user} | Am: ${answer.timestamp}</small>
                </div>
            `;
            answersList.append(answerItem);
        });
    }

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
        let answerImage = $(this).find('.answer-image[data-index="' + index + '"]')[0].files[0];
        if (answerText) {
            let questions = JSON.parse(localStorage.getItem('questions')) || [];
            let question = questions[index];
            let newAnswer = {
                text: answerText,
                user: currentUser.username,
                timestamp: new Date().toLocaleString()
            };
        
            if (answerImage) {
                convertImageToBase64(answerImage, function(base64Image) {
                  newAnswer.image = base64Image;
                  question.answers.push(newAnswer);
                  questions[index] = question;
                  localStorage.setItem('questions', JSON.stringify(questions));
                  loadAnswers(index, question.answers);
                  $(`#answerText-${index}`).val('');
                  $(`#answerImage-${index}`).val('');
                });
              } else {
                question.answers.push(newAnswer);
                questions[index] = question;
                localStorage.setItem('questions', JSON.stringify(questions));
                loadAnswers(index, question.answers);
                $(`#answerText-${index}`).val('');
              }
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
        localStorage.setItem('currentUser', currentUser.username);
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
