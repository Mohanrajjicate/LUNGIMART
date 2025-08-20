const EMAIL_FROM = 'Info@lungimart.in';

const logEmail = (to, subject, body) => {
    console.log('--- SENDING EMAIL ---');
    console.log(`FROM: ${EMAIL_FROM}`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('--- BODY ---');
    console.log(body);
    console.log('---------------------\n');
};

const sendWelcomeEmail = (user) => {
    const subject = 'Welcome to LungiMart.in!';
    const body = `Hi ${user.name},\n\nThank you for creating an account with LungiMart.in. We're excited to have you!\n\nExplore our collection of authentic weaves from Komarapalayam.\n\nHappy Shopping,\nThe LungiMart.in Team`;
    logEmail(user.email, subject, body);
};

const sendOrderConfirmationEmail = (user, order) => {
    const subject = `Your LungiMart.in Order Confirmation (#${order.id})`;
    const itemsList = order.items.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const body = `Hi ${user.name},\n\nThank you for your order! We've received it and are getting it ready for shipment.\n\nOrder Details:\nOrder ID: ${order.id}\n${itemsList}\n\nTotal: ₹${order.total.toFixed(2)}\n\nWe'll notify you again once your order has shipped.\n\nThe LungiMart.in Team`;
    logEmail(user.email, subject, body);
};

const sendShippingUpdateEmail = (user, order) => {
    const subject = `Your LungiMart.in Order #${order.id} has shipped!`;
    const body = `Hi ${user.name},\n\nGood news! Your order has been shipped.\n\nTracking Provider: ${order.trackingProvider}\nTracking Number: ${order.trackingNumber}\n\nYou can track your package's progress.\n\nThanks for shopping with us,\nThe LungiMart.in Team`;
    logEmail(user.email, subject, body);
};

const sendGlobalNotificationEmail = (user, message, link) => {
    const subject = 'A Notification from LungiMart.in';
    const fullLink = link ? `http://localhost:3001/#${link}` : 'http://localhost:3001';
    const body = `Hi ${user.name},\n\n${message}\n\n${link ? `Click here to learn more: ${fullLink}` : ''}\n\nBest,\nThe LungiMart.in Team`;
    logEmail(user.email, subject, body);
};


module.exports = {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendShippingUpdateEmail,
    sendGlobalNotificationEmail,
};