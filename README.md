
# 🍎 AI Food Ingredient Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/ML-Scikit--Learn-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/API-Flask-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/OCR-OCR.space-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-React-blueviolet?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge"/>
</p>

<p align="center">
  🚀 <b>Snap ingredients → Decode health → Make smarter food choices</b>
</p>



## ✨ Features

- 📸 Upload food ingredient images instantly  
- 🔍 OCR extracts ingredient text automatically  
- 🧠 ML model predicts **NutriScore (A–E)**  
- ⚠️ Detects **risk ingredients** (sugar, sodium, preservatives)  
- 🧬 Identifies **allergens**  
- ❤️ Personalized advice based on health conditions  
- 📊 Smart usage recommendations (daily / limit / avoid)  




## 🏗️ Project Architecture

```bash
ML-college-mini-project-02/
│
├── frontend/     # React-based UI
├── backend/      # Flask API + ML Model
└── README.md     # Documentation
```


## 🛠️ Tech Stack

### 🎨 Frontend

* React.js
* Tailwind CSS, TypeScript
* Axios (API calls)

### ⚙️ Backend

* Flask (REST API)
* Python

### 🧠 Machine Learning

* Scikit-learn
* TF-IDF Vectorizer
* Text preprocessing pipeline

### 🔍 OCR

* OCR.space API (Image → Text extraction)



## 🚀 Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AbhishekGanvir/ML-college-mini-project-02.git
cd ML-college-mini-project-02
```



### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

📍 Runs on: `http://localhost:5000`



### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

📍 Runs on: `http://localhost:3000`



## 🔐 Environment Variables

Create a `.env` file inside **backend/**:

```
OCR_API_KEY=your_api_key_here
```



## 📸 Example Use Case

* Scan a biscuit or snack packet 🍪
* Detect harmful ingredients like sugar, oils, additives ⚠️
* Receive instant health insights and recommendations ❤️




## ⭐ Support

If this project helped or impressed you:

* ⭐ Star the repository
* 🍴 Fork it
* 💡 Contribute or suggest improvements

