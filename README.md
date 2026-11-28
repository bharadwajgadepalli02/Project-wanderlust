# RoamHaven 🌍✈️

RoamHaven is a production-grade full-stack web application for discovering, hosting, and managing vacation rentals and unique travel destinations. Built with Node.js, Express, MongoDB, and EJS, it features dynamic search, category filtering, tax calculations, server-side pagination, interactive maps powered by Mapbox, customizable 6-color accent themes, light/dark mode, and user authentication with role-based access control.

---

## 🚀 Key Features

- **Multi-Field Search**: Instant search matching across listing title, location (city), or country via the top navigation bar with regex escaping.
- **Category Filtering**: Airbnb-style responsive icon slider supporting 11 distinct categories (*Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Domes, Boats*).
- **Interactive Tax Toggle**: Dynamic switch to reveal total price inclusive of 18% GST with session memory preservation across navigation.
- **Server-Side Pagination**: Efficient paginated querying (9 listings per page) retaining active search and category filter parameters across pages.
- **Interactive Mapbox Maps**: GeoJSON coordinates integration with forward geocoding via `@mapbox/mapbox-sdk` and interactive Mapbox GL JS map views with custom markers and popups on listing details pages.
- **Reviews & 5-Star Ratings**: Starability CSS 5-star rating selector and reviews feed with cascade deletion when a listing is removed.
- **Full CRUD Listing Management**: Complete create, read, update, and delete functionality for properties with category assignment and image preview.
- **Authentication & Authorization**: User registration, salted hashing, and session management via **Passport.js** and **passport-local-mongoose**, with route protection ensuring only owners can edit/delete listings.
- **Production Session Storage**: Persistent MongoDB session store using **`connect-mongo`** to prevent memory leaks when deployed in cloud environments.
- **Two-Tier Validation**: Client-side validation using Bootstrap 5 and server-side schema verification powered by **Joi**.
- **Centralized Error Architecture**: Custom error handling leveraging `wrapAsync` wrapper and `ExpressError` class.

---

## 🛠️ Tech Stack

- **Backend Runtime**: [Node.js](https://nodejs.org/) (ES Modules, `>=20.0.0`), [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/), [Mongoose 9](https://mongoosejs.com/)
- **Mapping & Geocoding**: [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs), [@mapbox/mapbox-sdk](https://github.com/mapbox/mapbox-sdk-js)
- **Sessions & Cloud Auth**: [connect-mongo](https://github.com/jdesboeufs/connect-mongo), [express-session](https://github.com/expressjs/session), [Passport.js](https://www.passportjs.org/)
- **Validation**: [Joi](https://joi.dev/)
- **Templating & UI**: [EJS](https://ejs.co/), [ejs-mate](https://github.com/JacksonTian/ejs-mate), [Bootstrap 5](https://getbootstrap.com/), [Font Awesome 6](https://fontawesome.com/)
- **Styling**: Custom CSS, Starability Rating CSS

---

## 📁 Project Structure

```text
Project-wanderlust/
├── models/
│   ├── data.js               # Enriched 33-item sample dataset with categories & coordinates
│   ├── listing.js            # Mongoose Schema with category enum & GeoJSON geometry
│   ├── review.js             # Mongoose Schema for reviews
│   └── user.js               # Mongoose Schema for authentication
├── public/
│   ├── css/
│   │   ├── rating.css        # Starability 5-star rating styles
│   │   └── style.css         # Custom layout, search, filters & cards styling
│   └── js/
│       ├── formValidation.js # Client-side Bootstrap validation
│       └── map.js            # Mapbox GL JS map initializer & popup logic
├── routes/
│   ├── listingRoute.js       # Search, category filter, pagination & geocoding CRUD routes
│   ├── reviewRoue.js         # Review creation & deletion routes
│   └── userRoute.js          # Authentication routes (/signup, /login, /logout)
├── utils/
│   ├── ExpressError.js       # Custom error class
│   └── wrapAsync.js          # Asynchronous error handler
├── views/
│   ├── includes/
│   │   ├── flashMessages.ejs # Dismissible Bootstrap flash banners
│   │   ├── footer.ejs        # Reusable footer component
│   │   └── navbar.ejs        # Navigation bar with destination search input
│   ├── layouts/
│   │   └── boilerplate.ejs   # Base layout with Mapbox CDN & CSS assets
│   ├── Listings/
│   │   ├── create.ejs        # Listing creation & edit form with category dropdown
│   │   ├── error.ejs         # Centralized error page
│   │   ├── index.ejs         # Category slider, tax toggle, cards grid & pagination
│   │   └── show.ejs          # Single listing details, reviews & interactive map
│   └── Users/
│       ├── login.ejs         # User login form
│       └── signup.ejs        # User registration form
├── .env                      # Local environment configuration (git-ignored)
├── .gitignore                # Git ignore rules (node_modules, .env, .vscode)
├── app.js                    # Express app initialization, MongoStore session & routing
├── init_db.js                # Standalone database seeder script
├── middleware.js             # Authorization middleware (isLoggedIn, isOwner, validateListing)
├── package.json              # Project dependencies & Node engine definition
├── schema.js                 # Joi validation schemas
└── README.md                 # Project documentation
```

---

## 🌐 RESTful Endpoints

### 🏡 Listings (`/Listings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/Listings` | Public | Paginated listings with search (`?search=`) and category (`?category=`) filters |
| `GET` | `/Listings/new` | Logged In | Render form to create a new listing |
| `POST` | `/Listings` | Logged In | Geocode location, assign owner, and save new listing |
| `GET` | `/Listings/:id` | Public | Render listing detail view with interactive Mapbox map & reviews |
| `GET` | `/Listings/:id/edit` | Owner Only | Render edit form for existing listing |
| `PATCH` | `/Listings/:id` | Owner Only | Update listing details and re-geocode if location changed |
| `DELETE` | `/Listings/:id` | Owner Only | Delete listing and cascade delete associated reviews |

### ⭐ Reviews (`/Listings/:id/reviews`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/Listings/:id/reviews` | Logged In | Submit a new 1-5 star review and comment |
| `DELETE` | `/Listings/:id/reviews/:reviewId` | Author Only | Delete review from listing and database |

### 🔐 Authentication (`/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/signup` | Public | Render user registration page |
| `POST` | `/signup` | Public | Register new user account |
| `GET` | `/login` | Public | Render login page |
| `POST` | `/login` | Public | Authenticate user credentials and create session |
| `GET` | `/logout` | Logged In | Terminate user session |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (`v20.0.0` or higher)
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://cloud.mongodb.com/) cluster

### 1. Installation

```bash
git clone https://github.com/bharadwajgadepalli02/Project-wanderlust.git
cd Project-wanderlust
npm install
```

### 2. Environment Variables Configuration

Configure your `.env` file in the project root:

```env
PORT=8080
ATLASDB_URL=mongodb://127.0.0.1:27017/wanderlust
SECRET=your_session_secret_key
MAP_TOKEN=your_mapbox_public_token
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

### 3. Seed Database

Seed the database with sample listings, category tags, and geographic coordinates:

```bash
node init_db.js
```

### 4. Run Locally

```bash
node app.js
```

Access the application in your browser at `http://localhost:8080/Listings`.

---

## 🚀 Deployment Guide (MongoDB Atlas & Render)

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
4. Click **Connect** -> **Drivers** and copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/wanderlust?retryWrites=true&w=majority`
5. Seed your cloud database once:
   ```bash
   ATLASDB_URL="your-atlas-connection-string" node init_db.js
   ```

### 2. Render Deployment
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **Web Service**.
3. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
4. In the **Environment Variables** section on Render, add:
   - `ATLASDB_URL`: Your MongoDB Atlas connection URI
   - `SECRET`: A secure random secret string
   - `MAP_TOKEN`: Your Mapbox public access token

---

## 👤 Author

**Bharadwaj Gadepalli**
- GitHub: [@bharadwajgadepalli02](https://github.com/bharadwajgadepalli02)
