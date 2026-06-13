# 🛒 Basketly

### The Choice of Smart Shoppers

Basketly is a full-stack grocery price comparison application. The platform helps Australian shoppers compare grocery prices across major supermarkets, build shopping baskets, identify the cheapest store, and track potential savings before purchasing.

---

## 🌟 Project Overview

Consumers often need to visit multiple supermarket websites to compare prices and determine where they can save money. Basketly simplifies this process by providing a single platform that aggregates grocery pricing information and recommends the most cost-effective shopping option.

### Key Objectives

* Compare grocery prices across supermarkets
* Help users build and manage shopping baskets
* Calculate basket totals automatically
* Recommend the cheapest store
* Save basket history for future reference
* Demonstrate a full-stack cloud-based application

---

## 🚀 Features

### Product Price Comparison

Users can browse and compare grocery prices across multiple supermarkets.

### Smart Basket Builder

Users can:
* Add products to a basket
* Adjust quantities
* Remove products
* View basket totals

### Cheapest Store Recommendation
Basketly automatically calculates:

* Total cost by store
* Cheapest supermarket option
* Estimated savings

### Basket History

Users can save baskets and retrieve previous calculations from the database.

### Responsive User Interface

The application is designed to work across desktop and mobile devices.

---

## 🏗️ System Architecture

```text
React + Vite Frontend
          │
          ▼
Python FastAPI Backend
          │
          ▼
Supabase Database
          │
          ▼
Vercel Cloud Deployment
```

---

## 💻 Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Python
* FastAPI

### Database

* Supabase 

### Version Control & Deployment

* GitHub
* Vercel

---

## 📂 Repository Structure

```text
Basketly
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── services/
│
├── .gitignore
├── README.md
├── vercel.json
└── BACKEND_SETUP.md
```

---

## 🔒 Security Considerations

Sensitive credentials are protected using environment variables and are not committed to GitHub.

Examples include:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
VITE_API_URL=
```

The `.gitignore` file excludes:

* Environment files
* Virtual environments
* Node modules
* Build artefacts
* Log files

---

## ☁️ Deployment

The application is deployed using:

* GitHub Repository
* Vercel Cloud Hosting
* Supabase Database Services

### Live Application

https://basketly-lovat.vercel.app

---

## 📈 Development Workflow

This project follows a modern version control workflow:

1. Develop features locally
2. Commit changes using Git
3. Push changes to GitHub
4. Automatic deployment via Vercel
5. Production testing and validation

---

## ⚙️ Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd basketly
```

### 2. Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## ☁️ Deployment

The application is deployed using:

* GitHub Repository
* Vercel Cloud Hosting
* Supabase Database Services

### Live Application

https://basketly-lovat.vercel.app

---

## 📈 Development Workflow

This project follows a modern version control workflow:

1. Develop features locally
2. Commit changes using Git
3. Push changes to GitHub
4. Automatic deployment via Vercel
5. Production testing and validation

---


La Trobe University
