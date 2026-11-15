# Wanderlust 🌍✈️

Wanderlust is a full-stack web application for discovering, creating, and managing vacation rentals and travel destinations—inspired by Airbnb. Built with Node.js, Express, MongoDB, and EJS, it follows a clean RESTful architecture with robust server-side schema validation and responsive UI styling.

---

## 🚀 Features

- **Explore Listings**: Browse a collection of travel destinations with prices, locations, and cover images.
- **Detailed View**: Access full details for any listing, including formatted pricing (INR) and descriptions.
- **Add New Listings**: Seamlessly add new listings with custom titles, descriptions, images, pricing, and locations.
- **Edit & Update**: Modify existing listings with pre-filled forms.
- **Delete Listings**: Safely remove listings from the platform.
- **Schema Validation**: Server-side request validation using **Joi** to ensure data integrity.
- **Centralized Error Handling**: Custom error handling using `wrapAsync` wrapper and `ExpressError` with dedicated error views.
- **Responsive Design**: Mobile-friendly layout designed using Bootstrap 5 and Font Awesome icons.
- **Modular Templates**: Reusable layouts, partials (navbar, footer), and view blocks powered by `ejs-mate`.

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) (ES Modules), [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- **Templating**: [EJS](https://ejs.co/), [ejs-mate](https://github.com/JacksonTian/ejs-mate)
- **Validation**: [Joi](https://joi.dev/)
- **Styling & Assets**: [Bootstrap 5](https://getbootstrap.com/), [Font Awesome](https://fontawesome.com/), Custom CSS
- **Utilities**: `method-override` (for PUT/PATCH/DELETE form actions)

---

## 📁 Project Structure

```text
MajorProject/
├── models/
│   ├── data.js           # Sample/seed listings data
│   └── listing.js        # Mongoose Schema & Model for Listings
├── public/
│   └── css/
│       └── style.css     # Custom styles
├── utils/
│   ├── ExpressError.js   # Custom Express error class
│   └── wrapAsync.js      # Async error handler wrapper
├── views/
│   ├── includes/
│   │   ├── footer.ejs    # Reusable footer component
│   │   └── navbar.ejs    # Reusable navigation bar component
│   ├── layouts/
│   │   └── boilerplate.ejs # Main boilerplate layout with ejs-mate
│   └── Listings/
│       ├── create.ejs    # New/Edit listing form
│       ├── error.ejs     # Error display page
│       ├── index.ejs     # All listings gallery page
│       └── show.ejs      # Single listing details page
├── .gitignore            # Git ignored directories and files
├── app.js                # Express app setup, database connection & routes
├── package.json          # Project dependencies & scripts
├── schema.js             # Joi validation schema
└── README.md             # Project documentation
```

---

## 🌐 RESTful Routes

| HTTP Method | Endpoint | Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Redirect | Redirects to `/Listings` |
| `GET` | `/Listings` | Index | Display all listings |
| `GET` | `/Listings/new` | New | Form to create a new listing |
| `POST` | `/Listings` | Create | Save a new listing to database |
| `GET` | `/Listings/:id` | Show | Display details of a specific listing |
| `GET` | `/Listings/:id/new` | Edit | Form to edit an existing listing |
| `PATCH` | `/Listings/:id` | Update | Update listing details in database |
| `DELETE` | `/Listings/:id` | Destroy | Remove listing from database |

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MajorProject
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your local machine:
   ```bash
   # Example for Windows Service or mongod command:
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

- 🔐 User Authentication & Authorization (Sign Up, Login, Owner verification)
- ⭐ Reviews and Ratings system for each listing
- 🗺️ Map integration (Mapbox / Google Maps API) for location coordinates
- ☁️ Cloud image uploads with Cloudinary
- 🔍 Search and filter functionality by location, price, and category

---

## 👤 Author

**Bharadwaj Gadepalli**
