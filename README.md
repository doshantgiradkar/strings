# STRINGS - A Digital Art Gallery

## Project Description
"STRINGS – A Digital Art Gallery" is an innovative web application designed to provide a platform for artists to connect, collaborate, and share their artwork with a global audience. It aims to create an engaging and immersive digital space where artists can curate their own virtual galleries, upload their masterpieces, and present their creative process. By fostering a community of like-minded individuals, Strings encourages artistic exploration, constructive feedback, and the celebration of diverse artistic styles.

## Features

### Core Functionality
*   **Artist Profiles and Artwork Sharing:** Users can create personalized profiles and seamlessly upload their artwork, showcasing unique styles and techniques.
*   **Artist Connectivity:** Fosters a vibrant community where artists can connect, follow each other's work, and engage in meaningful discussions.
*   **Art Discovery and Appreciation:** Enables users to discover and appreciate artwork from artists worldwide, promoting global artistic exploration.
*   **Community Engagement:** Encourages interactions, likes, and dislikes among artists, nurturing a thriving creative ecosystem.

### Modules
1.  **Login and Registration Module:**
    *   Provides forms for user registration and authentication.
    *   Implements secure password hashing (SHA256) and user session management.
    *   Validates unique usernames and email IDs during registration.
2.  **Upload Module:**
    *   Allows authenticated users to upload their artwork.
    *   Implements file validation and secure storage mechanisms.
3.  **Like and Dislike Module:**
    *   Enables users to express appreciation or dislike for artwork.
    *   Updates the `Actions` table with user interactions.
4.  **Delete Module:**
    *   Allows users to delete their own uploaded artwork.
    *   Provides administrative privileges to delete inappropriate content.
5.  **Content Module:**
    *   Retrieves and displays artwork from the database.
    *   Implements pagination and filtering mechanisms for efficient content navigation.

## Technologies Used

### Frontend
*   HTML
*   CSS
*   JavaScript
*   EJS (Embedded JavaScript) for templating
*   Bootstrap (for responsive design and UI components)
*   HTMX (for dynamic content updates)

### Backend
*   Node.js
*   Express.js (web framework)
*   `dotenv` (for environment variables)
*   `cors` (for Cross-Origin Resource Sharing)
*   `express-ejs-layouts` (for EJS layouts)
*   `body-parser` (middleware to parse request bodies)
*   `express-session` (middleware for session management)
*   `express-flash` (middleware to store flash messages)
*   `passport` & `passport-local` (for authentication)
*   `multer` (for handling `multipart/form-data`, primarily file uploads)
*   `crypto-js` (for SHA256 hashing)

### Database
*   PostgreSQL
*   `oracledb` (listed in `package.json` but `pg` is used in `db.js`)
*   `pg` (PostgreSQL client for Node.js)

## Setup and Installation

### Prerequisites
*   Node.js (v14 or higher recommended)
*   npm or Yarn
*   PostgreSQL database

### Steps
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd strings
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `.env.example`.
    ```
    PORT=4000
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=strings
    ```
    *Replace `your_db_user`, `your_db_password`, `localhost`, and `5432` with your PostgreSQL database credentials.*

4.  **Set up the database:**
    *   Connect to your PostgreSQL server.
    *   Create the database and tables using the `database.sql` script:
        ```sql
        CREATE DATABASE strings;
        \c strings; -- Connect to the new database
        CREATE TABLE users(
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(32) NOT NULL UNIQUE,
            email_id VARCHAR(64) NOT NULL,
            pass_hash VARCHAR(255) NOT NULL,
            is_adm BOOLEAN NOT NULL,
            UNIQUE (email_id, username)
        );

        CREATE TABLE content (
            user_id INT NOT NULL,
            content_id BIGSERIAL PRIMARY KEY NOT NULL,
            title VARCHAR(125) NOT NULL,
            img VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );

        CREATE TABLE actions (
            user_id INT NOT NULL,
            content_id INT NOT NULL,
            _like BOOLEAN,
            _dislike BOOLEAN,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
        );
        ```

## Usage

### Start the server
```bash
npm start
# or for development with nodemon
npm run dev
```
The application will be accessible at `http://localhost:4000` (or the port specified in your `.env` file).

## Database Schema

### `users` Table
| Field      | Type         | Description                               |
| :--------- | :----------- | :---------------------------------------- |
| `user_id`  | `SERIAL`     | Primary Key, Auto-incrementing            |
| `username` | `VARCHAR(32)`| Unique username                           |
| `email_id` | `VARCHAR(64)`| Unique email address                      |
| `pass_hash`| `VARCHAR(255)`| SHA256 hashed password                    |
| `is_adm`   | `BOOLEAN`    | Admin status (true/false)                 |

### `content` Table
| Field        | Type         | Description                               |
| :----------- | :----------- | :---------------------------------------- |
| `content_id` | `BIGSERIAL`  | Primary Key, Auto-incrementing            |
| `user_id`    | `INT`        | Foreign Key referencing `users.user_id`   |
| `title`      | `VARCHAR(125)`| Title of the artwork                      |
| `img`        | `VARCHAR(255)`| File path/name of the image               |

### `actions` Table
| Field        | Type      | Description                               |
| :----------- | :-------- | :---------------------------------------- |
| `user_id`    | `INT`     | Foreign Key referencing `users.user_id`   |
| `content_id` | `INT`     | Foreign Key referencing `content.content_id`|
| `_like`      | `BOOLEAN` | True if liked, false otherwise            |
| `_dislike`   | `BOOLEAN` | True if disliked, false otherwise         |

## Contributing
Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License
This project is licensed under the ISC License.
