from flask import Flask, request, jsonify
import joblib
import re

# ==============================
# LOAD MODEL
# ==============================
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = Flask(__name__)

# ==============================
# CLEAN TEXT
# ==============================
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text

# ==============================
# RISK DETECTION
# ==============================
danger_words = ["sugar", "oil", "preservatives", "artificial", "sodium"]

def detect_risk(text):
    return [w for w in danger_words if w in text.lower()]

# ==============================
# ALLERGEN DETECTION
# ==============================
def detect_allergens(text):
    allergens = ["milk", "nuts", "gluten", "soy", "egg"]
    return [a for a in allergens if a in text.lower()]

# ==============================
# EXPLANATION
# ==============================
def generate_explanation(grade):
    explanations = {
        "A": "Healthy and safe food",
        "B": "Mostly safe with minor concerns",
        "C": "Moderate health impact",
        "D": "Unhealthy, limit consumption",
        "E": "Highly unhealthy food"
    }
    return explanations.get(grade, "No data")

# ==============================
# MAIN API
# ==============================
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")

    # ML prediction
    clean = clean_text(text)
    vec = vectorizer.transform([clean])
    grade = model.predict(vec)[0]

    # LEVEL 3 FEATURES
    risks = detect_risk(text)
    allergens = detect_allergens(text)
    explanation = generate_explanation(grade)

    return jsonify({
        "grade": grade,
        "risk_words": risks,
        "allergens": allergens,
        "explanation": explanation
    })

# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True)