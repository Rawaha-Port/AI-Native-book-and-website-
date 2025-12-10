import firebase_admin
from firebase_admin import credentials, auth
import os

# TODO: Replace with the actual path to your Firebase service account key file
# This file should be kept secure and not committed to version control.
SERVICE_ACCOUNT_KEY_PATH = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY_PATH", "path/to/your/serviceAccountKey.json")

try:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

def verify_id_token(id_token: str):
    """Verifies the ID token and returns the user's UID."""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        # Handle exceptions, e.g., token expired, invalid token, etc.
        print(f"Error verifying ID token: {e}")
        return None
