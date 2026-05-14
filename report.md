---
title: "Amore Cakes Boutique - Comprehensive Technical Report"
author: "Engineering Team"
date: "May 2026"
---

# Amore Cakes Boutique: Comprehensive Technical & Architectural Report

## 1. Executive Summary
Amore Cakes Boutique (also known as Amore Shop Official) is a state-of-the-art, premium e-commerce web application specifically tailored for a luxury bakery experience. The platform allows users to browse artisanal cakes, pastries, and gourmet creations, add them to a cart, manage a wishlist, and securely checkout. It is designed with a modern, high-performance architecture utilizing Next.js for the frontend and Express.js for the backend, delivering seamless navigation, robust security, and an elegant visual aesthetic.

---

## 2. Project Architecture & Infrastructure

### 2.1. System Architecture Overview
The application follows a decoupled client-server architecture. This separation of concerns ensures that the frontend presentation layer can scale independently of the backend API and database systems.
- **Client Tier (Frontend):** Handles UI rendering, global state, local caching, routing, and user interactions.
- **Application Tier (Backend):** Handles business logic, authentication, order processing, and payment intent generation.
- **Data Tier (Database):** A NoSQL data store handling persistent data for users, products, orders, and configuration.

### 2.2. Frontend Architecture
Built on Next.js, the frontend employs a modern React-based component structure. It uses the App Router paradigm to manage layouts and pages efficiently. Global state management is handled via the React Context API (`AppContext.js`), which coordinates the cart, wishlist, user authentication state, and UI themes across the entire application without prop-drilling.

### 2.3. Backend Architecture
The Express.js backend acts as a RESTful API provider. It follows a structured MVC (Model-View-Controller) design pattern:
- **Routes:** Define the API endpoints (e.g., `adminRoutes.js`, `orderRoutes.js`, `couponRoutes.js`).
- **Controllers:** House the core business logic.
- **Models:** Define the Mongoose schemas and data validation rules (e.g., `Order.js`, `User.js`, `Product.js`).
- **Middleware:** Intercept requests for authentication (JWT verification), role-based access control (Admin guards), and error handling.

---

## 3. Detailed Technical Stack

### 3.1. Frontend Technologies
- **Next.js (React):** Server-side rendering (SSR) and static site generation (SSG) capabilities for improved SEO and initial load performance.
- **Tailwind CSS (v4):** A utility-first CSS framework used for rapid UI development. Custom configuration in `globals.css` extends the theme with brand-specific colors and interactive pseudo-classes.
- **Lucide React:** A comprehensive SVG icon library providing crisp, scalable iconography.
- **React Context API:** Native state management for session, cart, and preferences.

### 3.2. Backend Technologies
- **Node.js & Express.js:** Highly scalable, asynchronous runtime and lightweight web framework.
- **MongoDB & Mongoose:** A flexible document database and ODM (Object Data Modeling) library for schema enforcement and queries.
- **JSON Web Tokens (JWT):** Stateless, secure token-based authentication mechanism.
- **Bcrypt.js:** Cryptographic hash function for secure password storage.
- **Cors & Helmet:** Middleware for Cross-Origin Resource Sharing and securing HTTP headers.

---

## 4. Comprehensive Feature Breakdown

### 4.1. Advanced Navigation & Mega Menu
The application features a highly structured Mega Menu tailored for complex category taxonomies. Users can seamlessly navigate between categories such as 'Designer Cakes', 'Bento Cakes', 'Wedding Masterpieces', and 'Eggless Selections'. The menu dynamically renders multi-column layouts based on predefined JSON structures, allowing the business to highlight trending categories.

### 4.2. Voice Search Integration
To enhance accessibility and provide a cutting-edge user experience, the application includes a voice-activated search feature. Utilizing the Web Speech API (`webkitSpeechRecognition`), users can tap the microphone icon to vocalize queries like "Show me chocolate truffle cakes," which are automatically transcribed and executed against the product database.

### 4.3. E-commerce Engine (Cart, Checkout, & Orders)
- **Cart & Wishlist:** Persistent local state tracking with real-time total calculation and quantity management.
- **Order Processing:** Backend generation of order IDs, price calculation (including coupon code deductions), and persistent storage in the MongoDB `Order` collection.
- **Coupons Engine:** Dynamic coupon validation system that checks expiration dates, minimum cart values, and usage limits before applying discounts.

### 4.4. Security & Authentication
- **Multi-method Login:** Users can authenticate via standard Email/Password or third-party OAuth providers (e.g., Google).
- **Role-Based Access Control (RBAC):** Distinct privileges exist for 'Customer' and 'Admin' roles.
- **Token Handling:** JWTs are issued upon login and validated via middleware on all protected routes to ensure secure data access.

### 4.5. Admin Control Panel
Administrators have access to a secure, dedicated dashboard (`/admin`) to oversee business operations:
- **Inventory Management:** Add, edit, or remove bakery items, update pricing, and manage stock levels.
- **Order Fulfillment:** View incoming orders, update shipping statuses (e.g., Processing, Shipped, Delivered), and manage customer refunds.
- **Marketing Tools:** Create and distribute promotional coupon codes.

---

## 5. UI/UX & Design System

### 5.1. Typography
Recent updates have standardized the application's typography to rely solely on the **Inter** font family. This shift establishes a highly professional, clean, and modern visual hierarchy. 
- **Font Weights:** Heavy weights (`font-black`, `font-extrabold`) were globally deprecated in favor of `font-medium` and `font-normal` to reduce visual clutter and create a highly readable, elegant interface.

### 5.2. Theming & Color Palette
The application supports a robust light and dark mode system, toggleable by the user.
- **Primary Brand:** Deep Navy Blue and vibrant Brand Orange.
- **Accents:** Premium Golden Yellow (`--accent-gold`) and Soft Cream (`--primary-cream`).
- **Glassmorphism:** Strategic use of blurred backgrounds and semi-transparent layers to create a sense of depth and modernity.

### 5.3. Micro-Animations
To make the interface feel alive, the application utilizes custom CSS keyframe animations:
- `animate-float`: A continuous, smooth floating effect applied to toasts and featured items.
- `animate-slide-down`: A smooth entrance animation for the sticky header upon scrolling.

---

## 6. API Specifications (Overview)

While the full Swagger documentation is maintained separately, below is a high-level overview of the REST API structure:

- **Auth Routes (`/api/auth/*`):** `/register`, `/login`, `/google`, `/profile`
- **Product Routes (`/api/products/*`):** `GET /` (list), `GET /:id` (details), `POST /` (admin create)
- **Order Routes (`/api/orders/*`):** `POST /` (checkout), `GET /myorders` (user history), `GET /` (admin list), `PUT /:id/status` (admin update)
- **Coupon Routes (`/api/coupons/*`):** `POST /validate` (apply discount), `POST /` (admin create)

---

## 7. Deployment & Operations Workflow

### 7.1. Environment Configuration
The application relies on environment variables for secure configuration. Both the frontend and backend require a `.env` file (based on `.env.example`) containing:
- Database Connection URIs (MongoDB)
- JWT Secrets and Expiration limits
- Payment Gateway API Keys
- Base URLs for CORS policies

### 7.2. Development Workflow
The local development environment uses `npm run dev` to start both the Next.js frontend (port 3000) and the Express.js backend. Hot Module Replacement (HMR) is active on the frontend, allowing instantaneous visual feedback during UI development.

### 7.3. Production Build
For production deployment:
1. The backend is compiled and deployed to a Node.js hosting provider (e.g., Render, Heroku, AWS).
2. The frontend is built using `next build`, generating highly optimized static bundles, which are then served via a CDN or Vercel.

---

## 8. Conclusion
Amore Cakes Boutique represents a highly scalable, secure, and visually stunning e-commerce solution. By leveraging Next.js and Express.js, the platform guarantees excellent performance while providing a sophisticated, user-friendly interface backed by a powerful administrative engine.
