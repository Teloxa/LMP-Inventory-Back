LMP Inventory Backend

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
