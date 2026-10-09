# Student Campus Hub (IIIT Naya Raipur) - Full-Stack Application

A comprehensive, production-ready web portal tailored for **IIIT-NR (International Institute of Information Technology, Naya Raipur)** students and administration. Built with an **Express & SQLite Relational Backend** and a modern, responsive frontend with offline resilience.

---

## 🏛️ System Architecture

```
c:\Users\Raju\OneDrive\Desktop\it\
├── backend/
│   ├── config/
│   │   └── database.js        # SQLite3 connection, schemas & automated seed
│   ├── database/
│   │   └── campus_hub.sqlite  # Physical binary SQLite database on disk
│   ├── middleware/
│   │   └── auth.js            # Bearer token verification & requireAdmin guards
│   ├── routes/
│   │   ├── auth.js            # Login, registration & student directory
│   │   ├── timetable.js       # B.Tech Section-1 schedule (Admin-only editing)
│   │   ├── resources.js       # Verified study packages (Admin-only CRUD)
│   │   ├── assignments.js     # Assignments & relational student checklists
│   │   ├── announcements.js   # Official circulars (Admin-only publishing)
│   │   ├── events.js          # Campus events & student registrations
│   │   ├── profile.js         # Student/Admin profile management
│   │   └── upload.js          # Physical disk uploads for gallery photos
│   ├── uploads/               # Disk storage for uploaded student avatars
│   ├── scripts/
│   │   └── test-e2e.js        # Automated 12-suite API test runner
│   ├── server.js              # Express 5 server & Interactive API Explorer
│   └── package.json           # Backend dependencies (express, sqlite3, cors)
├── run.bat                    # One-click Windows launcher (starts server & opens browser)
├── run-backend.bat            # Launcher alias
├── package.json               # Root npm scripts (npm start, npm test)
├── index.html                 # UI markup + live "SQLite Backend Connected" pill
├── app.js                     # Full-stack API client (REST API + offline fallback)
├── style.css                  # Custom styling & slot badge palettes
└── assets/                    # Illustrations & vector media
```

---

## 💾 Relational Database Tables (`campus_hub.sqlite`)

The SQLite database enforces relational integrity and constraints across **9 tables**:

1. **`users`**: Enrolled students & administrators (`id`, `roll`, `name`, `email`, `password_hash`, `role`, `branch`, `year`, `semester`, `cgpa`, `avatar`, `batch`).
2. **`sessions`**: Cryptographic session tokens (`token`, `user_id`, `role`, `expires_at`).
3. **`timetable`**: Section-1 9-slot schedule (`day`, `time_slot`, `subject`, `room`, `slot_type`, `updated_at`).
4. **`resources`**: Study materials & drives (`id`, `subject`, `title`, `type`, `semester`, `link`, `description`, `contributor`).
5. **`assignments`**: Academic assignments (`id`, `subject`, `title`, `due_date`, `faculty`, `is_broadcast`).
6. **`assignment_completions`**: Student personal completion tracking (`assignment_id`, `student_roll`, `completed_at`).
7. **`announcements`**: Official notices (`id`, `title`, `body`, `category`, `urgent`, `author`, `date_str`).
8. **`events`**: Campus events (`id`, `title`, `date_str`, `venue`, `category`, `description`, `badge_color`, `banner`, `created_by`).
9. **`event_registrations`**: Student event registrations (`event_id`, `student_roll`, `registered_at`).

---

## 📸 Role-Based Permissions

All core operations are guarded by strict role-based checks on both the backend API and frontend UI:

1. **Study Resources (Admin Only)**:
   - Only administrators can upload or delete course materials. Students have access to search, filter, and open drive links.
2. **Weekly Timetable (Admin Only - Room 203 Section-1)**:
   - Official schedule matching Room 203 w.e.f. 24/08/2026. Only Admin can edit slots or reset to defaults.
3. **Assignments (Admin Only Creation)**:
   - Instructors/Admin broadcast assignments to all students. Students toggle their personal completion checkbox.
4. **Announcements & Campus Events (Admin Only)**:
   - Official circulars and campus events are published by administrators. Students register for events.
5. **Gallery Photo Uploads**:
   - Photos are selected directly from the device/phone gallery and saved as physical image files in `/uploads` on the server.

---

## 🔑 Default Credentials

| Role | Identifier / Roll No | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@iiitnr.ac.in` *(or `admin`)* | `admin123` | **Full Administrative Control** (Timetable, Resources, Assignments, Announcements, Events) |
| **Student** | `24DSAI001` *(or `sahil@iiitnr.ac.in`)* | `student123` | **Student Portal** (View timetable, resources, track assignments, register for events, update profile) |

*New students can also register accounts directly via the **"+ Register Here"** modal.*

---

## 🚀 How to Run the Application

### Option 1: One-Click Launcher (Recommended)
Double-click [run.bat](file:///c:/Users/Raju/OneDrive/Desktop/it/run.bat) (or [run-backend.bat](file:///c:/Users/Raju/OneDrive/Desktop/it/run-backend.bat)).  
*This starts the SQLite backend server and automatically opens **http://localhost:5000** in your default browser!*

### Option 2: Terminal / PowerShell
```powershell
# From project root:
npm start

# Or run the automated 12-suite test verification:
npm test
```

### Option 3: Browser Endpoints
* **Web Application:** [http://localhost:5000](http://localhost:5000) *(Top bar will show `🟢 SQLite Backend Connected`)*
* **Interactive API Explorer & Live Docs:** [http://localhost:5000/api](http://localhost:5000/api) *(Interactive buttons with live SQLite responses)*

### Option 4: Standalone Offline Mode
* Double-click [index.html](file:///c:/Users/Raju/OneDrive/Desktop/it/index.html). The app seamlessly falls back to `localStorage` when the backend server is not running (`🟠 Local Mode (Offline)`).

---

## 📡 REST API Reference

All endpoints are hosted at `http://localhost:5000/api`:

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns server uptime & SQLite stats |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns Bearer token |
| `POST` | `/api/auth/register` | Public | Creates student in SQLite `users` table |
| `GET` | `/api/auth/students` | Public | Returns enrolled student directory |
| `GET` | `/api/timetable` | Public | Gets 5-day Section-1 schedule (Room 203) |
| `POST` | `/api/timetable/slot` | **Admin Only** | Modifies specific timetable slot |
| `POST` | `/api/timetable/reset`| **Admin Only** | Resets timetable to official schedule |
| `GET` | `/api/resources` | Public | Retrieves all study resources |
| `POST` | `/api/resources` | **Admin Only** | Adds course notes/PYQs |
| `DELETE`| `/api/resources/:id` | **Admin Only** | Deletes study resource |
| `GET` | `/api/assignments` | Public | Retrieves assignments with completion lists |
| `POST` | `/api/assignments` | **Admin Only** | Broadcasts assignment to students |
| `DELETE`| `/api/assignments/:id`| **Admin Only** | Deletes assignment |
| `POST` | `/api/assignments/:id/toggle-completion` | Student | Toggles personal completion in `assignment_completions` |
| `GET` | `/api/announcements` | Public | Returns official campus circulars |
| `POST` | `/api/announcements` | **Admin Only** | Publishes announcement |
| `DELETE`| `/api/announcements/:id`| **Admin Only** | Removes announcement |
| `GET` | `/api/events` | Public | Returns events and student registration status |
| `POST` | `/api/events` | **Admin Only** | Publishes campus event |
| `DELETE`| `/api/events/:id` | **Admin Only** | Removes campus event |
| `POST` | `/api/events/:id/toggle-register` | Student | Toggles event registration in `event_registrations` |
| `PUT` | `/api/profile/:id` | Student/Admin | Updates student profile & avatar |
| `POST` | `/api/upload/avatar` | Public | Saves gallery image physically to `/uploads` disk storage |
