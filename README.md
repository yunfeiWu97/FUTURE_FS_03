# URL Shortener

## Overview

This is a simple URL shortener application that allows everybody to convert long URLs into compact links. It also tracks the number of clicks each shortened URL receives.

## Common Use Cases

1️⃣ Easier Sharing: Short links make it easier to share long URLs on social media, SMS, and emails, where space is limited.

2️⃣ Tracking Clicks: Useful for marketing campaigns and surveys to monitor engagement and analyze performance.

3️⃣ Simplifying URLs: Helps replace long, messy URLs with a clean and readable format.

4️⃣ Professional Use: Looks better on resumes, presentations, posters, and QR codes, making links more accessible.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: In-memory object storage (can be extended to MongoDB)
  
## Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/yunfeiWu97/FUTURE_FS_03.git
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the server

```sh
cd backend
node server.js
```

The server will start on `http://localhost:3000`.

## API Endpoints

- **POST /shorten** → Shortens a given long URL.
- **GET /clicks/:shortCode** → Returns the number of clicks for a given short URL.
- **GET /:shortCode** → Redirects a short URL to its original long URL.

## Author

**Yunfei Wu 02-14-2025**
