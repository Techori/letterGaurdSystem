
# Document Management Backend

A Node.js backend with MongoDB Atlas integration for the document management system.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Update the MongoDB URI with your Atlas connection string
   - Set a secure JWT secret

3. **MongoDB Atlas Setup:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Update the `MONGODB_URI` in your `.env` file

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create new document
- `PATCH /api/documents/:id/status` - Update document status (admin)
- `DELETE /api/documents/:id` - Delete document

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Letter Types
- `GET /api/letter-types` - Get all letter types
- `POST /api/letter-types` - Create letter type (admin)

### Staff
- `GET /api/staff` - Get all staff (admin)

## Default Admin User

Create an admin user by registering with role 'admin' or update a user in MongoDB directly.
