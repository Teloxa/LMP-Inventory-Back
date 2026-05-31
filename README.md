# LMP Inventory Backend

## Overview

This is a robust **Express.js REST API** built for the LMP Inventory system. It leverages the **Firebase Admin SDK** for secure, high-performance data access and exposes all endpoints under the `/api` prefix.

---

## Requirements

Before running the project, ensure you have the following installed and configured:

* **Node.js**: `v18+` (Recommended)
* **npm**: `v9+`
* **Firebase Credentials**: A valid `ServiceAccountKey.json` placed in the project root.

---

## Installation & Setup

Follow these steps to get your development environment up and running:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/lmp-inventory-backend.git](https://github.com/your-username/lmp-inventory-backend.git)
cd lmp-inventory-backend
```

### 2. Install Dependencies
npm install

### 3. Environment Configuration
Create a .env file in the root directory to manage your environment variables: PORT=3000

### 4. Firebase SDK Setup
```bash
📂 lmp-inventory-backend
├── 📂 src
├── 📄 .env
├── 📄 ServiceAccountKey.json  <-- Place it here (Do not commit to Git!)
└── 📄 package.json
```

### 5. Running the aplication
Uses nodemon to watch for file changes: npm run dev
