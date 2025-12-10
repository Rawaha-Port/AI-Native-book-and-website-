# src/services/user_service.py
import psycopg2
import os
import json
from typing import Dict, Any, Optional

# TODO: Replace with your actual database connection details from environment variables or a config file
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "mydatabase")
DB_USER = os.environ.get("DB_USER", "myuser")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "mypassword")

def get_db_connection():
    """Establishes and returns a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        return conn
    except psycopg2.OperationalError as e:
        print(f"Error connecting to the database: {e}")
        return None

def create_or_update_user_profile(user_id: str, profile_data: Dict[str, Any]) -> bool:
    """Creates or updates a user profile in the database."""
    conn = get_db_connection()
    if conn is None:
        return False
    
    try:
        with conn.cursor() as cur:
            # Use ON CONFLICT to handle both inserts and updates
            cur.execute(
                """
                INSERT INTO user_profiles (user_id, profile_data)
                VALUES (%s, %s)
                ON CONFLICT (user_id) DO UPDATE SET profile_data = EXCLUDED.profile_data;
                """,
                (user_id, json.dumps(profile_data))
            )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error creating/updating user profile: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a user profile from the database."""
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT profile_data FROM user_profiles WHERE user_id = %s;", (user_id,))
            result = cur.fetchone()
            if result:
                return result[0]
            else:
                return None
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return None
    finally:
        conn.close()
