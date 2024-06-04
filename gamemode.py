from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for simplicity
scores = []

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    scores.append(data)
    return jsonify({'status': 'success'}), 200

@app.route('/get_scores', methods=['GET'])
def get_scores():
    return jsonify(scores), 200

if __name__ == '__main__':
    app.run(debug=True)
