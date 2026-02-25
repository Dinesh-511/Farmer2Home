const Order = require('../models/Order');
const Crop = require('../models/Crop');

exports.getFarmerAnalytics = async (req, res) => {
    try {
        const farmerId = req.user.id;

        // 1. Find all crops belonging to this farmer
        const farmerCrops = await Crop.find({ farmerId }).select('_id cropName quantity');
        const cropIds = farmerCrops.map(c => c._id);
        const cropNameMap = {};
        farmerCrops.forEach(c => { cropNameMap[c._id.toString()] = c.cropName; });

        // 2. Find all orders for this farmer's crops
        const orders = await Order.find({ cropId: { $in: cropIds } });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        // 3. Build top selling crops map (by quantity sold)
        const cropSalesMap = {};
        orders.forEach(order => {
            const key = order.cropId.toString();
            if (!cropSalesMap[key]) {
                cropSalesMap[key] = {
                    cropName: cropNameMap[key] || 'Unknown Crop',
                    quantitySold: 0,
                    revenue: 0,
                };
            }
            cropSalesMap[key].quantitySold += order.quantity || 0;
            cropSalesMap[key].revenue += order.totalPrice || 0;
        });

        const topSellingCrops = Object.values(cropSalesMap)
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);

        // 4. Identify low stock crops (< 20 units)
        const lowStockCrops = farmerCrops.filter(c => c.quantity < 20)
            .map(c => ({ cropName: c.cropName, quantity: c.quantity }));

        // 5. Orders by status
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

        res.json({
            totalRevenue,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            topSellingCrops,
            lowStockCrops,
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error fetching analytics' });
    }
};
