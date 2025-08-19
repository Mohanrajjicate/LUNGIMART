# LungiMart.in Backend

This is a mock backend server for the LungiMart.in e-commerce application. It uses Node.js and Express to serve a RESTful API.

## Overview

This backend is designed for development and demonstration purposes. It does **not** connect to a real database. Instead, it loads all data from the JSON files located in the `/data` directory into memory upon starting.

Any changes made via the API (like creating an order or updating a product) will only affect the in-memory data and will be lost when the server restarts.

## Running the Server

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    This command uses `nodemon` to automatically restart the server when you make changes.
    ```sh
    npm run dev
    ```

The server will be running at `http://localhost:3001`.

## API Structure

The API endpoints are defined in the `/api` directory. The main data logic is handled by `/data/db.js`, which acts as a mock database service.
