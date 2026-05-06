from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import requests
import os
from dotenv import load_dotenv

from utils import *

# ==============================
# LOAD ENV
# ==============================
load_dotenv()
OCR_API_KEY = os.getenv("API_KEY")

# ==============================
# LOAD MODEL
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "main_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer_model.pkl"))

# ==============================
# INIT
# ==============================
app = Flask(__name__)
CORS(app)

# ==============================
# OCR FUNCTION
# ==============================
def extract_text(image_bytes, filename):
    url = "https://api.ocr.space/parse/image"

    res = requests.post(
        url,
        files={"file": (filename, image_bytes)},
        data={"apikey": OCR_API_KEY}
    )

    try:
        data = res.json()
        if data.get("ParsedResults"):
            return data["ParsedResults"][0]["ParsedText"]
    except:
        return ""

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
        text = extract_text(file.read(), file.filename)

        if not text.strip():
            return jsonify({"error": "No text detected"}), 400

        # VALIDATION
        if not is_food_related(text):
            return jsonify({"error": "Upload valid food label"}), 400

        clean = clean_text(text)
        vec = vectorizer.transform([clean])

        if vec.nnz < 5:
            return jsonify({"error": "Not enough food data"}), 400

        grade = model.predict(vec)[0]
        confidence = float(model.predict_proba(vec).max())

        risks = detect_risk(text)
        allergens = detect_allergens(text)
        usage = usage_recommendation(grade)

        conditions = request.form.get("health_conditions", "")
        conditions_list = [c.strip().lower() for c in conditions.split(",") if c]

        recs = generate_recommendations(risks, allergens, grade, conditions_list)

        ai_text = gemini_enhance(
            grade,
            risks,
            allergens,
            usage.get("frequency")
        )

        return jsonify({
            "analysis": {
                "grade": grade,
                "confidence": round(confidence, 2),
                "impact": usage.get("impact")
            },
            "usage": usage,
            "risks": {
                "list": risks,
                "details": risk_details(risks)
            },
            "allergens": {
                "list": allergens,
                "details": allergen_details(allergens)
            },
            "recommendations": recs,
            "ai_explanation": ai_text or "Basic analysis provided.",
            "extracted_text": text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    app.run(debug=True)