import httpx
import os
from pydantic import BaseModel
from typing import Dict, Any

BETTER_AUTH_SERVICE_URL = os.environ.get("BETTER_AUTH_SERVICE_URL", "http://localhost:4000")

class AuthDetails(BaseModel):
    email: str
    password: str

class AuthService:
    def __init__(self):
        self.client = httpx.AsyncClient(base_url=BETTER_AUTH_SERVICE_URL)

    async def sign_up(self, auth_details: AuthDetails) -> Dict[str, Any]:
        """
        Calls the Better Auth service to sign up a user.
        Note: This only validates the credentials with better-auth.
        User creation in our own database happens after this call succeeds.
        """
        try:
            response = await self.client.post(
                "/auth/signup/email",
                json={"email": auth_details.email, "password": auth_details.password}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            # Re-raise with more context or handle specific errors
            raise Exception(f"Failed to sign up with Better Auth: {e.response.text}") from e

    async def sign_in(self, auth_details: AuthDetails) -> Dict[str, Any]:
        """
        Calls the Better Auth service to sign in a user.
        """
        try:
            response = await self.client.post(
                "/auth/signin/email",
                json={"email": auth_details.email, "password": auth_details.password}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to sign in with Better Auth: {e.response.text}") from e

    async def sign_out(self) -> Dict[str, Any]:
        """
        Calls our backend's logout endpoint to clear the session cookie.
        """
        try:
            response = await self.client.post("/api/v1/auth/logout") # Call our own backend logout
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise Exception(f"Failed to sign out: {e.response.text}") from e

auth_service = AuthService()
