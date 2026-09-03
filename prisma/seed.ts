import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_DATA_LABEL = '🔷 DEMO DATA';

async function main() {
  try {
    // Clear existing data
    await prisma.loyaltyTransaction.deleteMany();
    await prisma.loyaltyAccount.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.campaignProduct.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.discountCode.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    console.log('Cleared existing data');

    // Create categories
    const homeCategory = await prisma.category.create({
      data: {
        name: 'Home & Natural Care',
        slug: 'home-natural-care',
        description: 'Natural toiletries, creams, and home care products',
        enabled: true,
        displayOrder: 1,
      },
    });

    const spicesCategory = await prisma.category.create({
      data: {
        name: 'Natural Food Spices',
        slug: 'natural-food-spices',
        description: 'Natural seasoning blends made from local ingredients',
        enabled: true,
        displayOrder: 2,
      },
    });

    console.log('✓ Categories created');

    // Create products - Home & Natural Care
    const products = [
      {
        name: `${DEMO_DATA_LABEL} Natural Shea Butter Cream`,
        slug: 'natural-shea-butter-cream',
        description: 'Rich, moisturizing shea butter cream made with natural ingredients. Perfect for dry skin.',
        price: 2500,
        cost: 1000,
        stock: 150,
        categoryId: homeCategory.id,
        featured: true,
        ingredients: 'Shea butter, coconut oil, vitamin E',
      },
      {
        name: `${DEMO_DATA_LABEL} Liquid Soap - Lavender`,
        slug: 'liquid-soap-lavender',
        description: 'Gentle, sulfate-free liquid soap with natural lavender extract.',
        price: 1500,
        cost: 600,
        stock: 200,
        categoryId: homeCategory.id,
        featured: true,
        ingredients: 'Water, natural soap base, lavender oil, glycerin',
      },
      {
        name: `${DEMO_DATA_LABEL} Honey & Oat Soap Bar`,
        slug: 'honey-oat-soap-bar',
        description: 'Moisturizing soap bar with raw honey and ground oatmeal.',
        price: 800,
        cost: 300,
        stock: 250,
        categoryId: homeCategory.id,
        featured: false,
        ingredients: 'Honey, oatmeal, olive oil, coconut oil',
      },
      {
        name: `${DEMO_DATA_LABEL} Turmeric & Ginger Spice Blend`,
        slug: 'turmeric-ginger-spice-blend',
        description: 'Premium natural spice blend with turmeric, ginger, and complementary spices. A healthy alternative to conventional seasoning cubes.',
        price: 1800,
        cost: 700,
        stock: 120,
        categoryId: spicesCategory.id,
        featured: true,
        ingredients: 'Turmeric, ginger, coriander, black pepper, fenugreek, salt',
      },
      {
        name: `${DEMO_DATA_LABEL} Fish-based Seasoning Powder`,
        slug: 'fish-based-seasoning-powder',
        description: 'Natural seasoning powder with dried fish and aromatic spices. Perfect for soups and stews.',
        price: 2200,
        cost: 900,
        stock: 100,
        categoryId: spicesCategory.id,
        featured: true,
        ingredients: 'Dried fish, garlic, ginger, cayenne pepper, salt, turmeric',
      },
      {
        name: `${DEMO_DATA_LABEL} Pure Ginger Powder`,
        slug: 'pure-ginger-powder',
        description: 'Sun-dried and ground ginger powder with no additives.',
        price: 1200,
        cost: 500,
        stock: 180,
        categoryId: spicesCategory.id,
        featured: false,
        ingredients: 'Ginger root',
      },
      {
        name: `${DEMO_DATA_LABEL} Coconut Oil Moisturizer`,
        slug: 'coconut-oil-moisturizer',
        description: 'Pure coconut oil in a convenient moisturizer format.',
        price: 1900,
        cost: 800,
        stock: 160,
        categoryId: homeCategory.id,
        featured: false,
        ingredients: 'Virgin coconut oil, vitamin E oil',
      },
      {
        name: `${DEMO_DATA_LABEL} Lemongrass Body Wash`,
        slug: 'lemongrass-body-wash',
        description: 'Refreshing body wash with natural lemongrass extract.',
        price: 1700,
        cost: 700,
        stock: 140,
        categoryId: homeCategory.id,
        featured: false,
        ingredients: 'Water, natural soap base, lemongrass oil, aloe vera',
      },
    ];

    const createdProducts = await prisma.product.createMany({
      data: products,
    });

    console.log(`✓ ${createdProducts.count} products created`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@tenilolu.local',
        password: adminPassword,
        name: 'Admin User',
        phone: '08012345678',
        role: 'ADMIN',
        emailVerified: new Date(),
        admin: {
          create: {
            permissions: ['all'],
          },
        },
      },
    });

    console.log('✓ Admin user created (admin@tenilolu.local / admin123)');

    // Create demo customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = await prisma.user.create({
      data: {
        email: 'customer@example.com',
        password: customerPassword,
        name: 'Chioma Adebayo',
        phone: '08098765432',
        role: 'CUSTOMER',
        emailVerified: new Date(),
        customer: {
          create: {
            deliveryName: 'Chioma Adebayo',
            deliveryPhone: '08098765432',
            deliveryAddress: '45 Lekki Road',
            deliveryCity: 'Lagos',
            deliveryState: 'Lagos',
            deliveryPostalCode: '101241',
            totalOrders: 2,
            totalSpent: 8500,
            lastOrderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            status: 'ACTIVE',
          },
        },
        loyaltyAccount: {
          create: {
            balance: 850,
            tier: 'SILVER',
          },
        },
      },
    });

    console.log('✓ Demo customer created (customer@example.com / customer123)');

    // Create sample orders
    const allProducts = await prisma.product.findMany();
    const order1 = await prisma.order.create({
      data: {
        orderNumber: `ORD-2024-001`,
        userId: customerUser.id,
        customerName: 'Chioma Adebayo',
        customerEmail: 'customer@example.com',
        customerPhone: '08098765432',
        deliveryAddress: '45 Lekki Road',
        deliveryCity: 'Lagos',
        deliveryState: 'Lagos',
        deliveryPostalCode: '101241',
        subtotal: 4000,
        total: 4000,
        status: 'DELIVERED',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'bank_transfer',
        paymentReference: 'TXN-2024-001',
        deliveredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        confirmedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        processingAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
        shippedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              productId: allProducts[0].id,
              productName: allProducts[0].name,
              productPrice: allProducts[0].price,
              quantity: 1,
              subtotal: allProducts[0].price,
            },
            {
              productId: allProducts[1].id,
              productName: allProducts[1].name,
              productPrice: allProducts[1].price,
              quantity: 1,
              subtotal: allProducts[1].price,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: `ORD-2024-002`,
        userId: customerUser.id,
        customerName: 'Chioma Adebayo',
        customerEmail: 'customer@example.com',
        customerPhone: '08098765432',
        deliveryAddress: '45 Lekki Road',
        deliveryCity: 'Lagos',
        deliveryState: 'Lagos',
        deliveryPostalCode: '101241',
        subtotal: 4500,
        total: 4500,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: null,
        confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              productId: allProducts[3].id,
              productName: allProducts[3].name,
              productPrice: allProducts[3].price,
              quantity: 2,
              subtotal: allProducts[3].price * 2,
            },
          ],
        },
      },
    });

    console.log('✓ Demo orders created');

    // Create discount codes
    await prisma.discountCode.create({
      data: {
        code: 'DEMO10',
        type: 'PERCENTAGE',
        value: 10,
        maxUses: 50,
        minOrderAmount: 1000,
        activeFrom: new Date(),
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        enabled: true,
      },
    });

    await prisma.discountCode.create({
      data: {
        code: 'NATURAL500',
        type: 'FIXED_AMOUNT',
        value: 500,
        maxUses: 100,
        minOrderAmount: 2000,
        activeFrom: new Date(),
        enabled: true,
      },
    });

    console.log('✓ Discount codes created');

    // Create campaigns
    const campaign = await prisma.campaign.create({
      data: {
        name: `${DEMO_DATA_LABEL} Summer Natural Care Collection`,
        slug: 'summer-natural-care',
        description: 'Discover our summer collection of natural care products',
        type: 'SEASONAL',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        enabled: true,
        products: {
          create: [
            { productId: allProducts[0].id, displayOrder: 1 },
            { productId: allProducts[1].id, displayOrder: 2 },
            { productId: allProducts[6].id, displayOrder: 3 },
          ],
        },
      },
    });

    console.log('✓ Demo campaign created');

    // Add some reviews
    await prisma.review.create({
      data: {
        productId: allProducts[0].id,
        userId: customerUser.id,
        rating: 5,
        title: 'Amazing moisturizer!',
        content: 'This cream is wonderful. My skin feels so soft and hydrated. Will definitely order again.',
        approved: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: allProducts[3].id,
        userId: customerUser.id,
        rating: 4,
        title: 'Great seasoning blend',
        content: 'Good flavor, natural ingredients. Perfect for everyday cooking.',
        approved: true,
      },
    });

    console.log('✓ Demo reviews created');

    // Add loyalty transactions
    await prisma.loyaltyTransaction.create({
      data: {
        accountId: (await prisma.loyaltyAccount.findUnique({ where: { userId: customerUser.id } }))!.id,
        amount: 850,
        type: 'purchase',
        description: 'Points from orders',
      },
    });

    console.log('✓ Loyalty transactions created');

    console.log('\n✅ Database seeded successfully!');
    console.log(`\n📋 Demo Account Credentials:`);
    console.log(`Admin: admin@tenilolu.local / admin123`);
    console.log(`Customer: customer@example.com / customer123`);
    console.log(`\n⚠️  All demo data is clearly labeled with "${DEMO_DATA_LABEL}" prefix for easy identification`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
