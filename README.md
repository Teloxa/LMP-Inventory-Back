# LMP Inventory Backend

Overview
This is an Express.js REST API for the LMP Inventory system. It uses Firebase Admin SDK
for data access and exposes routes under the /api prefix.

Requirements
- Node.js 18+ (recommended)
- npm 9+
- Firebase service account file: ServiceAccountKey.json in the project root

Installation
1. Clone the repository.
2. Install dependencies:
	npm install
3. Create a .env file (optional). You can set the port:
	PORT=3000
4. Place your Firebase service account at:
	ServiceAccountKey.json

Run
- Development (nodemon):
  npm run dev
- Production:
  npm start

The server will start on:
http://localhost:3000 (or the PORT you set)

Base URL
All routes are prefixed with /api.

Routes
Health
- GET /api/ => Basic health response

Users
- POST /api/user/add
- POST /api/user/login
- GET /api/user/list (auth required)
- GET /api/user/getbyId/:id (auth required)
- PUT /api/user/update/:id (supports multipart form-data with profileImage)
- DELETE /api/user/delete/:id (auth required)

Products
- POST /api/products/
- GET /api/products/
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id

Providers
- POST /api/providers/add
- GET /api/providers/list
- GET /api/providers/getbyId/:id
- PUT /api/providers/update/:id
- DELETE /api/providers/delete/:id

Shops
- POST /api/shops/add
- GET /api/shops/list
- GET /api/shops/getbyId/:id
- PUT /api/shops/update/:id
- DELETE /api/shops/delete/:id

Orders
- POST /api/orders/add
- GET /api/orders/list
- GET /api/orders/getbyid/:id
- PUT /api/orders/update/:id
- DELETE /api/orders/delete/:id
