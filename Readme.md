# FocusLock Chrome Extension

FocusLock is a behavior-driven Chrome extension designed to reduce distractions without being overly restrictive. It combines limited access, behavioral tracking, and adaptive friction to help users stay focused.

---

## 🚀 Current Version: MVP 1.5

### 🔥 Core Features

#### 1. Blocking Engine
- Blocks distracting websites (YouTube, etc.)
- Handles SPA navigation (e.g., YouTube routing)

#### 2. Override System
- 3 overrides per day
- Each override grants limited access (30 seconds)
- Tab-scoped override (not global)

#### 3. Streak System
- Tracks daily discipline
- Resets when override limit is exceeded

#### 4. Behavior Detection
- Detects rapid return patterns
- Tracks user impulsive behavior

#### 5. Soft Enforcement
- Adds delay before override based on behavior
- Escalates friction:
  - Normal → no delay
  - Rapid return → delay
  - Abuse → temporary lock

#### 6. Smart Auto-Kick
- Allows passive usage (music/podcast)
- Blocks navigation change (new tab / new video)

#### 7. UX Clarity Improvements
- Clear status display (override left, streak)
- Goal & reason visibility
- State message (focus mode, limit reached, etc.)
- Behavior feedback messaging
- Guide explanation for user understanding

#### 8. Tab Timer (NEW)
- Shows remaining override time directly in browser tab title
- Helps user stay aware without relying on blocking page

---

## 🧠 Product Philosophy

FocusLock is not a strict blocker.

It is a **behavior control system** that:
- allows controlled access
- detects patterns
- adapts responses
- guides users toward better habits

---

## 📁 Project Structure
core/
storage.js
override.js
streak.js
behavior.js

background.js
blocking.js
blocking.html
content.js

---

## 🛠 Tech Stack

- Chrome Extension (Manifest V3)
- Vanilla JavaScript
- Chrome Storage API

---

## 📌 Next Roadmap

- Analytics dashboard
- User-configurable goals
- Sync (SaaS backend)
- AI behavior assistant

---

## ⚠️ Notes

This project is currently in MVP stage and focused on validating user behavior impact before scaling further.