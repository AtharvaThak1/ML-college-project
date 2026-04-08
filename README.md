<h1 align="center">🥗 Food Ingredient Health Checker</h1>

<p align="center">
  <b>Machine Learning based API to analyze food ingredients and predict health grade</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Flask-API-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/MachineLearning-ScikitLearn-orange?style=for-the-badge">
</p>

<p align="center">
  🚀 <b>Live API:</b> 
  <a href="https://ml-college-project.onrender.com" target="_blank">
    https://ml-college-project.onrender.com
  </a>
</p>

---

<h2>✨ Features</h2>

<ul>
  <li>🧠 Predicts food <b>health grade (A–E)</b></li>
  <li>📊 Shows <b>confidence score</b></li>
  <li>⚠️ Detects <b>risky ingredients</b></li>
  <li>🧪 Identifies <b>allergens</b></li>
  <li>⚡ Fast and simple API</li>
</ul>

---

<h2>⚙️ How It Works</h2>

<ol>
  <li>Ingredient text is cleaned</li>
  <li>Converted using TF-IDF</li>
  <li>Model predicts grade</li>
  <li>Risk & allergen detection applied</li>
</ol>

---

<h2>📦 Tech Stack</h2>

<p>
  Python • Flask • Scikit-learn • Pandas • NumPy
</p>

---

<h2>📂 Project Structure</h2>

<pre>
project/
│── app.py
│── model.pkl
│── vectorizer.pkl
│── requirements.txt
│── Procfile
</pre>

---

<h2>🧪 API Usage</h2>

<b>Endpoint:</b>
<pre>POST /analyze</pre>

<b>Request:</b>

<pre>
{
  "text": "milk sugar oil wheat"
}
</pre>

<b>Response:</b>

<pre>
{
  "grade": "C",
  "confidence": 0.82,
  "risk_words": ["sugar", "oil"],
  "allergens": ["milk", "gluten"]
}
</pre>

---

<h2>🌐 Live Testing</h2>

<p>
  You can test the deployed API using tools like Postman or Curl:
</p>

<pre>
POST https://ml-college-project.onrender.com/analyze
</pre>

---

<h2>🚀 Run Locally</h2>

<pre>
git clone https://github.com/AtharvaThak1/ML-college-project.git
cd ML-college-project
pip install -r requirements.txt
python app.py
</pre>

---

<h2>📈 Model Details</h2>

<ul>
  <li>Algorithm: Logistic Regression</li>
  <li>Vectorizer: TF-IDF</li>
  <li>Input: Ingredients</li>
  <li>Output: Grade (A–E)</li>
</ul>

---

<h2>👨‍💻 Author</h2>

<p>Atharva Thak</p>

---

<h2 align="center">⭐ If you like this project, give it a star!</h2>

<p align="center">
  <img src="https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif" width="200">
</p>
