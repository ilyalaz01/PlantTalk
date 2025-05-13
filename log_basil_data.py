import requests
import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Step 1: Authorize access to Google Sheets
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# Step 2: Open the Google Sheet
sheet = client.open("Basil Logger").sheet1

# Step 3: Fetch live sensor data
r = requests.get("https://gardenpi.duckdns.org/")
data = r.json()

# Step 4: Extract needed info
timestamp = datetime.datetime.now().isoformat()
moisture = data["soil"]["percent"]
temperature = data["temperature"]["value"]
humidity = data["humidity"]["value"]

# Step 5: Log to Google Sheets
sheet.append_row([timestamp, moisture, temperature, humidity])
print("✅ Logged:", timestamp, moisture, temperature, humidity)
