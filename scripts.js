$(document).ready(function () {
    $('#addCardForm').submit(function (event) {
        event.preventDefault();
        var cardTitle = $('#cardTitle').val();
        if (cardTitle) {
            var newCard = `
                <div class="col-md-4 mb-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${cardTitle}</h5>
                            <button class="btn btn-edit">Bearbeiten</button>
                            <button class="btn btn-learn">Lernen</button>
                        </div>
                    </div>
                </div>
            `;
            $('#addCardModal').modal('hide');
            $('#card-container .add-card-container').before(newCard);
            $('#cardTitle').val('');
        }
    });

    
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
        }
    });

    // Event delegation to handle dynamic answer buttons
    $(document).on('click', '.btn-antworten', function () {
        var answerInput = $(this).siblings('input');
        var answerText = answerInput.val();
        if (answerText) {
            var newAnswer = `<p>${answerText}</p>`;
            $(newAnswer).insertBefore(answerInput);
            answerInput.val('');
        }
    });
});
