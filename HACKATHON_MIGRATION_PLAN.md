# 🎯 Hackathon 2k26 - BCA Dept: Quiz Application Migration Plan

This plan outlines the necessary transformations to convert the current **Pattern Matching IDE** into a **Multi-Level Coding Quiz Application** for UG and PG students.

---

## 🎨 1. Frontend Changes (UI/UX & User Flow)

The UI will retain its "Cyberpunk" hacker aesthetic but with a major flow overhaul.

### A. New User Journey
1.  **Landing Page**: "Hackathon 2k26" branding will be centered and highlighted with neon glow effects.
2.  **Category Selection (NEW)**: After clicking "Start System", a new screen will show two large cards: **[UG - Undergraduate]** and **[PG - Postgraduate]**.
3.  **Simplified Login**: The Login Modal will now only ask for **Roll Number** (e.g., 23uca239). Automatic case-insensitivity handling (lowercase normalization).

### B. IDE & Workspace Updates
-   **Highlighted Selector**: The Language Dropdown (C/Java) will have a pulsing glow or highlighted border to ensure users select it first.
-   **Lock Mechanism**: The **START** button only appears/activates after a language is chosen. 
-   **2-Hour Master Timer**: 
    -   Starts exactly when "Start" is clicked.
    -   Global lockout after 120 minutes: Editor becomes read-only and a "Session Completed" overlay appears.
-   **Dynamic Instruction Panel (Right Side)**:
    -   **Level 1**: Display Problem Statement (e.g., "Write a Java program to calculate the sum of natural numbers") + Expected Output format (e.g., `Sum = 1275`).
    -   **Level 2**: Reverts to Pattern Visualization (matching the existing logic).
    -   **Levels 3 & 4**: Placeholder for advanced logic/complex patterns.

### C. Branding
-   Header update: **"BCA DEPT - HACKATHON 2K26"**.
-   Score display in Navbar: **Score: X / 100** (25 points per level).

---

## ⚙️ 2. Backend Changes (Logic & Data)

### A. Database Schema Updates (`TiDB`)
-   **`users` table**:
    -   Add `category` (ENUM: 'UG', 'PG').
    -   Add `score` (INT, default 0).
    -   Ensure `lot_number` handles the Roll Number format.
-   **`challenges` table (formerly `patterns`)**:
    -   Add `category` (UG/PG): To serve different questions to different groups.
    -   Add `challenge_type`: (ENUM: 'logic', 'pattern').
    -   Add `description`: Text field for the problem statement.

### B. API Refactoring
-   **`POST /api/login`**: Modify to accept `category` and `rollNumber`.
-   **`POST /api/execute`**: 
    -   Update the validation logic. 
    -   **Logic Levels**: Match the `stdout` against a specific string (e.g., `Sum = 1275`).
    -   **Pattern Levels**: Retain existing whitespace-normalized matching.
-   **`POST /api/finish`**: Auto-calculate score based on `patterns_completed * 25`.

---

## 🚀 3. Production & Deployment

### A. Environment Configuration
-   **New Repository**: Since `.git` was removed, initialize a new clean repo for the Quiz version.
-   **Vite/Netlify**: Update `VITE_APP_TITLE` and metadata to reflect "Hackathon 2k26 Quiz".

### B. Admin Level Management
-   **Question Seeding**: A script to pre-load Level 1 (Logic) and Level 2 (Patterns) for both UG and PG categories.
-   **Leaderboard Filters**: Admin Panel should allow filtering the leaderboard by **UG** or **PG** to declare separate winners.

### C. Security Hardening
-   Verify JDoodle API rotation is active for all 22 keys to handle the high-load during the live event.
-   Tighten focus-loss detection to prevent tab-switching for quiz answers.

---

## 📋 Implementation Phases
1.  **Phase 1**: DB Schema migration and Backend API updates for Category support.
2.  **Phase 2**: Frontend UI overhaul (UG/PG cards) and Roll No login.
3.  **Phase 4**: Dynamic Problem Statement rendering for Level 1 logic.
4.  **Phase 4**: Production test run with simulated UG/PG logins.
