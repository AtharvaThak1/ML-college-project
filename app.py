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
    text = re.sub(r'[^a-zA-Z ]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# ==============================
# RISK DETECTION
# ==============================
danger_words = ["sugar", "oil", "preservatives", "artificial", "sodium"]

def detect_risk(text):
    text = text.lower()
    return [w for w in danger_words if w in text]

# ==============================
# ALLERGEN DETECTION
# ==============================
def detect_allergens(text):
    allergens = {
        "milk": ["milk"],
        "nuts": ["nuts", "almond", "cashew", "peanut"],
        "gluten": ["wheat", "gluten", "barley"],
        "soy": ["soy"],
        "egg": ["egg"],
        "fish": ["fish"],
        "shellfish": ["shrimp", "crab", "lobster"]
    }

    found = []
    text = text.lower()

    for key, values in allergens.items():
        if any(v in text for v in values):
            found.append(key)

    return found

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
# API ROUTE
# ==============================
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]

    try:
        clean = clean_text(text)
        vec = vectorizer.transform([clean])

        grade = model.predict(vec)[0]
        confidence = float(model.predict_proba(vec).max())

        risks = detect_risk(text)
        allergens = detect_allergens(text)
        explanation = generate_explanation(grade)

        return jsonify({
            "grade": grade,
            "confidence": round(confidence, 2),
            "risk_words": risks,
            "allergens": allergens,
            "explanation": explanation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True)