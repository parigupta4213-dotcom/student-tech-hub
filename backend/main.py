from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize the FastAPI app
app = FastAPI(
    title="Student Tech Hub API",
    description="A beginner-friendly API providing tech events and registration.",
    version="1.0.0"
)

# ---------------------------------------------------------
# CORS (Cross-Origin Resource Sharing) Configuration
# ---------------------------------------------------------
# This allows the frontend (running on a different port or origin)
# to make requests to this backend without browser security blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ---------------------------------------------------------
# In-Memory Sample Data
# ---------------------------------------------------------
# In a full-production app, this would come from a database.
# Here, we keep it simple with an in-memory list.
EVENTS = [
    {
        "id": 1,
        "title": "Intro to Web Development Workshop",
        "category": "Workshop",
        "date": "October 15, 2026",
        "time": "5:00 PM - 7:00 PM",
        "location": "Auditorium A & Virtual",
        "description": "Learn the essentials of HTML, CSS, and modern JavaScript by building your first interactive website."
    },
    {
        "id": 2,
        "title": "Campus AI & Machine Learning Hackathon",
        "category": "Hackathon",
        "date": "October 24 - 25, 2026",
        "time": "9:00 AM (48-hour event)",
        "location": "Tech Innovation Lab",
        "description": "Collaborate in teams to create innovative AI-powered applications. Beginners and mentors welcome!"
    },
    {
        "id": 3,
        "title": "Open Source & Git Mastery",
        "category": "Hands-on Lab",
        "date": "November 5, 2026",
        "time": "4:00 PM - 6:00 PM",
        "location": "Computer Lab 302",
        "description": "Understand Git branching, pull requests, and how to start making meaningful open source contributions on GitHub."
    },
    {
        "id": 4,
        "title": "Tech Career & Internship Q&A Panel",
        "category": "Panel Discussion",
        "date": "November 18, 2026",
        "time": "6:00 PM - 8:00 PM",
        "location": "Student Center Hall",
        "description": "Hear directly from industry software engineers, alumni, and recruiters about landing your first tech role."
    }
]

# In-memory list to store student registrations
registrations = []


# ---------------------------------------------------------
# Request Body Schema using Pydantic
# ---------------------------------------------------------
class RegistrationRequest(BaseModel):
    name: str
    email: str


# ---------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------

@app.get("/")
def read_root():
    """Root endpoint welcoming visitors and linking to interactive docs."""
    return {
        "message": "Welcome to the Student Tech Hub API!",
        "docs_url": "/docs",
        "endpoints": {
            "events": "/api/events",
            "register": "/api/register"
        }
    }


@app.get("/api/events")
def get_events():
    """
    GET /api/events
    Returns a list of upcoming technical events as JSON.
    """
    return {
        "success": True,
        "count": len(EVENTS),
        "events": EVENTS
    }


@app.post("/api/register")
def register_student(payload: RegistrationRequest):
    """
    POST /api/register
    Accepts student registration with name and email, validates basic input,
    and saves it to the in-memory list.
    """
    name = payload.name.strip()
    email = payload.email.strip()

    # Basic validation
    if not name or not email:
        raise HTTPException(
            status_code=400,
            detail="Both name and email are required."
        )

    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid email address."
        )

    # Store registration
    new_entry = {
        "id": len(registrations) + 1,
        "name": name,
        "email": email
    }
    registrations.append(new_entry)

    return {
        "success": True,
        "message": f"Welcome to Student Tech Hub, {name}! You have been successfully registered.",
        "student": new_entry
    }
