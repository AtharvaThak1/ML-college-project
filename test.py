import requests

res = requests.post(
    "http://127.0.0.1:5000/analyze",
    json={"text": "sugar oil preservatives"}
)

print(res.json())