# 🚀 Attention Investment Tracker

> Stop tracking time. Start tracking **attention**.

---

## 🧠 Problem Statement

Traditional productivity tools measure *time spent*, but fail to capture the **quality of attention**. Spending 2 hours studying is not the same as 2 hours scrolling social media.

This project solves that gap by introducing a system to measure **how effectively attention is invested**, not just how long.

---

## 💡 Solution

**Attention Investment Tracker** is a data-driven productivity web application that helps users:

* Track attention sessions
* Measure focus and outcomes
* Calculate **Return on Attention (ROA)**
* Identify high-value vs low-value activities
* Gain actionable behavioral insights

---

## 🎯 Key Features

### 🔐 Authentication

* User Signup & Login
* Protected Routes
* Persistent Sessions

### ⏱️ Attention Session Tracking (CRUD)

* Add, edit, delete sessions
* Track:

  * Activity
  * Duration
  * Focus Level (1–5)
  * Outcome Score (1–5)
  * Category

### 📊 Attention Analytics Dashboard

* Total attention time
* High vs Low ROI activities
* Best & worst performing activities
* Category-wise distribution

### 📈 Return on Attention (ROA)

* Attention Score = Duration × Focus
* ROA = Attention Score × Outcome
* Efficiency tracking

### 🧠 Smart Insights Engine

* Detect attention leaks
* Identify low-focus patterns
* Suggest high-value activities
* Weekly behavioral insights

### 📅 Reports

* Weekly summary
* Productivity trends
* Actionable recommendations

---

## ⚛️ Tech Stack

### Frontend

* React (Functional Components)
* React Router
* Context API
* Tailwind CSS

### Backend

* Firebase Authentication
* Firebase Firestore (Database)

### Tools

* Vite
* ESLint

---

## 🏗️ Project Structure

```
/src
  /components
  /pages
  /context
  /hooks
  /services
  /utils
```

---

## 🧠 Core Logic

### Attention Score

```
Attention Score = Duration × Focus Level
```

### Return on Attention (ROA)

```
ROA = Attention Score × Outcome Score
```

### Efficiency

```
Efficiency = (ROA / Max Possible Score) × 100
```

---

## 🎨 UI/UX Highlights

* Clean, responsive design (mobile + desktop)
* Dashboard with charts and insights
* Loading states and error handling
* Minimal and user-focused interface

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/reak-projects/Attention-investing-tracker.git
cd attention-investment-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

* Create a Firebase project
* Enable Authentication (Email/Password)
* Create Firestore Database
* Add your Firebase config in:

```
src/services/firebase.js
```

### 4. Run the app

```bash
npm run dev
```

---

## 🌐 Deployment

Recommended:

* Vercel
* Netlify

---

## 📦 Future Enhancements

* AI-based insights
* Advanced analytics
* Export reports (PDF)
* Real-time collaboration
* Notifications

---

## ⚖️ Evaluation Criteria Covered

* ✅ React Fundamentals
* ✅ Advanced Hooks
* ✅ Backend Integration
* ✅ CRUD Operations
* ✅ Clean UI/UX
* ✅ Scalable Architecture

---

## 🧑‍💻 Author

Built as part of an end-term project for **Building Web Applications with React**

---

## 🔥 Final Note

This project demonstrates how **attention is a more valuable metric than time** in understanding productivity and behavior.

---
