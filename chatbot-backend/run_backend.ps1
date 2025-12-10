# run_backend.ps1
# This script is used to run the chatbot backend after setting up the environment variables.

# Set the GEMINI_API_KEY from the .env file.
# Note: The .env file should contain GEMINI_API_KEY="YOUR_API_KEY"
$env:GEMINI_API_KEY = (Get-Content .\.env | Select-String -Pattern "GEMINI_API_KEY=(.*)").Matches[0].Groups[1].Value

# Temporarily unset GOOGLE_API_KEY if it's set globally
Remove-Item Env:GOOGLE_API_KEY -ErrorAction SilentlyContinue

# Ensure Python 3.11 venv is used
. .\venv\Scripts\activate.ps1

# Run the uvicorn server
.\venv\Scripts\python.exe -m uvicorn main:app --reload
