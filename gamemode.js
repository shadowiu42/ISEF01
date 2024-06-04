$(document).ready(function () {
    var questions = [];
    var currentQuestionIndex = 0;
    var score = 0;
    var timer;
    var timePerQuestion = 10; // Sekunden pro Frage
    var answersGiven = [];
    var currentStackTitle = '';
    var scoreHistory = [];

    function loadStacks() {
        var storedStacks = JSON.parse(localStorage.getItem('stacks')) || [];
        $('#stacksContainer').empty();
        storedStacks.forEach(function (stack) {
            var stackCard = `
                <div class="card m-2" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${stack.title}</h5>
                        <button class="btn btn-select-stack" data-title="${stack.title}">Auswählen</button>
                    </div>
                </div>
            `;
            $('#stacksContainer').append(stackCard);
        });
    }

    function loadGameQuestions(stackTitle) {
        questions = JSON.parse(localStorage.getItem('questions_' + stackTitle)) || [];
        if (questions.length === 0) {
            $('#gameContainer').append('<p>Keine Fragen in diesem Stapel.</p>');
            $('#startGameBtn').hide();
            return;
        }
        $('#gameTitle').text('Game Mode: ' + stackTitle);
        scoreHistory = JSON.parse(localStorage.getItem('scoreHistory_' + stackTitle)) || [];
    }

    function generateQuestionNav() {
        $('#questionButtonsContainer').empty();
        questions.forEach((question, index) => {
            var questionButton = `
                <div class="question-button" data-index="${index}">${index + 1}</div>
            `;
            $('#questionButtonsContainer').append(questionButton);
        });
    }

    function updateQuestionNav() {
        $('.question-button').removeClass('active');
        $(`.question-button[data-index="${currentQuestionIndex}"]`).addClass('active');
    }

    function generateEndQuestionNav() {
        $('#questionButtonsContainerEnd').empty();
        answersGiven.forEach((result, index) => {
            var questionButtonClass = result === 'correct' ? 'question-button correct' : 'question-button wrong';
            var questionButton = `
                <div class="${questionButtonClass}" data-index="${index}">${index + 1}</div>
            `;
            $('#questionButtonsContainerEnd').append(questionButton);
        });
    }

    function loadScoreHistory() {
        $('#scoreHistory').empty();
        scoreHistory.sort((a, b) => b.score - a.score);
        scoreHistory.forEach((entry) => {
            var listItem = `
                <li class="list-group-item">${formatDate(entry.date)}: ${entry.score}</li>
            `;
            $('#scoreHistory').append(listItem);
        });
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    $(document).on('click', '.btn-select-stack', function () {
        var selectedStackTitle = $(this).data('title');
        currentStackTitle = selectedStackTitle;
        localStorage.setItem('currentGameStack', selectedStackTitle);
        $('#startGameBtn').prop('disabled', false);
        loadGameQuestions(selectedStackTitle);
    });

    $('#startGameBtn').click(function() {
        $('#stackSelectionContainer').hide();
        $('#gameContainer').show();
        generateQuestionNav();
        loadNextQuestion();
    });

    function loadNextQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }

        var question = questions[currentQuestionIndex];
        $('#questionText').text(question.text);
        var answersHtml = '';
        question.answers.forEach((answer, i) => {
            answersHtml += `
                <button class="btn btn-outline-primary answer-btn" data-answer="${answer.text}">${answer.text}</button>
            `;
        });
        $('.answers-container').html(answersHtml);
        startTimer();
        updateQuestionNav();
    }

    function startTimer() {
        var timeLeft = timePerQuestion;
        $('#timerBar').css('width', '100%');
        timer = setInterval(function() {
            timeLeft--;
            $('#timerBar').css('width', (timeLeft / timePerQuestion) * 100 + '%');
            if (timeLeft < 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        var correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.correct).text;
        $(`.answer-btn[data-answer="${correctAnswer}"]`).addClass('correct');
        flashButtons();
        answersGiven[currentQuestionIndex] = 'wrong';
        setTimeout(function() {
            currentQuestionIndex++;
            loadNextQuestion();
        }, 3000); // Verzögerung, um das Blinken zu sehen
    }

    function flashButtons() {
        $('.answer-btn.correct').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
    }

    $(document).on('click', '.answer-btn', function () {
        clearInterval(timer);
        var selectedAnswer = $(this).data('answer');
        var correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.correct).text;
        var isCorrect = selectedAnswer === correctAnswer;
        answersGiven[currentQuestionIndex] = isCorrect ? 'correct' : 'wrong';

        if (isCorrect) {
            $(this).addClass('correct');
            score += 10 + Math.floor((timePerQuestion - (timePerQuestion - parseFloat($('#timerBar').css('width'))) / timePerQuestion * 10)); // Beispiel für die Punktwertung
        } else {
            $(this).addClass('wrong');
            $(`.answer-btn[data-answer="${correctAnswer}"]`).addClass('correct');
        }

        $(`.question-button[data-index="${currentQuestionIndex}"]`).addClass(isCorrect ? 'correct' : 'wrong');

        setTimeout(function() {
            currentQuestionIndex++;
            loadNextQuestion();
        }, 1000);
    });

    function endGame() {
        $('#gameContainer').hide();
        $('#endGameContainer').show();
        $('#endGameScore').text(`Game Over! Your score: ${score}`);

        var currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        if (!scoreHistory.some(entry => entry.date === currentDate && entry.score === score)) {
            scoreHistory.push({ date: currentDate, score: score });
            localStorage.setItem('scoreHistory_' + currentStackTitle, JSON.stringify(scoreHistory));
        }
        loadScoreHistory();
        generateEndQuestionNav();
    }

    $('#retryBtn').click(function() {
        currentQuestionIndex = 0;
        score = 0;
        answersGiven = [];
        $('#endGameContainer').hide();
        $('#gameContainer').show();
        generateQuestionNav(); // Quiz-Navigation zurücksetzen
        loadNextQuestion();
    });

    $('#selectStackBtn').click(function() {
        $('#endGameContainer').hide();
        $('#stackSelectionContainer').show();
    });

    if (window.location.pathname.includes('gamemode.html')) {
        loadStacks();
        var selectedStackTitle = localStorage.getItem('currentGameStack');
        if (selectedStackTitle) {
            currentStackTitle = selectedStackTitle;
            loadGameQuestions(selectedStackTitle);
        }
    }
});
