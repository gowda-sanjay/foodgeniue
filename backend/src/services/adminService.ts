import { getPrisma } from '../config/prisma';

export async function getAdminDashboardStats() {
  const prisma = getPrisma();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  const [
    activeRestaurants,
    availableFoods,
    registeredUsers,
    todaysOrders,
    todaysSalesResult,
    revenueResult,
    searchAnalytics,
    recommendationAnalytics,
    recentOrders
  ] = await Promise.all([
    prisma.restaurant.count({ where: { status: 'OPEN' } }),
    prisma.food.count({ where: { stock: { gt: 0 } } }),
    prisma.user.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart, lte: todayEnd }, paymentStatus: 'SUCCESS' }
    }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.searchHistory.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.aIRecommendation.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        restaurant: { select: { id: true, restaurantName: true } },
        payment: true,
        items: {
          include: {
            food: {
              select: {
                foodName: true
              }
            }
          }
        }
      }
    })
  ]);

  const todaysSales = Number(todaysSalesResult._sum.totalAmount ?? 0);
  const revenue = Number(revenueResult._sum.totalAmount ?? 0);

  return {
    revenue,
    todaysOrders,
    todaysSales,
    activeRestaurants,
    availableFoods,
    registeredUsers,
    aiUsage: {
      searchQueriesToday: searchAnalytics,
      recommendationsToday: recommendationAnalytics
    },
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      customer: order.user,
      restaurant: order.restaurant,
      payment: order.payment,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        foodName: item.food.foodName
      }))
    }))
  };
}
