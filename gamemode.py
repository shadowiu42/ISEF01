from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for simplicity
scores = []  # Liste zur Speicherung der Scores im Speicher

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()  # JSON-Daten aus der Anfrage abrufen
    scores.append(data)  # Score-Daten zur Liste hinzufügen
    return jsonify({'status': 'success'}), 200  # Erfolgsantwort zurückgeben

@app.route('/get_scores', methods=['GET'])
def get_scores():
    return jsonify(scores), 200  # Alle Scores als JSON zurückgeben

if __name__ == '__main__':
    app.run(debug=True)  # Anwendung im Debug-Modus starten
