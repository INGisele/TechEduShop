# Postman API Testing Guide

This guide covers how to test APIs using Postman, starting with a public API (immediate practice) and then how to set up and test your local `contactus-backend` project.

## Option 1: Test a Public API (Instant Practice)
If you just want to learn Postman right now without setting up code:

**URL**: `https://jsonplaceholder.typicode.com/posts`
**Method**: `GET` or `POST`

### Steps to Test from Scratch:
1.  **Open Postman**.
2.  Click the **+** button to open a new tab.
3.  **GET Request (Fetch Data)**:
    -   Set the method to **GET** (default).
    -   Enter URL: `https://jsonplaceholder.typicode.com/posts`
    -   Click **Send**.
    -   **Result**: You should see a list of posts in the JSON response below.

4.  **POST Request (Send Data)**:
    -   Open a new tab (+).
    -   Set method to **POST**.
    -   Enter URL: `https://jsonplaceholder.typicode.com/posts`
    -   Go to the **Body** tab -> Select **raw** -> Select **JSON** (from the text dropdown).
    -   Enter this JSON:
        ```json
        {
          "title": "My New Post",
          "body": "This is a test content",
          "userId": 1
        }
        ```
    -   Click **Send**.
    -   **Result**: You should see the created post with a new `id` (e.g., `101`).

---

## Option 2: Test Your Local API (`contactus-backend`)
To test the code in your current `techedushop-backend` folder, you need to set up the environment first.

### Prerequisites
1.  **Install Node.js**: Your system currently does not have Node.js installed.
    -   Download and install it from [nodejs.org](https://nodejs.org/).
    -   After installing, restart your terminal/VS Code.
    -   Verify by running `node -v` in the terminal.

### Setup Steps
1.  **Install Dependencies**:
    Open your terminal in `c:\Users\Gisele\Documents\TechEduShop4RoboCoders\techedushop-backend\contactus-backend` and run:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm run dev
    ```
    You should see: `Server running in development mode on port 5000`.

### Testing in Postman
**URL**: `http://localhost:5000/api/v1/contacts`

1.  **POST Request (Submit Contact Form)**:
    -   Method: **POST**
    -   URL: `http://localhost:5000/api/v1/contacts`
    -   Body -> raw -> JSON:
        ```json
        {
          "name": "Test User",
          "school": "Test School",
          "email": "test@school.com",
          "message": "Hello, this is a test message to the local API."
        }
        ```
    -   Click **Send**.
    -   **Result**: Should return `success` status and the saved contact data.

2.  **GET Request (List Contacts)**:
    -   Method: **GET**
    -   URL: `http://localhost:5000/api/v1/contacts`
    -   Click **Send**.
    -   **Result**: List of all submitted contacts.

### Using the Collection
Since you already have `postman-collection.json` in your folder:
1.  Open Postman.
2.  Click **Import** (top left).
3.  Drag and drop your `postman-collection.json` file into Postman.
4.  This will import a "TechEduShop Contact API" collection with pre-configured requests.
