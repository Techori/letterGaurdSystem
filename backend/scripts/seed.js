
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const LetterType = require('../models/LetterType');
const Document = require('../models/Document');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Staff User',
    email: 'staff@demo.com',
    password: 'staff123',
    role: 'staff',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@demo.com',
    password: 'john123',
    role: 'staff',
    isActive: true
  }
];

const seedCategories = [
  {
    name: 'Official Letters',
    prefix: 'OFF',
    description: 'Official government correspondence'
  },
  {
    name: 'Circulars',
    prefix: 'CIR',
    description: 'Policy and procedural circulars'
  },
  {
    name: 'Certificates',
    prefix: 'CERT',
    description: 'Various types of certificates'
  },
  {
    name: 'Notifications',
    prefix: 'NOT',
    description: 'Public notifications and announcements'
  }
];

const seedLetterTypes = [
  { name: 'Appointment Letter', categoryName: 'Official Letters' },
  { name: 'Transfer Order', categoryName: 'Official Letters' },
  { name: 'Leave Sanction', categoryName: 'Official Letters' },
  { name: 'Policy Circular', categoryName: 'Circulars' },
  { name: 'Administrative Circular', categoryName: 'Circulars' },
  { name: 'Experience Certificate', categoryName: 'Certificates' },
  { name: 'Service Certificate', categoryName: 'Certificates' },
  { name: 'Public Notice', categoryName: 'Notifications' },
  { name: 'Tender Notice', categoryName: 'Notifications' }
];

const seedDocuments = [
  {
    title: 'New Employee Appointment - Software Developer',
    content: 'This is to inform that Mr. John Smith has been appointed as Software Developer in our organization with effect from January 1, 2024.',
    letterNumber: 'OFF/2024/001',
    referenceNumber: 'REF/OFF/012024/01',
    issueDate: '2024-01-01',
    status: 'Approved',
    categoryName: 'Official Letters',
    letterTypeName: 'Appointment Letter'
  },
  {
    title: 'Transfer Order - Administrative Staff',
    content: 'Ms. Jane Doe, Administrative Assistant, is hereby transferred from Head Office to Branch Office with immediate effect.',
    letterNumber: 'OFF/2024/002',
    referenceNumber: 'REF/OFF/012024/02',
    issueDate: '2024-01-15',
    status: 'Pending',
    categoryName: 'Official Letters',
    letterTypeName: 'Transfer Order'
  },
  {
    title: 'New IT Security Policy',
    content: 'All employees are required to follow the new IT security guidelines outlined in this circular.',
    letterNumber: 'CIR/2024/001',
    referenceNumber: 'REF/CIR/012024/01',
    issueDate: '2024-01-20',
    status: 'Draft',
    categoryName: 'Circulars',
    letterTypeName: 'Policy Circular'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data if --clear flag is passed
    if (process.argv.includes('--clear')) {
      console.log('Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        LetterType.deleteMany({}),
        Document.deleteMany({})
      ]);
      console.log('Existing data cleared');
    }

    // Seed Users
    console.log('Seeding users...');
    const users = [];
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        users.push(user);
        console.log(`Created user: ${userData.email}`);
      } else {
        users.push(existingUser);
        console.log(`User already exists: ${userData.email}`);
      }
    }

    // Seed Categories
    console.log('Seeding categories...');
    const categories = [];
    for (const categoryData of seedCategories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        categories.push(category);
        console.log(`Created category: ${categoryData.name}`);
      } else {
        categories.push(existingCategory);
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    // Seed Letter Types
    console.log('Seeding letter types...');
    const letterTypes = [];
    for (const letterTypeData of seedLetterTypes) {
      const category = categories.find(cat => cat.name === letterTypeData.categoryName);
      if (category) {
        const existingLetterType = await LetterType.findOne({ 
          name: letterTypeData.name, 
          category_id: category._id 
        });
        if (!existingLetterType) {
          const letterType = new LetterType({
            name: letterTypeData.name,
            category_id: category._id
          });
          await letterType.save();
          letterTypes.push(letterType);
          console.log(`Created letter type: ${letterTypeData.name}`);
        } else {
          letterTypes.push(existingLetterType);
          console.log(`Letter type already exists: ${letterTypeData.name}`);
        }
      }
    }

    // Seed Documents
    console.log('Seeding documents...');
    const staffUser = users.find(user => user.role === 'staff');
    for (const docData of seedDocuments) {
      const category = categories.find(cat => cat.name === docData.categoryName);
      const letterType = letterTypes.find(lt => lt.name === docData.letterTypeName);
      
      if (category && letterType && staffUser) {
        const existingDoc = await Document.findOne({ letter_number: docData.letterNumber });
        if (!existingDoc) {
          const document = new Document({
            title: docData.title,
            content: docData.content,
            category_id: category._id,
            letter_type_id: letterType._id,
            letter_number: docData.letterNumber,
            reference_number: docData.referenceNumber,
            issue_date: new Date(docData.issueDate),
            status: docData.status,
            created_by: staffUser._id
          });
          await document.save();
          console.log(`Created document: ${docData.title}`);
        } else {
          console.log(`Document already exists: ${docData.title}`);
        }
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('Staff: staff@demo.com / staff123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

seedDatabase();
