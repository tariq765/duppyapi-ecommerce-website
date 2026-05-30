import requests
import json
import uuid

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    # Unique email for testing
    email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    password = "Password123"
    name = "Test User"

    print(f"--- Starting Auth Flow Test for {email} ---")

    # 1. Signup
    print(f"\n[1] Testing Signup...")
    signup_data = {
        "name": name,
        "email": email,
        "password": password
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
        if r.status_code != 201:
            print("Signup failed!")
            return
    except Exception as e:
        print(f"Error during signup: {e}")
        return

    # 2. Login
    print(f"\n[2] Testing Login...")
    login_data = {
        "email": email,
        "password": password
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
        if r.status_code != 200:
            print("Login failed!")
            return
        
        access_token = r.json().get("access_token")
        refresh_token_cookie = r.cookies.get("refresh_token")
        print(f"Access Token: {access_token[:20]}...")
        print(f"Refresh Token Cookie: {'Found' if refresh_token_cookie else 'Missing'}")
    except Exception as e:
        print(f"Error during login: {e}")
        return

    # 3. Get Me (Verify Token)
    print(f"\n[3] Testing Get Me...")
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
        if r.status_code == 200:
            print("\n--- Auth Flow Test SUCCESS ---")
        else:
            print("\n--- Auth Flow Test FAILED ---")
    except Exception as e:
        print(f"Error during get_me: {e}")

if __name__ == "__main__":
    test_auth_flow()
