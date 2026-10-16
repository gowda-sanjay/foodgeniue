import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.resolve(__dirname, '../../../frontend/data/restaurants.ts');
  const source = fs.readFileSync(dataPath, 'utf-8');
  const jsonMatch = source.match(/export const RESTAURANTS_DATA: Restaurant\[\] = (\[([\s\S]*?)\]);/m);

  if (!jsonMatch) {
    throw new Error('Cannot parse restaurants dataset from frontend data file');
  }

  const restaurantsText = jsonMatch[1];
  const restaurants = eval(restaurantsText);

  const foodsMatch = source.match(/export const FOODS_DATA: FoodItem\[\] = (\[[\s\S]*?\]);/m);
  if (!foodsMatch) {
    throw new Error('Cannot parse foods dataset from frontend data file');
  }

  const foods = eval(foodsMatch[1]);

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.foodNutrition.deleteMany();
  await prisma.food.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();

  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: {
        id: restaurant.id,
        restaurantName: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        latitude: 0,
        longitude: 0,
        googleMapsLink: restaurant.googleMaps,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        openingTime: restaurant.openingHours,
        closingTime: restaurant.closingHours,
        coverImage: restaurant.coverImage,
        logo: restaurant.logo,
        status: 'OPEN',
        offers: {
          create: restaurant.offers.map((offer: string) => ({
            title: offer,
            description: offer,
            discount: 0,
            expiresAt: null
          }))
        }
      }
    });
  }

  for (const food of foods) {
    const category = await prisma.category.upsert({
      where: { name: food.category },
      update: {},
      create: { name: food.category }
    });

    await prisma.food.create({
      data: {
        id: food.id,
        restaurantId: food.restaurantId,
        foodName: food.name,
        description: food.description,
        categoryId: category.id,
        price: food.price,
        image: food.image,
        rating: food.rating,
        reviews: 0,
        veg: food.veg,
        stock: food.availability ? 20 : 0,
        deliveryTime: food.deliveryTime,
        nutrition: {
          create: {
            calories: food.calories,
            protein: food.protein,
            carbohydrates: food.carbohydrates,
            fat: food.fat,
            fiber: food.fiber,
            sugar: food.sugar,
            sodium: food.sodium
          }
        }
      }
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'foodgen@123';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Food@123';
  const adminName = process.env.ADMIN_NAME || 'FoodGenie Admin';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
