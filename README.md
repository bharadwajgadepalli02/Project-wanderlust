# Wanderlust 🌍✈️

Wanderlust is a full-stack web application for discovering, creating, and managing vacation rentals and travel destinations—inspired by Airbnb. Built with Node.js, Express, MongoDB, and EJS, it follows a clean Model-View-Controller (MVC) architecture with RESTful routing, robust two-tier validation, session management, user authentication, role-based authorization, and interactive reviews.

---

## 🚀 Features

- **Explore & Manage Listings**: Full CRUD functionality to browse, create, view, edit, and delete vacation rentals with formatted pricing (INR) and location details.
- **Reviews & Ratings System**: Leave star ratings and comments on listings, with automatic cascading deletion when a listing is removed.
- **Authentication & Sessions**: Secure registration and login workflows using **Passport.js** and **passport-local-mongoose** with salted password hashing and persistent login sessions.
- **Role-Based Authorization & Ownership**: Middleware protection ensuring only authenticated users can create listings/reviews, and only the designated listing owner can edit or delete a listing.
- **Flash Notifications**: Real-time dismissible alert banners (`connect-flash` + Bootstrap 5) providing immediate feedback for successful actions, updates, and errors.
- **Two-Tier Validation**: Client-side validation using Bootstrap 5 styles and server-side schema validation powered by **Joi** to ensure data integrity.
- **Centralized Error Handling**: Custom error architecture leveraging `wrapAsync` wrapper and `ExpressError` class with dedicated, user-friendly error views.
- **Modular Architecture**: Express routers organized by resource (`/Listings`, `/Listings/:id/reviews`, and auth routes) using `mergeParams`.
- **Responsive UI & Templating**: Mobile-first responsive layouts styled with Bootstrap 5 and Font Awesome, structured with reusable layouts and partials using `ejs-mate`.

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) (ES Modules), [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- **Authentication & Sessions**: [Passport.js](https://www.passportjs.org/), [passport-local](https://www.passportjs.org/packages/passport-local/), [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose), [express-session](https://github.com/expressjs/session), [connect-flash](https://github.com/jaredhanson/connect-flash)
- **Validation**: [Joi](https://joi.dev/)
- **Templating**: [EJS](https://ejs.co/), [ejs-mate](https://github.com/JacksonTian/ejs-mate)
- **Styling & Assets**: [Bootstrap 5](https://getbootstrap.com/), [Font Awesome](https://fontawesome.com/), Custom CSS, Vanilla JavaScript
- **Utilities**: `method-override` (for PUT/PATCH/DELETE HTTP verb support)

---

## 📁 Project Structure

```text
Project-wanderlust/
├── models/
│   ├── data.js               # Sample/seed listings dataset
│   ├── listing.js            # Mongoose Schema & Model for Listings (with Review references)
│   ├── review.js             # Mongoose Schema & Model for Reviews
│   └── user.js               # Mongoose Schema & Model for Users (Passport-Local-Mongoose)
├── public/
│   ├── css/
│   │   └── style.css         # Custom styles and component overrides
│   └── js/
│       └── formValidation.js # Client-side form validation script
├── routes/
│   ├── listingRoute.js       # Modular Express router for Listings CRUD operations
│   ├── reviewRoue.js         # Modular Express router for Listing Reviews
│   └── userRoute.js          # Modular Express router for Authentication (/signup, /login)
├── utils/
│   ├── ExpressError.js       # Custom Express error class
│   └── wrapAsync.js          # Async error handler wrapper
├── views/
│   ├── includes/
│   │   ├── flashMessages.ejs # Dismissible Bootstrap flash alert banners
│   │   ├── footer.ejs        # Reusable footer component
│   │   └── navbar.ejs        # Reusable navigation bar component
│   ├── layouts/
│   │   └── boilerplate.ejs   # Base layout boilerplate with ejs-mate
│   ├── Listings/
│   │   ├── create.ejs        # New and edit listing forms
│   │   ├── error.ejs         # Centralized error display page
│   │   ├── index.ejs         # All listings showcase page
│   │   └── show.ejs          # Single listing detail & reviews view
│   └── Users/
│       ├── login.ejs         # User login form
│       └── signup.ejs        # User registration form
├── .gitignore                # Git ignore configuration
├── app.js                    # Express app initialization, middleware pipeline & server boot
├── middleware.js             # Authentication & authorization middleware (isLoggedIn, isOwner)
├── package.json              # Project dependencies and scripts
├── schema.js                 # Joi validation schemas (listing, review, user)
└── README.md                 # Project documentation
```

---

## 🌐 RESTful Routes

### 🏡 Listings (`/Listings`)

| HTTP Method | Endpoint | Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Redirect | Redirects to `/Listings` |
| `GET` | `/Listings` | Index | Display all listings (Public) |
| `GET` | `/Listings/new` | New | Form to create a new listing (Requires Login) |
| `POST` | `/Listings` | Create | Save a new listing with owner ID (Requires Login) |
| `GET` | `/Listings/:id` | Show | Display listing details and related reviews (Public) |
| `GET` | `/Listings/:id/edit` | Edit | Form to edit an existing listing (Requires Owner) |
| `PATCH` | `/Listings/:id` | Update | Update listing details in database (Requires Owner) |
| `DELETE` | `/Listings/:id` | Destroy | Delete listing and cascade delete associated reviews (Requires Owner) |

### ⭐ Reviews (`/Listings/:id/reviews`)

| HTTP Method | Endpoint | Action | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/Listings/:id/reviews` | Create | Submit a new rating & comment for a listing (Requires Login) |
| `DELETE` | `/Listings/:id/reviews/:reviewId` | Destroy | Remove a review from a listing and delete from DB (Requires Login) |

### 🔐 Authentication (`/`)

| HTTP Method | Endpoint | Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/signup` | Signup Form | Render user registration page |
| `POST` | `/signup` | Register | Create user account with salted/hashed password |
| `GET` | `/login` | Login Form | Render user login page |
| `POST` | `/login` | Authenticate | Verify credentials and establish user session |

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Project-wanderlust
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   Ensure MongoDB service is running:
   ```bash
   mongod
   ```

4. **(Optional) Seed Initial Data:**
   Uncomment `initdatabase(data)` in `app.js` once to populate sample listings, then comment it back.

5. **Run the Application:**
   ```bash
   node app.js
   ```

6. **View in Browser:**
   Open [http://localhost:8080/Listings](http://localhost:8080/Listings) in your browser.

---

## 🔮 Upcoming Enhancements

- 🗺️ **Map Integration**: Geocoding and interactive maps using Mapbox or Google Maps API.
- ☁️ **Cloud Storage**: Image upload support with Cloudinary / AWS S3.
- 🔍 **Search & Categorization**: Filter listings by category, location, and price range.

---

## 👤 Author

**Bharadwaj Gadepalli**
