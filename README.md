# 📸 DSM Test Frontend

This is the frontend application for the DSM Test project. It allows users to view albums and photos, and also add new photos to albums. The app is built using **React**, **Redux**, **TypeScript**, and **Vite**.

## Getting Started

Follow the steps below to run and develop the application locally.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/giovannibrancoDTI/DSM-Test-Frontend.git

```

2. Install dependencies:

```bash
npm install
# or
yarn

```

## Environment Variables

Create a .env file in the root, with this content:

```env
# Base API URL for the backend
VITE_API_URL=http://localhost:8080/api

# Default user ID for testing purposes
<!-- This environment variable `VITE_USER_ID` is used to set the user ID for testing purposes.
  You can modify this value to test with other user IDs as needed. -->
VITE_USER_ID=1
```

## Running the Application

```bash

npm run dev
# or
yarn dev

```

## Running Tests

```bash
npm run test
# or
yarn test

```
