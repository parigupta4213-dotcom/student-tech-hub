# 🎓 Student Tech Hub

A beginner-friendly full-stack web application designed for student tech communities. It displays a schedule of upcoming technical workshops and hackathons, allows users to fetch live events from a Python backend, and provides a registration form for new students.

Built strictly with **plain HTML, CSS, JavaScript (Vanilla JS)** on the frontend and **FastAPI (Python)** on the backend. No complex frameworks (no React, Next.js, or TypeScript), no databases, no Docker, and no complicated setup.

---

## 📁 Project Structure

```text
student-tech-hub/
├── frontend/
│   ├── index.html     # Semantic HTML layout and structure
│   ├── style.css      # Clean, modern, and responsive CSS
│   └── script.js      # Plain JavaScript handling API calls & DOM updates
├── backend/
│   ├── main.py        # FastAPI server with CORS & endpoints
│   └── requirements.txt # Python dependencies (fastapi & uvicorn)
└── README.md          # Project documentation and guide
```

---

## 🚀 Features

- **Responsive & Modern UI**: Built with pure CSS using CSS variables, Flexbox, and CSS Grid. Works seamlessly on desktop and mobile.
- **Event Schedule Explorer**: Browse technical workshops, AI hackathons, open source labs, and career panels.
- **On-Demand Data Loading**: Load/refresh events from the backend with the click of a button.
- **Student Registration**: Simple form accepting a student's name and email with real-time feedback and validation.
- **CORS Enabled**: Configured with FastAPI's `CORSMiddleware` so the frontend and backend can run on different ports without cross-origin errors.
- **Interactive Documentation**: Instant Swagger UI available at `/docs` provided by FastAPI.

---

## 🛠️ Prerequisites

Before you start, make sure you have installed:
- **Python 3.8+** (check with `python3 --version` or `python --version`)
- **pip** (Python package installer, check with `pip3 --version` or `pip --version`)
- Any modern web browser (Chrome, Edge, Firefox, Safari)

---

## ⚙️ Step 1: Install & Run the Backend

1. **Open a terminal** and navigate to the project's `backend` folder:
   ```bash
   cd backend
   ```

2. *(Optional but Recommended)* Create and activate a Python virtual environment:
   - On **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - On **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI backend server**:
   ```bash
   uvicorn main:app --reload
   ```

5. The server will start at:
   - **Base API URL**: `http://127.0.0.1:8000`
   - **Interactive API Documentation (Swagger UI)**: `http://127.0.0.1:8000/docs`

> [!TIP]
> The `--reload` flag automatically refreshes the server whenever you edit `main.py`. Keep this terminal window open while using the application.

---

## 💻 Step 2: Run the Frontend Locally

Open a **new, separate terminal** tab or window and navigate to the `frontend` folder:

```bash
cd frontend
```

You can run the frontend in any of the following simple ways:

### Option A: Using Python's built-in HTTP server (Recommended)
Run:
```bash
python3 -m http.server 3000
```
Then open your browser and go to:
👉 **[http://127.0.0.1:3000](http://127.0.0.1:3000)**

### Option B: Using VS Code Live Server
If you use VS Code, right-click on `index.html` and click **"Open with Live Server"**.

### Option C: Direct File Opening
You can simply double-click `frontend/index.html` to open it in your web browser. (Note: Running via an HTTP server like Option A is recommended for realistic web development).

---

## 🔄 How Frontend & Backend Communicate

Here is how data flows between the user, the browser, and the Python server:

```
+------------------------------------+           HTTP Network Requests            +------------------------------------+
|         Frontend (Browser)         |  ======================================>   |          Backend (FastAPI)         |
|  (index.html, style.css, script.js)|                                            |              (main.py)             |
|                                    |  <======================================   |                                    |
|   1. User clicks "Load Events"     |  GET http://127.0.0.1:8000/api/events      |   Returns list of events as JSON   |
|   2. User submits registration     |  POST http://127.0.0.1:8000/api/register   |   Validates & stores registration  |
+------------------------------------+                                            +------------------------------------+
```

### 1. Loading Events (`GET /api/events`)
- In `frontend/script.js`, when you click the **Load Events** button, it executes:
  ```javascript
  const response = await fetch('http://127.0.0.1:8000/api/events');
  const data = await response.json();
  ```
- The backend handles this in `main.py` with `@app.get("/api/events")` and responds with a JSON array containing event objects (title, date, location, description).
- The JavaScript loops over the events and generates HTML cards inserted directly into the page.

### 2. Registering a Student (`POST /api/register`)
- When the user fills out their name and email and clicks **Register Now**, `script.js` intercepts the form submission:
  ```javascript
  const response = await fetch('http://127.0.0.1:8000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Alex Chen", email: "alex@example.com" })
  });
  ```
- The backend validates the request using a Pydantic `RegistrationRequest` model:
  ```python
  class RegistrationRequest(BaseModel):
      name: str
      email: str
  ```
- If valid, the backend appends the record to its in-memory list and returns a success response (`200 OK`).
- The frontend shows a confirmation alert on the screen and resets the form.

### 3. Cross-Origin Resource Sharing (CORS)
- Because the frontend runs on port `3000` (or file system) and the backend runs on port `8000`, the browser treats them as different "origins".
- By default, modern browsers block cross-origin requests for security reasons.
- To allow our frontend to talk to the backend, `main.py` includes `CORSMiddleware`:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
  This tells the browser: *"It's safe to let web pages communicate with this API."*

---

## 🧪 Testing the API Endpoints Directly

You can also test the backend without the frontend using curl:

1. **Test GET /api/events**:
   ```bash
   curl http://127.0.0.1:8000/api/events
   ```

2. **Test POST /api/register**:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Sarah Connor", "email": "sarah@university.edu"}'
   ```

3. **Explore via Swagger UI**:
   Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser to interactively test endpoints.
