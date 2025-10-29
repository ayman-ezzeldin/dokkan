import connectDB from '../lib/db';
import Category from '../models/Category';
import Product from '../models/Product';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Product.deleteMany({});

    const categories = await Category.insertMany([
      {
        name: 'Fiction',
        slug: 'fiction',
        isActive: true,
      },
      {
        name: 'Non-Fiction',
        slug: 'non-fiction',
        isActive: true,
      },
      {
        name: 'Mystery',
        slug: 'mystery',
        isActive: true,
      },
      {
        name: 'Science',
        slug: 'science',
        isActive: true,
      },
    ]);

    const products = await Product.insertMany([
      {
        title: 'The Great Novel',
        slug: 'the-great-novel',
        description: 'A captivating story that takes you on an incredible journey.',
        images: ['/images/heroImg.jpg'],
        price: 29.99,
        currency: 'USD',
        categoryId: categories[0]._id,
        tags: ['fiction', 'bestseller'],
        stock: 50,
        isActive: true,
      },
      {
        title: 'Scientific Discoveries',
        slug: 'scientific-discoveries',
        description: 'Explore the latest breakthroughs in modern science.',
        images: ['/images/heroImg.jpg'],
        price: 39.99,
        currency: 'USD',
        categoryId: categories[3]._id,
        tags: ['science', 'education'],
        stock: 30,
        isActive: true,
      },
      {
        title: 'Mystery Thriller',
        slug: 'mystery-thriller',
        description: 'A suspenseful tale that keeps you guessing until the end.',
        images: ['/images/heroImg.jpg'],
        price: 24.99,
        currency: 'USD',
        categoryId: categories[2]._id,
        tags: ['mystery', 'thriller'],
        stock: 40,
        isActive: true,
      },
      {
        title: 'Biography of Success',
        slug: 'biography-of-success',
        description: 'Inspiring stories of people who achieved greatness.',
        images: ['/images/heroImg.jpg'],
        price: 34.99,
        currency: 'USD',
        categoryId: categories[1]._id,
        tags: ['biography', 'inspiration'],
        stock: 25,
        isActive: true,
      },
      {
        title: 'Fantasy Adventure',
        slug: 'fantasy-adventure',
        description: 'Embark on an epic quest in a magical world.',
        images: ['/images/heroImg.jpg'],
        price: 27.99,
        currency: 'USD',
        categoryId: categories[0]._id,
        tags: ['fantasy', 'adventure'],
        stock: 35,
        isActive: true,
      },
      {
        title: 'History Unveiled',
        slug: 'history-unveiled',
        description: 'Discover hidden truths about the past.',
        images: ['/images/heroImg.jpg'],
        price: 31.99,
        currency: 'USD',
        categoryId: categories[1]._id,
        tags: ['history', 'education'],
        stock: 20,
        isActive: true,
      },
    ]);

    console.log(`Seeded ${categories.length} categories and ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

