# FastAPI Application

## Setup Instructions

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd Iot-Managment-System
   ```

2. **Create a virtual environment:**

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```
   pip install -r requirements.txt
   ```

4. **Run the application:**

   ```
   uvicorn app.main:app --reload
   ```

5. **Access the API documentation:**
   Open your browser and go to `http://127.0.0.1:8000/docs` to view the Swagger UI.
