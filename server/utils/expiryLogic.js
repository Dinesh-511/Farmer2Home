const calculateExpiryDate = (category) => {
    const today = new Date();
    let expiryDate = new Date(today);

    if (category === 'vegetable' || category === 'fruit') {
        expiryDate.setDate(today.getDate() + 4);
    } else if (category === 'rice') {
        expiryDate.setDate(today.getDate() + 30);
    } else {
        // Default expiry if category not matched (fallback)
        expiryDate.setDate(today.getDate() + 7);
    }

    return expiryDate;
};

module.exports = calculateExpiryDate;
