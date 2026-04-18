import os

from flask import Flask, request, jsonify
import joblib
import pytesseract
from PIL import Image
import io

from utils import *

# ==============================
# LOAD MODEL
# ==============================
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = Flask(__name__)

# ==============================
# OPTIONAL: SET TESSERACT PATH (WINDOWS)
# ==============================
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# ==============================
# OCR FUNCTION
# ==============================
def extract_text(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text


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

        # Read image
        image_bytes = file.read()

        # OCR
        extracted_text = extract_text(image_bytes)

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

        # Response
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