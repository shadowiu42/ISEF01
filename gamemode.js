$(document).ready(function () {
    var questions = []; // Variable für die Fragen des aktuellen Spiels
    var currentQuestionIndex = 0; // Index der aktuellen Frage
    var score = 0; // Punktestand des Spielers
    var timer; // Variable für den Timer
    var timePerQuestion = 20; // Sekunden pro Frage
    var answersGiven = []; // Array für die gegebenen Antworten
    var currentStackTitle = ''; // Titel des aktuellen Stapels
    var scoreHistory = []; // Score-Historie für den aktuellen Stapel

    // Initialisieren des aktuellen Benutzers beim Laden der Seite
    var currentUser = localStorage.getItem('currentUser') || $('#currentUser').text();
    $('#currentUser').text(currentUser); // Benutzername im Dropdown anzeigen

    // Funktion zum Speichern des aktuellen Benutzers im LocalStorage
    function updateCurrentUser(userName) {
        localStorage.setItem('currentUser', userName);
    }

    // Event-Handler für den Benutzerwechsel im Dropdown
    $('.user-switch').click(function() {
        var newUserName = $(this).data('username');
        $('#currentUser').text(newUserName);
        updateCurrentUser(newUserName);
    });

    // Funktion zum Laden der Stacks aus dem LocalStorage
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
            initializeDefaultScoreHistory(stack.title); // Initialisiere die Standard-Score-Historie
        });
    }

    // Funktion zum Erzeugen eines zufälligen Benutzernamens
    function getRandomUserName() {
        var userNames = ['Frank', 'Peter', 'Tom', 'Lisa', 'Laura'];
        return userNames[Math.floor(Math.random() * userNames.length)];
    }

    // Funktion zum Initialisieren der Standard-Score-Historie für einen Stapel
    function initializeDefaultScoreHistory(stackTitle) {
        if (!localStorage.getItem('scoreHistory_' + stackTitle)) {
            var defaultScores = [
                { date: '2024-06-01', user: getRandomUserName(), score: Math.floor(Math.random() * 3000) + 100 },
                { date: '2024-06-02', user: getRandomUserName(), score: Math.floor(Math.random() * 3000) + 100 },
                { date: '2024-06-03', user: getRandomUserName(), score: Math.floor(Math.random() * 3000) + 100 }
            ];
            localStorage.setItem('scoreHistory_' + stackTitle, JSON.stringify(defaultScores));
        }
    }

    // Funktion zum Laden der Fragen für das gewählte Spiel
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

    // Funktion zum Erzeugen der Fragen-Navigation
    function generateQuestionNav() {
        $('#questionButtonsContainer').empty();
        questions.forEach((question, index) => {
            var questionButton = `
                <div class="question-button" data-index="${index}">${index + 1}</div>
            `;
            $('#questionButtonsContainer').append(questionButton);
        });
    }

    // Funktion zum Aktualisieren der Fragen-Navigation
    function updateQuestionNav() {
        $('.question-button').removeClass('active');
        $(`.question-button[data-index="${currentQuestionIndex}"]`).addClass('active');
    }

    // Funktion zum Erzeugen der End-Fragen-Navigation
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

    // Funktion zum Laden der Score-Historie
    function loadScoreHistory(latestScoreDate, latestScore) {
        $('#scoreHistory').empty();
        scoreHistory.sort((a, b) => b.score - a.score);
        scoreHistory.forEach((entry) => {
            var listItemClass = entry.date === latestScoreDate && entry.score === latestScore ? 'list-group-item latest-score' : 'list-group-item';
            var listItem = `
                <li class="${listItemClass}">Der Nutzer: ${entry.user} hat am ${formatDate(entry.date)} folgende Punktzahl erreicht: ${entry.score}</li>
            `;
            $('#scoreHistory').append(listItem);
        });
    }

    // Funktion zum Formatieren des Datums
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    // Event-Handler für das Auswählen eines Stapels
    $(document).on('click', '.btn-select-stack', function () {
        var selectedStackTitle = $(this).data('title');
        currentStackTitle = selectedStackTitle;
        localStorage.setItem('currentGameStack', selectedStackTitle);
        $('#startGameBtn').prop('disabled', false);

        $('.card').removeClass('selected');
        $('.btn-select-stack').removeClass('selected');

        $(this).closest('.card').addClass('selected');
        $(this).addClass('selected');

        loadGameQuestions(selectedStackTitle);
    });

    // Event-Handler für den Start des Spiels
    $('#startGameBtn').click(function() {
        $('#stackSelectionContainer').hide();
        $('#gameContainer').show();
        generateQuestionNav();
        loadNextQuestion();
    });

    // Funktion zum Laden der nächsten Frage
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
        $('#timerBar').css('transition', 'none'); // Deaktivieren Sie die Animation
        $('#timerBar').css('width', '100%'); // Fortschrittsbalken sofort auf 100% setzen
        startTimer();
        updateQuestionNav();
    }

    // Funktion zum Starten des Timers für die Frage
    function startTimer() {
        var timeLeft = timePerQuestion;
        $('#timerBar').css({
            'width': '100%',
            'transition': 'none' // Transition ausschalten
        });
    
        setTimeout(function() {
            $('#timerBar').css({
                'transition': 'width 1s linear' // Transition wieder einschalten
            });
        }, 20); // Kurze Verzögerung, um die Transition-Änderung anzuwenden
    
        timer = setInterval(function() {
            timeLeft--;
            $('#timerBar').css('width', (timeLeft / timePerQuestion) * 100 + '%');
            if (timeLeft < 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    // Funktion zum Behandeln eines Timeouts (wenn der Timer abläuft)
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

    // Funktion zum Blinken der Buttons
    function flashButtons() {
        $('.answer-btn.correct').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
    }

    // Event-Handler für die Auswahl einer Antwort
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

    // Funktion zum Beenden des Spiels
    function endGame() {
        $('#gameContainer').hide();
        $('#endGameContainer').show();

        var highScore = scoreHistory.length > 0 ? Math.max(...scoreHistory.map(entry => entry.score)) : 0;
        var isHighScore = score > highScore;
        var endGameText = isHighScore ? `Neuer High Score! ${score}` : `Game Over! Your score: ${score}`;

        $('#endGameScore').text(endGameText);

        var currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        if (!scoreHistory.some(entry => entry.date === currentDate && entry.score === score)) {
            scoreHistory.push({ date: currentDate, user: currentUser, score: score });
            localStorage.setItem('scoreHistory_' + currentStackTitle, JSON.stringify(scoreHistory));
        }
        loadScoreHistory(currentDate, score); // Übergeben Sie das aktuelle Datum und den Score, um den neuesten Score hervorzuheben
        generateEndQuestionNav();
    }

    // Event-Handler zum Neustarten des Spiels
    $('#restartGameBtn').click(function() {
        currentQuestionIndex = 0;
        score = 0;
        answersGiven = [];
        $('#endGameContainer').hide();
        $('#stackSelectionContainer').show();
        $('#startGameBtn').prop('disabled', true);
    });

    // Event-Handler zur Rückkehr zur Übersicht
    $('#backToOverviewBtn').click(function() {
        window.location.href = 'gamemode.html';
    });

    // Event-Handler zum Wiederholen des Spiels
    $('#retryBtn').click(function() {
        currentQuestionIndex = 0;
        score = 0;
        answersGiven = [];
        $('#endGameContainer').hide();
        $('#gameContainer').show();
        generateQuestionNav(); // Quiz-Navigation zurücksetzen
        loadNextQuestion();
    });

    // Laden der Stacks beim Initialisieren der Seite
    loadStacks();
});
