const Order = require('../models/Order');
const Crop = require('../models/Crop');
const sendEmail = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
    const { cropId, quantity } = req.body;

    if (!cropId || !quantity) {
        return res.status(400).json({ message: 'Please provide crop ID and quantity' });
    }

    try {
        const crop = await Crop.findById(cropId);

        if (!crop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        // Check if crop is active
        if (crop.status !== 'active') {
            return res.status(400).json({ message: 'Crop is not active' });
        }

        // Check expiry
        if (new Date() > crop.expiryDate) {
            return res.status(400).json({ message: 'Crop has expired' });
        }

        // Check quantity
        if (crop.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity available' });
        }

        const totalPrice = crop.price * quantity;

        // Generate 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        // Create order
        const order = await Order.create({
            cropId,
            farmerId: crop.farmerId,
            customerId: req.user.id,
            quantity,
            totalPrice,
            status: 'pending',
            otpCode,
            otpVerified: false,
            otpExpiresAt
        });

        if (order) {
            // Update crop quantity
            crop.quantity = crop.quantity - quantity;

            // Mark as sold out if quantity is 0
            if (crop.quantity === 0) {
                crop.status = 'sold_out';
            }

            await crop.save();

            // Send Email OTP
            // Get customer email
            const customerEmail = req.user.email;
            const emailSubject = 'Farmer2Home Connect - Delivery OTP';
            const emailBody = `Your delivery OTP is: ${otpCode}. This OTP will expire in 15 minutes.`;

            await sendEmail(customerEmail, emailSubject, emailBody);

            // Return order WITHOUT OTP
            const orderResponse = order.toObject();
            delete orderResponse.otpCode;
            // We can leave otpExpiresAt if frontend wants to show countdown, but requirement said hide OTP

            // Emit Socket Events
            if (req.io) {
                // Targeted notification for the specific farmer
                req.io.to(crop.farmerId.toString()).emit('newOrder', {
                    type: 'new_order',
                    order: orderResponse,
                    message: `New order received for ${crop.cropName}!`
                });

                // Global update for crop quantity in the marketplace
                req.io.emit('cropUpdate', { type: 'quantity_change', cropId: crop._id, newQuantity: crop.quantity });
            }

            res.status(201).json({
                ...orderResponse,
                message: 'Order placed successfully. OTP sent to your registered email.'
            });
        } else {
            res.status(400).json({ message: 'Invalid order data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Order Delivery OTP
// @route   POST /api/orders/verify-otp
// @access  Private (Farmer)
const verifyOrderOTP = async (req, res) => {
    const { orderId, otp } = req.body;

    if (!orderId || !otp) {
        return res.status(400).json({ message: 'Please provide Order ID and OTP' });
    }

    try {
        // Find order and include otpCode for verification
        const order = await Order.findById(orderId).select('+otpCode');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is the farmer of this crop
        // We need to populate crop to check farmerId
        // Or simpler: The frontend calls this, but backend must verify ownership.
        const crop = await Crop.findById(order.cropId);
        if (!crop) {
            return res.status(404).json({ message: 'Associated crop not found' });
        }

        if (crop.farmerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to verify this order' });
        }

        if (order.otpVerified) {
            return res.status(400).json({ message: 'Order already verified' });
        }

        // Check Expiry
        if (order.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        if (order.otpCode === otp) {
            order.status = 'delivered';
            order.otpVerified = true;
            await order.save();

            // Emit real-time update
            if (req.io) {
                const updatedOrder = await Order.findById(order._id)
                    .populate('customerId', 'name email')
                    .populate('cropId', 'cropName');

                // Notify Farmer (Refresh view)
                req.io.to(order.farmerId.toString()).emit('orderUpdate', {
                    type: 'delivery_confirmed',
                    order: updatedOrder
                });

                // Notify Customer (Refresh view/toast)
                req.io.to(order.customerId._id.toString()).emit('deliveryUpdate', {
                    type: 'order_delivered',
                    order: updatedOrder,
                    message: `Your order for ${updatedOrder.cropId.cropName} telah delivered!`
                });
            }

            res.status(200).json({ message: 'Delivery verified successfully', order });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend Order Delivery OTP
// @route   POST /api/orders/resend-otp
// @access  Private (Customer)
const resendOrderOTP = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: 'Please provide Order ID' });
    }

    try {
        const order = await Order.findById(orderId).populate('customerId', 'email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Authorization check: Only the farmer associated with the crop can resend the OTP
        const crop = await Crop.findById(order.cropId);

        if (!crop || crop.farmerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Only the associated farmer can resend the delivery OTP' });
        }

        if (order.status !== 'pending' || order.otpVerified) {
            return res.status(400).json({ message: 'Cannot resend OTP for this order' });
        }

        // Generate NEW 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        order.otpCode = otpCode;
        order.otpExpiresAt = otpExpiresAt;
        await order.save();

        // Send Email to CUSTOMER
        const customerEmail = order.customerId.email;
        const emailSubject = 'Farmer2Home Connect - New Delivery OTP';
        const emailBody = `Your new delivery OTP is: ${otpCode}. This OTP will expire in 15 minutes. This has been requested by the farmer to confirm delivery.`;

        const sendEmail = require('../utils/emailService');
        await sendEmail(customerEmail, emailSubject, emailBody);

        res.status(200).json({ message: 'New OTP sent to customer registered email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
    try {
        // Valid for Customer: return their orders with OTP
        const orders = await Order.find({ customerId: req.user.id })
            .select('+otpCode') // Explicitly select OTP

            .populate({
                path: 'cropId',
                select: 'cropName price category farmerId',
                populate: {
                    path: 'farmerId',
                    select: 'name email'
                }
            })
            .sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders for logged in farmer
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
const getFarmerOrders = async (req, res) => {
    try {
        // Direct query by farmerId is more reliable and efficient
        const orders = await Order.find({ farmerId: req.user._id })
            .populate('customerId', 'name email')
            .populate('cropId', 'cropName')
            .sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getFarmerOrders,
    verifyOrderOTP,
    resendOrderOTP,
};
