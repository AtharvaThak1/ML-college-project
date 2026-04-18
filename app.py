from flask import Flask, request, jsonify
import joblib
import requests
import os
from dotenv import load_dotenv

from utils import *

# ==============================
# LOAD ENV
# ==============================
load_dotenv()
API_KEY = os.getenv("API_KEY")

# ==============================
# LOAD MODEL SAFELY (IMPORTANT FIX)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "main_model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "vectorizer_model.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# 🔥 DEBUG (REMOVE LATER)
print("Model loaded:", type(model))
print("Vectorizer loaded:", type(vectorizer))
print("Is vectorizer fitted:", hasattr(vectorizer, "vocabulary_"))

if hasattr(vectorizer, "vocabulary_"):
    print("Feature count:", len(vectorizer.vocabulary_))
else:
    print("❌ ERROR: Vectorizer is NOT fitted")

# ==============================
# INIT APP
# ==============================
app = Flask(__name__)

# ==============================
# OCR FUNCTION
# ==============================
def extract_text_ocr_space(image_bytes, filename):
    url = "https://api.ocr.space/parse/image"

    response = requests.post(
        url,
        files={"file": (filename, image_bytes)},  # dynamic filename
        data={
            "apikey": API_KEY,
            "language": "eng",
            "OCREngine": 2
        }
    )

    try:
        result = response.json()
    except:
        print("Invalid OCR response")
        return ""

    print("FULL OCR RESPONSE:", result)

    if isinstance(result, str):
        print("OCR ERROR:", result)
        return ""

    if result.get("IsErroredOnProcessing"):
        print("OCR ERROR:", result.get("ErrorMessage"))
        return ""

    parsed = result.get("ParsedResults")
    if parsed:
        return parsed[0].get("ParsedText", "")

    return ""

# ==============================
# MAIN API
# ==============================
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        filename = file.filename

        # validate file type
        allowed = ["jpg", "jpeg", "png", "webp"]
        ext = filename.split(".")[-1].lower()

        if ext not in allowed:
            return jsonify({"error": "Unsupported file type"}), 400

        image_bytes = file.read()

        # ==============================
        # OCR
        # ==============================
        extracted_text = extract_text_ocr_space(image_bytes, filename)

        print("EXTRACTED TEXT:", extracted_text)

        if not extracted_text.strip():
            return jsonify({"error": "No text detected"}), 400

        # ==============================
        # ML PREDICTION
        # ==============================
        clean = clean_text(extracted_text)

        try:
            vec = vectorizer.transform([clean])
        except Exception as e:
            return jsonify({"error": "Vectorizer error: " + str(e)}), 500

        grade = model.predict(vec)[0]
        confidence = float(model.predict_proba(vec).max())

        # ==============================
        # POST PROCESSING
        # ==============================
        risks = detect_risk(extracted_text)
        allergens = detect_allergens(extracted_text)

        usage, impact = usage_recommendation(grade)

        health_conditions = request.form.get("health_conditions", "")
        conditions_list = [c.strip().lower() for c in health_conditions.split(",") if c]

        personalized = personalized_advice(
            extracted_text, allergens, conditions_list
        )

        recommendations = generate_recommendations(risks, allergens)

        return jsonify({
            "analysis": {
                "grade": grade,
                "confidence": round(confidence, 2),
                "health_impact": impact
            },
            "risks": {
                "risk_words": risks,
                "severity": "high" if len(risks) >= 3 else "medium" if len(risks) == 2 else "low"
            },
            "allergens": {
                "detected": allergens
            },
            "usage": {
                "daily_recommendation": usage
            },
            "personalized": {
                "conditions": conditions_list,
                "advice": personalized
            },
            "recommendations": recommendations,
            "extracted_text": extracted_text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))