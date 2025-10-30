import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Step 1: Register
print("1. Registering user...")
register_data = {
    "email": "apitest@example.com",
    "username": "apitest",
    "password": "ApiTest@123",
    "password_confirm": "ApiTest@123",
    "first_name": "API",
    "last_name": "Test"
}

response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
if response.status_code == 201:
    print("✓ User registered successfully")
else:
    print(f"✗ Registration failed: {response.text}")

# Step 2: Login
print("\n2. Logging in...")
login_data = {
    "email": "apitest@example.com",
    "password": "ApiTest@123"
}

response = requests.post(f"{BASE_URL}/auth/token/", json=login_data)
if response.status_code == 200:
    tokens = response.json()
    access_token = tokens['access']
    print(f"✓ Login successful")
    print(f"Access Token: {access_token[:50]}...")
else:
    print(f"✗ Login failed: {response.text}")
    exit()

# Step 3: Create Application
print("\n3. Creating application...")
headers = {
    "Authorization": f"Bearer {access_token}"
}

app_data = {
    "kind": "job",
    "title": "Backend Developer",
    "organization": "StartupXYZ",
    "location_country": "Pakistan",
    "status": "draft",
    "priority": 3,
    "notes": "Great opportunity",
    "tags": ["python", "django", "remote"]
}

response = requests.post(
    f"{BASE_URL}/applications/", 
    json=app_data,
    headers=headers
)

if response.status_code == 201:
    app = response.json()
    print(f"✓ Application created: {app['title']}")
    print(f"Application ID: {app['id']}")
else:
    print(f"✗ Failed to create application: {response.text}")

# Step 4: List Applications
print("\n4. Listing applications...")
response = requests.get(f"{BASE_URL}/applications/", headers=headers)
if response.status_code == 200:
    data = response.json()
    print(f"✓ Found {data['count']} applications")
    for app in data['results']:
        print(f"  - {app['title']} at {app['organization']}")
else:
    print(f"✗ Failed to list applications: {response.text}")

# Step 5: Get User Profile
print("\n5. Getting user profile...")
response = requests.get(f"{BASE_URL}/auth/users/me/", headers=headers)
if response.status_code == 200:
    user = response.json()
    print(f"✓ User: {user['email']}")
    print(f"  Name: {user['first_name']} {user['last_name']}")
else:
    print(f"✗ Failed to get profile: {response.text}")