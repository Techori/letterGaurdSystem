// backend/scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const LetterType = require('../models/LetterType');
const Document = require('../models/Document');

// Mock data
const seedData = {
  users: [
    {
      name: 'System Admin',
      email: 'admin@ripl.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'HR Manager',
      email: 'hr@ripl.com',
      password: 'hr1234',
      role: 'staff'
    },
    {
      name: 'Admin Officer',
      email: 'officer@ripl.com',
      password: 'officer123',
      role: 'staff'
    },
    {
      name: 'Staff Member',
      email: 'staff@ripl.com',
      password: 'staff123',
      role: 'staff'
    }
  ],
  
  categories: [
    {
      name: 'Employment Letters',
      prefix: 'EMP',
      description: 'All employment related documents and letters'
    },
    {
      name: 'Certificate',
      prefix: 'CERT',
      description: 'Various certificates issued by the organization'
    },
    {
      name: 'Circulars and Management',
      prefix: 'CIRC',
      description: 'Management circulars and administrative documents'
    },
    {
      name: 'Official Correspondence',
      prefix: 'CORR',
      description: 'Official correspondence and communications'
    }
  ],
  
  letterTypes: [
    {
      name: 'Offer Letter (Internship)',
      description: 'Internship offer letters for candidates'
    },
    {
      name: 'Offer Letter (PPO)',
      description: 'Pre-placement offer letters'
    },
    {
      name: 'Experience Certificate',
      description: 'Work experience certificates'
    },
    {
      name: 'Letter of agree to pay',
      description: 'Financial agreement letters'
    },
    {
      name: 'Completion Certificate',
      description: 'Course or internship completion certificates'
    }
  ]
};

// Seeding functions
async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await Document.deleteMany({});
  await LetterType.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  console.log('✅ Database cleared successfully');
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  const users = [];
  
  for (const userData of seedData.users) {
    const user = new User(userData);
    await user.save();
    users.push(user);
    console.log(`   ✓ Created user: ${user.name} (${user.role})`);
  }
  
  return users;
}

async function seedCategories() {
  console.log('📁 Seeding categories...');
  const categories = [];
  
  for (const categoryData of seedData.categories) {
    const category = new Category(categoryData);
    await category.save();
    categories.push(category);
    console.log(`   ✓ Created category: ${category.name}`);
  }
  
  return categories;
}

async function seedLetterTypes(categories) {
  console.log('📄 Seeding letter types...');
  const letterTypes = [];
  
  // Map letter types to categories
  const letterTypeMapping = [
    { typeIndex: 0, categoryIndex: 0 }, // Offer Letter (Internship) -> Employment Letters
    { typeIndex: 1, categoryIndex: 0 }, // Offer Letter (PPO) -> Employment Letters
    { typeIndex: 2, categoryIndex: 1 }, // Experience Certificate -> Certificate
    { typeIndex: 3, categoryIndex: 2 }, // Letter of agree to pay -> Circulars and Management
    { typeIndex: 4, categoryIndex: 1 }, // Completion Certificate -> Certificate
  ];
  
  for (const mapping of letterTypeMapping) {
    const letterTypeData = {
      ...seedData.letterTypes[mapping.typeIndex],
      categoryId: categories[mapping.categoryIndex]._id
    };
    
    const letterType = new LetterType(letterTypeData);
    await letterType.save();
    letterTypes.push(letterType);
    console.log(`   ✓ Created letter type: ${letterType.name}`);
  }
  
  return letterTypes;
}

async function seedDocuments(users, categories, letterTypes) {
  console.log('📋 Seeding documents...');
  
  const staffUsers = users.filter(user => user.role === 'staff');
  const adminUser = users.find(user => user.role === 'admin');
  
  const documents = [
    {
      title: 'Internship Offer Letter - Anuj Jain',
      categoryId: categories[0]._id, // Employment Letters
      letterTypeId: letterTypes[0]._id, // Offer Letter (Internship)
      letterNumber: 'RIPL/2025-26/04',
      referenceNumber: 'OTAL/2025-26/03',
      issueDate: new Date('2025-04-13'),
      content: 'Dear Anuj Jain,\n\nWe are pleased to offer you an internship position at our organization...',
      status: 'Approved',
      createdBy: staffUsers[0]._id,
      approvedBy: adminUser._id,
      approvedAt: new Date('2025-04-14')
    },
    {
      title: 'Internship Offer Letter - Raj Shivhare',
      categoryId: categories[0]._id, // Employment Letters
      letterTypeId: letterTypes[0]._id, // Offer Letter (Internship)
      letterNumber: 'RIPL/2025-26/05',
      referenceNumber: 'OTAL/2025-26/04',
      issueDate: new Date('2025-04-13'),
      content: 'Dear Raj Shivhare,\n\nWe are pleased to offer you an internship position at our organization...',
      status: 'Approved',
      createdBy: staffUsers[0]._id,
      approvedBy: adminUser._id,
      approvedAt: new Date('2025-04-14')
    },
    {
      title: 'PPO Letter - Raj Shivhare',
      categoryId: categories[0]._id, // Employment Letters
      letterTypeId: letterTypes[1]._id, // Offer Letter (PPO)
      letterNumber: 'RIPL/2025-26/72',
      referenceNumber: 'OTAL/2025-26/70',
      issueDate: new Date('2025-07-03'),
      content: 'Dear Raj Shivhare,\n\nWe are pleased to extend a Pre-Placement Offer...',
      status: 'Approved',
      createdBy: staffUsers[0]._id,
      approvedBy: adminUser._id,
      approvedAt: new Date('2025-07-04')
    },
    {
      title: 'Internship Completion Certificate - Raj Shivhare',
      categoryId: categories[1]._id, // Certificate
      letterTypeId: letterTypes[4]._id, // Completion Certificate
      letterNumber: 'RIPL/2025-26/104',
      referenceNumber: 'CRTF/2025-26/16',
      issueDate: new Date('2025-07-30'),
      content: 'This certificate confirms the successful completion of internship program in our IT department.',
      status: 'Approved',
      createdBy: staffUsers[1]._id,
      approvedBy: adminUser._id,
      approvedAt: new Date('2025-07-30')
    },
    {
      title: 'Internship Completion Certificate - Nisha',
      categoryId: categories[1]._id, // Certificate
      letterTypeId: letterTypes[4]._id, // Completion Certificate
      letterNumber: 'RIPL/2025-26/116',
      referenceNumber: 'CRTF/2025-26/28',
      issueDate: new Date('2025-07-30'),
      content: 'This certificate confirms the completion of the internship program in the IT Department as of July 31, 2025. However, the intern\'s behavior towards seniors has been unsatisfactory, work performance was slow, and connectivity with seniors was lacking, with no communication for the past 20 days.',
      status: 'Approved',
      createdBy: staffUsers[1]._id,
      approvedBy: adminUser._id,
      approvedAt: new Date('2025-07-30')
    },
    {
      title: 'Draft Letter - Test Document',
      categoryId: categories[2]._id, // Circulars and Management
      letterTypeId: letterTypes[3]._id, // Letter of agree to pay
      letterNumber: 'RIPL/2025-26/117',
      referenceNumber: 'DRAFT/2025-26/01',
      issueDate: new Date('2025-08-01'),
      content: 'This is a draft document for testing purposes...',
      status: 'Draft',
      createdBy: staffUsers[2]._id
    },
    {
      title: 'Pending Review Document',
      categoryId: categories[0]._id, // Employment Letters
      letterTypeId: letterTypes[2]._id, // Experience Certificate
      letterNumber: 'RIPL/2025-26/118',
      referenceNumber: 'PEND/2025-26/01',
      issueDate: new Date('2025-08-02'),
      content: 'This document is pending review...',
      status: 'Pending',
      createdBy: staffUsers[2]._id
    }
  ];
  
  for (const docData of documents) {
    const document = new Document(docData);
    await document.save();
    console.log(`   ✓ Created document: ${document.title} (${document.status})`);
  }
  
  return documents;
}

// Main seeding function
async function seedDatabase(clearExisting = false) {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    
    // Clear existing data if requested
    if (clearExisting) {
      await clearDatabase();
      console.log('');
    }
    
    // Seed data
    const users = await seedUsers();
    console.log('');
    
    const categories = await seedCategories();
    console.log('');
    
    const letterTypes = await seedLetterTypes(categories);
    console.log('');
    
    const documents = await seedDocuments(users, categories, letterTypes);
    console.log('');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📁 Categories: ${categories.length}`);
    console.log(`   📄 Letter Types: ${letterTypes.length}`);
    console.log(`   📋 Documents: ${documents.length}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@ripl.com / admin123');
    console.log('   HR Staff: hr@ripl.com / hr123');
    console.log('   Officer: officer@ripl.com / officer123');
    console.log('   Staff: staff@ripl.com / staff123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run seeder
if (require.main === module) {
  const clearExisting = process.argv.includes('--clear');
  seedDatabase(clearExisting)
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
