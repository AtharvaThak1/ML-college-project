import re

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
danger_words = [
    "sugar", "added sugar", "high fructose corn syrup",
    "palm oil", "refined oil", "hydrogenated",
    "preservatives", "artificial", "flavour enhancer",
    "sodium", "salt", "msg"
]

def detect_risk(text):
    text = text.lower()
    return [w for w in danger_words if w in text]


# ==============================
# ALLERGEN DETECTION
# ==============================
def detect_allergens(text):
    allergens = {
        "milk": ["milk", "lactose", "butter", "cheese"],
        "nuts": ["nuts", "almond", "cashew", "peanut", "walnut"],
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
# USAGE LOGIC
# ==============================
def usage_recommendation(grade):
    mapping = {
        "A": ("Safe daily", "Low impact"),
        "B": ("Moderate daily", "Mild impact"),
        "C": ("Limit (2-3/week)", "Moderate impact"),
        "D": ("Rare consumption", "High impact"),
        "E": ("Avoid", "Very high impact")
    }
    return mapping.get(grade, ("Unknown", "Unknown"))


# ==============================
# PERSONALIZATION
# ==============================
def personalized_advice(text, allergens, conditions):
    advice = []

    if not conditions:
        return advice

    text = text.lower()

    if "diabetes" in conditions and "sugar" in text:
        advice.append("Avoid high sugar due to diabetes")

    if "lactose_intolerance" in conditions and "milk" in allergens:
        advice.append("Contains lactose, avoid this product")

    if "heart" in conditions and "oil" in text:
        advice.append("High oil content may affect heart health")

    return advice


# ==============================
# RECOMMENDATIONS
# ==============================
def generate_recommendations(risks, allergens):
    recs = []

    if "sugar" in risks:
        recs.append("Choose low-sugar alternatives")

    if "palm oil" in risks or "refined oil" in risks:
        recs.append("Use healthier oils like olive oil")

    if "milk" in allergens:
        recs.append("Try plant-based milk options")

    if not recs:
        recs.append("Food looks relatively safe")

    return recs