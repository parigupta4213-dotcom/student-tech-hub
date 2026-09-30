/**
 * ===================================================================
 * Student Tech Hub - Frontend Logic (script.js)
 * ===================================================================
 * This script handles:
 * 1. Checking the backend connection status.
 * 2. Fetching and rendering events from GET /api/events.
 * 3. Submitting the student registration form via POST /api/register.
 *
 * Designed with beginner-friendly plain JavaScript (Vanilla JS).
 */

// Configuration: Base URL where the FastAPI backend is running
const API_BASE_URL = 'http://127.0.0.1:8000';

// DOM Element References
const loadEventsBtn = document.getElementById('loadEventsBtn');
const btnText = document.getElementById('btnText');
const eventsContainer = document.getElementById('eventsContainer');
const registrationForm = document.getElementById('registrationForm');
const formAlert = document.getElementById('formAlert');
const studentNameInput = document.getElementById('studentName');
const studentEmailInput = document.getElementById('studentEmail');
const submitBtn = document.getElementById('submitBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

/**
 * Check if the backend server is reachable on page load.
 */
async function checkBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
    if (response.ok) {
      statusDot.classList.add('connected');
      statusText.innerHTML = `Connected to backend at <code>${API_BASE_URL}</code>`;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    statusDot.classList.add('error');
    statusText.innerHTML = `⚠️ Backend not detected at <code>${API_BASE_URL}</code>. Start FastAPI using <code>uvicorn main:app --reload</code> in the <code>backend/</code> folder.`;
  }
}

/**
 * Fetch upcoming events from the FastAPI backend (GET /api/events)
 * and display them dynamically in the DOM.
 */
async function loadEvents() {
  // Update button state while loading
  btnText.textContent = 'Loading...';
  loadEventsBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Server returned error status: ${response.status}`);
    }

    const data = await response.json();
    const events = data.events || [];

    // Render events or empty message
    if (events.length === 0) {
      eventsContainer.innerHTML = `
        <div class="placeholder-card">
          <div class="placeholder-icon">ℹ️</div>
          <h3>No events found</h3>
          <p>There are currently no events listed in the backend.</p>
        </div>
      `;
      return;
    }

    // Generate HTML for each event card
    eventsContainer.innerHTML = events.map(event => `
      <article class="event-card">
        <div class="event-card-header">
          <h3 class="event-title">${escapeHtml(event.title)}</h3>
          <span class="event-category-badge">${escapeHtml(event.category || 'General')}</span>
        </div>
        
        <div class="event-meta">
          <span class="meta-item">
            <span>📅</span>
            <strong>${escapeHtml(event.date)}</strong>
          </span>
          <span class="meta-item">
            <span>⏰</span>
            <span>${escapeHtml(event.time)}</span>
          </span>
          <span class="meta-item">
            <span>📍</span>
            <span>${escapeHtml(event.location)}</span>
          </span>
        </div>

        <p class="event-desc">${escapeHtml(event.description)}</p>
      </article>
    `).join('');

    // Re-check backend status as connected
    statusDot.className = 'status-indicator connected';
    statusText.innerHTML = `Connected to backend at <code>${API_BASE_URL}</code>`;

  } catch (error) {
    console.error('Error fetching events:', error);
    eventsContainer.innerHTML = `
      <div class="placeholder-card" style="border-color: #fecaca; background-color: #fff5f5;">
        <div class="placeholder-icon">⚠️</div>
        <h3 style="color: #b91c1c;">Could not load events</h3>
        <p style="color: #7f1d1d; margin-bottom: 12px;">
          Make sure your FastAPI backend server is running at <strong>${API_BASE_URL}</strong>.
        </p>
        <p style="font-size: 0.85rem; color: #4b5563;">
          Run in terminal: <code>cd backend &amp;&amp; uvicorn main:app --reload</code>
        </p>
      </div>
    `;
  } finally {
    // Reset button state
    btnText.textContent = 'Refresh Events';
    loadEventsBtn.disabled = false;
  }
}

/**
 * Handle student registration submission (POST /api/register).
 */
async function handleRegistration(e) {
  e.preventDefault();

  const name = studentNameInput.value.trim();
  const email = studentEmailInput.value.trim();

  // Basic client-side validation
  if (!name || !email) {
    showAlert('Please fill in both your name and email.', 'error');
    return;
  }

  // Update submit button during submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Submitting...</span>';
  hideAlert();

  try {
    // Send POST request with JSON payload to FastAPI
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, email: email }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Backend returned 4xx or 5xx error
      const errorMsg = result.detail || result.message || 'Registration failed. Please try again.';
      showAlert(errorMsg, 'error');
      return;
    }

    // Success! Show confirmation and clear form
    showAlert(result.message || `Thanks for registering, ${name}!`, 'success');
    registrationForm.reset();

  } catch (error) {
    console.error('Registration network error:', error);
    showAlert(`Could not connect to backend server at ${API_BASE_URL}. Ensure it is running.`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="btn-icon">✨</span><span>Register Now</span>';
  }
}

/**
 * Helper to display alert notifications in the form.
 */
function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = `alert alert-${type}`;
}

/**
 * Helper to hide the alert notification.
 */
function hideAlert() {
  formAlert.className = 'alert hidden';
  formAlert.textContent = '';
}

/**
 * Helper to prevent XSS by escaping special HTML characters.
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// ---------------------------------------------------------
// Event Listeners & Initialization
// ---------------------------------------------------------

// Click listener for "Load Events" button
loadEventsBtn.addEventListener('click', loadEvents);

// Submit listener for the registration form
registrationForm.addEventListener('submit', handleRegistration);

// Check backend status on page load
checkBackendConnection();
