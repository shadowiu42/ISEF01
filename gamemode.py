import random

# Funktion zum Erstellen einer neuen Frage
def create_question(question_text, answers):
    """
    Funktion um eine neue Frage zu erstellen
    :param question_text: Text der Frage
    :param answers: Liste von Antworten mit jeweils einem Text und einem Boolean, der angibt, ob die Antwort korrekt ist
    :return: Ein Dictionary, das die Frage und die Antworten enthält
    """
    return {
        'text': question_text,
        'answers': [{'text': answer, 'correct': correct} for answer, correct in answers]
    }

# Funktion zum Erstellen eines neuen Quiz
def create_quiz(questions):
    """
    Funktion um ein neues Quiz zu erstellen
    :param questions: Liste von Fragen
    :return: Ein Dictionary, das das Quiz und die Fragen enthält
    """
    return {
        'questions': questions,
        'score': 0,
        'current_question': 0
    }

# Funktion zur Bewertung der Antwort
def evaluate_answer(quiz, selected_answer):
    """
    Funktion um eine Antwort zu bewerten
    :param quiz: Das aktuelle Quiz-Dictionary
    :param selected_answer: Die vom Benutzer ausgewählte Antwort
    :return: Aktualisiertes Quiz-Dictionary mit neuer Punktzahl und nächster Frage
    """
    current_question = quiz['questions'][quiz['current_question']]
    correct_answer = next(answer for answer in current_question['answers'] if answer['correct'])
    if selected_answer == correct_answer['text']:
        quiz['score'] += 1
    quiz['current_question'] += 1
    return quiz

# Funktion zur Überprüfung, ob das Quiz beendet ist
def is_quiz_finished(quiz):
    """
    Funktion um zu überprüfen, ob das Quiz beendet ist
    :param quiz: Das aktuelle Quiz-Dictionary
    :return: Boolean, der angibt, ob das Quiz beendet ist
    """
    return quiz['current_question'] >= len(quiz['questions'])

# Funktion zum Mischen der Antworten
def shuffle_answers(question):
    """
    Funktion um die Antworten einer Frage zu mischen
    :param question: Das Frage-Dictionary
    :return: Frage-Dictionary mit gemischten Antworten
    """
    random.shuffle(question['answers'])
    return question

# Beispielverwendung
if __name__ == "__main__":
    # Liste von Fragen und Antworten erstellen
    questions = [
        create_question("Was ist die Hauptstadt von Deutschland?", [("Berlin", True), ("München", False), ("Hamburg", False), ("Köln", False)]),
        create_question("Welches Tier ist das größte Landraubtier?", [("Eisbär", True), ("Löwe", False), ("Tiger", False), ("Wolf", False)]),
        create_question("Wer schrieb 'Faust'?", [("Johann Wolfgang von Goethe", True), ("Friedrich Schiller", False), ("Gotthold Ephraim Lessing", False), ("Heinrich Heine", False)]),
        create_question("Welches Land ist für das Essen 'Sushi' bekannt?", [("Japan", True), ("China", False), ("Thailand", False), ("Vietnam", False)])
    ]

    # Quiz erstellen
    quiz = create_quiz(questions)

    # Antworten mischen
    for question in quiz['questions']:
        shuffle_answers(question)

    # Quiz durchlaufen
    while not is_quiz_finished(quiz):
        current_question = quiz['questions'][quiz['current_question']]
        print(current_question['text'])
        for i, answer in enumerate(current_question['answers']):
            print(f"{i + 1}. {answer['text']}")
        selected_answer_index = int(input("Wählen Sie die richtige Antwort: ")) - 1
        selected_answer_text = current_question['answers'][selected_answer_index]['text']
        quiz = evaluate_answer(quiz, selected_answer_text)

    # Endergebnis anzeigen
    print(f"Quiz beendet! Ihre Punktzahl: {quiz['score']} von {len(quiz['questions'])}")
