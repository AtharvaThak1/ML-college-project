from flask import Flask, request, jsonify
import joblib
import requests
from dotenv import load_dotenv

load_dotenv()

from utils import *

# ==============================
# LOAD MODEL
# ==============================
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = Flask(__name__)


# ==============================
# OCR USING OCR.SPACE
# ==============================
def extract_text_ocr_space(image_bytes):
    url = "https://api.ocr.space/parse/image"

    response = requests.post(
        url,
        files={"file": image_bytes},
        data={
            "apikey": "helloworld",
            "language": "eng"
        }
    )

    result = response.json()

    try:
        if result["IsErroredOnProcessing"]:
            return ""

        parsed = result.get("ParsedResults")
        if parsed and len(parsed) > 0:
            return parsed[0].get("ParsedText", "")
        else:
            return ""

    except:
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
        health_conditions = request.form.get("health_conditions", "")

        image_bytes = file.read()

        # OCR
        extracted_text = extract_text_ocr_space(image_bytes)

        if not extracted_text.strip():
            return jsonify({"error": "No text detected"}), 400

        # Clean
        clean = clean_text(extracted_text)

        # Vectorize
        vec = vectorizer.transform([clean])

        # Predict
        grade = model.predict(vec)[0]
        confidence = float(model.predict_proba(vec).max())

        # Post processing
        risks = detect_risk(extracted_text)
        allergens = detect_allergens(extracted_text)

        usage, impact = usage_recommendation(grade)

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
import os

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))