# ==============================
# utils.py
# ==============================

import re
import os
import requests


# ==============================
# CLEAN TEXT
# ==============================
def clean_text(text):

    text = str(text).lower()

    text = re.sub(
        r'[^a-zA-Z ]',
        ' ',
        text
    )

    return re.sub(
        r'\s+',
        ' ',
        text
    ).strip()


# ==============================
# FOOD VALIDATION
# ==============================
def is_food_related(text):

    keywords = [
        "ingredient",
        "contains",
        "nutrition",
        "protein",
        "sugar",
        "salt",
        "oil",
        "fat",
        "carbohydrate",
        "sodium",
        "milk",
        "wheat",
        "flour"
    ]

    text = text.lower()

    matches = sum(
        1 for k in keywords
        if k in text
    )

    return matches >= 2


# ==============================
# RISK DETECTION
# ==============================
danger_words = [
    "sugar",
    "palm oil",
    "refined oil",
    "sodium",
    "salt",
    "msg",
    "preservatives"
]

def detect_risk(text):

    text = text.lower()

    return [
        w for w in danger_words
        if w in text
    ]


# ==============================
# ALLERGEN DETECTION
# ==============================
def detect_allergens(text):

    allergens = {

        "milk": [
            "milk",
            "lactose"
        ],

        "gluten": [
            "wheat",
            "gluten"
        ],

        "nuts": [
            "almond",
            "cashew",
            "peanut"
        ],

        "soy": [
            "soy"
        ],

        "egg": [
            "egg"
        ]
    }

    found = []

    text = text.lower()

    for key, values in allergens.items():

        if any(v in text for v in values):
            found.append(key)

    return found


# ==============================
# USAGE
# ==============================
def usage_recommendation(grade):

    return {

        "A": {
            "level": "Safe",
            "frequency": "Daily",
            "quantity": "1-2 servings/day",
            "impact": "Low"
        },

        "B": {
            "level": "Moderate",
            "frequency": "Daily (limited)",
            "quantity": "1 serving/day",
            "impact": "Mild"
        },

        "C": {
            "level": "Limit",
            "frequency": "2-3/week",
            "quantity": "Small portions",
            "impact": "Moderate"
        },

        "D": {
            "level": "Rare",
            "frequency": "1-2/week",
            "quantity": "Very small",
            "impact": "High"
        },

        "E": {
            "level": "Avoid",
            "frequency": "Avoid",
            "quantity": "None",
            "impact": "Very high"
        }

    }.get(grade, {})


# ==============================
# RISK DETAILS
# ==============================
def risk_details(risks):

    info = {

        "sugar":
        "High sugar may cause diabetes and weight gain.",

        "sodium":
        "Excess salt can increase blood pressure.",

        "palm oil":
        "High saturated fats may affect heart health.",

        "refined oil":
        "Processed oils may increase cholesterol.",

        "msg":
        "May trigger headaches in sensitive individuals.",

        "preservatives":
        "Frequent intake may affect metabolism."
    }

    return [

        {
            "name": r,

            "description":
            info.get(
                r,
                "May affect health"
            ),

            "long_term":
            "Frequent use may be harmful"
        }

        for r in risks
    ]


# ==============================
# ALLERGEN DETAILS
# ==============================
def allergen_details(allergens):

    return [

        {
            "name": a,

            "symptoms":
            "Digestive issues / allergic reactions",

            "prevalence":
            "Common in some individuals"
        }

        for a in allergens
    ]


# ==============================
# RECOMMENDATIONS
# ==============================
def generate_recommendations(
    risks,
    allergens,
    grade,
    conditions
):

    recs = {

        "overall": "",

        "do": [],

        "avoid": [],

        "alternatives": [],

        "medical_warnings": []
    }

    # =========================
    # OVERALL
    # =========================
    if grade in ["A", "B"]:

        recs["overall"] = (
            "Good food choice with balanced intake."
        )

    elif grade == "C":

        recs["overall"] = (
            "Consume in moderation."
        )

    else:

        recs["overall"] = (
            "Limit or avoid consumption."
        )

    # =========================
    # RISK BASED
    # =========================
    if "sugar" in risks:

        recs["avoid"].append(
            "High sugar intake"
        )

        recs["alternatives"].append(
            "Use natural sweeteners"
        )

    if "sodium" in risks:

        recs["avoid"].append(
            "Excess salt"
        )

        recs["alternatives"].append(
            "Low sodium options"
        )

    if "milk" in allergens:

        recs["avoid"].append(
            "Dairy products"
        )

        recs["alternatives"].append(
            "Plant-based milk"
        )

    # =========================
    # HEALTH CONDITIONS
    # =========================

    # Diabetes
    if "diabetes" in conditions:

        recs["do"].append(
            "Prefer low sugar foods"
        )

        if "sugar" in risks:

            recs["medical_warnings"].append(
                "This product contains sugar which may increase blood glucose levels."
            )

    # Blood Pressure
    if (
        "bp" in conditions
        or "blood_pressure" in conditions
    ):

        recs["do"].append(
            "Choose low sodium foods"
        )

        if "sodium" in risks:

            recs["medical_warnings"].append(
                "High sodium may increase blood pressure."
            )

    # Heart
    if "heart" in conditions:

        recs["do"].append(
            "Prefer low fat foods"
        )

        if (
            "palm oil" in risks
            or "refined oil" in risks
        ):

            recs["medical_warnings"].append(
                "Processed oils may affect heart health."
            )

    # Lactose
    if "lactose_intolerance" in conditions:

        if "milk" in allergens:

            recs["medical_warnings"].append(
                "Contains dairy ingredients that may trigger lactose intolerance."
            )

    # Default
    if not recs["do"]:

        recs["do"].append(
            "Maintain balanced diet"
        )

    return recs


# ==============================
# GEMINI
# ==============================
def gemini_enhance(
    grade,
    risks,
    allergens,
    usage,
    conditions
):

    api_key = os.getenv(
        "GEMINI_API_KEY"
    )

    if not api_key:
        return ""

    prompt = f"""
Explain this food health analysis simply.

Food Grade: {grade}

Detected Risks: {risks}

Detected Allergens: {allergens}

Recommended Usage: {usage}

User Health Conditions: {conditions}

Give:
- personalized warning
- health impact
- foods to avoid
- safer suggestions

Keep response short and simple.
"""

    url = (
        "https://generativelanguage.googleapis.com"
        f"/v1/models/gemini-pro:generateContent?key={api_key}"
    )

    try:

        res = requests.post(
            url,
            json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
        )

        data = res.json()

        return (
            data["candidates"][0]
            ["content"]["parts"][0]["text"]
        )

    except:
        return ""