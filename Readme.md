# FocusLock - Chrome Extension (MVP v1)

## 🎯 Overview
FocusLock is a Chrome Extension designed to help users reduce distraction by blocking access to selected websites and reminding them of their goals.

---

## 🚀 Problem
Users often get distracted by websites like YouTube, TikTok, and social media during work or study sessions.

---

## 💡 Solution
Instead of just blocking access, FocusLock:
- Interrupts distraction
- Reminds users of their goals
- Allows limited override with control

---

## ⚙️ Features (MVP v1)

### 1. Website Blocking Engine
- Detects URL navigation
- Redirects blocked sites to a custom blocking page

### 2. Goal Reminder
- Displays user's main goal and reason
- Reinforces focus intention

### 3. Override System
- Temporary access (time-based)
- Default duration: configurable (testing: 30s, prod: 5 min)

### 4. Daily Limit
- Max 3 overrides per day
- Prevents abuse

### 5. Anti-Bypass Protection
- Handles:
  - Refresh
  - Back button
  - SPA navigation (YouTube, Shorts)
- Uses:
  - webNavigation.onCompleted
  - webNavigation.onHistoryStateUpdated

### 6. Local Storage System
Stored in:
```js
chrome.storage.local