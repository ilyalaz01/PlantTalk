import requests
import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Step 1: Initialize Firebase Admin with service account
cred = credentials.Certificate("firebase-key.json")  # 🔐 Add this file as a GitHub secret or in repo if private
firebase_admin.initialize_app(cred)
db = firestore.client()

# Step 2: Static UID for now (Yelena)
user_id = "l1YnCXx3HMbfBwexMGOvesRK6Bv2"
plant_id = "basilPlant1"

# Step 3: Fetch sensor data from gardenPi
try:
    r = requests.get("https://gardenpi.duckdns.org/", timeout=5)
    r.raise_for_status()
    data = r.json()
except Exception as e:
    print("Failed to fetch sensor data:", e)
    exit(1)

# Step 4: Prepare the data entry
entry = {
    "timestamp": datetime.datetime.utcnow().isoformat(),
    "soilMoisture": data["soil"]["percent"],
    "temperature": data["temperature"]["value"],
    "humidity": data["humidity"]["value"]
}

# Step 5: Write to Firestore
try:
    db.collection("users") \
      .document(user_id) \
      .collection("plants") \
      .document(plant_id) \
      .collection("logs") \
      .add(entry)
    print("Logged data for Yelena:", entry)
except Exception as e:
    print("Failed to write to Firestore:", e)
    exit(1)
