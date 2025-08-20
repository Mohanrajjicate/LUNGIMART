const SibApiV3Sdk = require('sib-api-v3-sdk');

const EMAIL_FROM = process.env.EMAIL_FROM || 'info@lungimart.in';
const STORE_URL = process.env.STORE_URL || 'http://localhost:3001';

// The Brevo API key is sourced from environment variables for security.
// It should be set in the deployment environment.
const BREVO_API_KEY = process.env.BREVO_API_KEY;


/**
 * Creates a Brevo API client instance.
 * Falls back to console logging if the API key is not available.
 */
let brevoApiClient = null;
if (BREVO_API_KEY) {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = BREVO_API_KEY;
        brevoApiClient = new SibApiV3Sdk.TransactionalEmailsApi();
        console.log("Brevo API client initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize Brevo API client:", error);
    }
} else {
    console.warn("BREVO_API_KEY not set. Email functionality will be mocked in the console.");
}


/**
 * A generic email sending function. If the Brevo client isn't configured,
 * it logs the email to the console for development/testing purposes.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} htmlBody - The HTML content of the email.
 */
const sendEmail = async (to, subject, htmlBody) => {
    if (!brevoApiClient) {
        console.log('--- MOCK EMAIL (BREVO_API_KEY not set) ---');
        console.log(`FROM: ${EMAIL_FROM}`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log('--- BODY (HTML) ---');
        console.log(htmlBody);
        console.log('---------------------\n');
        return;
    }

    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.sender = { email: EMAIL_FROM, name: 'LungiMart.in' };
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlBody;

        await brevoApiClient.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent successfully to ${to} via Brevo.`);
    } catch (error) {
        console.error(`Error sending email to ${to} via Brevo:`, error.response ? error.response.text : error.message);
    }
};

// --- HTML Email Templates ---

const emailTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563EB; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">LungiMart.in</h1>
    </div>
    <div style="padding: 20px;">
      ${content}
    </div>
    <div style="background-color: #f7f7f7; color: #777; padding: 15px; text-align: center; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} LungiMart.in. All Rights Reserved.</p>
    </div>
  </div>
`;

// --- Email Sending Functions ---

const sendWelcomeEmail = (user) => {
    const subject = 'Welcome to LungiMart.in!';
    const content = `
        <h2 style="color: #1e293b;">Hi ${user.name},</h2>
        <p>Thank you for creating an account with LungiMart.in. We're excited to have you!</p>
        <p>Explore our collection of authentic weaves from Komarapalayam and enjoy a seamless shopping experience.</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${STORE_URL}" style="background-color: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop Now</a>
        </div>
        <p>Happy Shopping,<br>The LungiMart.in Team</p>
    `;
    sendEmail(user.email, subject, emailTemplate(content));
};

const sendOrderConfirmationEmail = (user, order) => {
    const subject = `Your LungiMart.in Order Confirmation (#${order.id})`;
    const itemsList = order.items
        .map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

    const content = `
        <h2 style="color: #1e293b;">Thank You For Your Order, ${user.name}!</h2>
        <p>We've received it and are getting it ready for shipment. Here are the details:</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            ${itemsList}
            <tfoot>
                <tr>
                    <td style="padding: 10px 8px 0; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px 8px 0; text-align: right; font-weight: bold;">₹${order.total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
        <p>We'll notify you again once your order has shipped.</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${STORE_URL}/#/profile?tab=orders" style="background-color: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Details</a>
        </div>
        <p>The LungiMart.in Team</p>
    `;
    sendEmail(user.email, subject, emailTemplate(content));
};

const sendShippingUpdateEmail = (user, order) => {
    const subject = `Your LungiMart.in Order #${order.id} has shipped!`;
    const content = `
        <h2 style="color: #1e293b;">Good news, ${user.name}!</h2>
        <p>Your order has been shipped and is on its way to you.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Tracking Provider:</strong> ${order.trackingProvider}</p>
            <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
        </div>
        <p>You can use the details above to track your package's progress.</p>
        <p>Thanks for shopping with us,<br>The LungiMart.in Team</p>
    `;
    sendEmail(user.email, subject, emailTemplate(content));
};

const sendGlobalNotificationEmail = (user, message, link) => {
    const subject = 'A Notification from LungiMart.in';
    const fullLink = link ? `${STORE_URL}/#${link}` : STORE_URL;
    const content = `
        <h2 style="color: #1e293b;">Hi ${user.name},</h2>
        <p>${message}</p>
        ${link ? `<div style="text-align: center; margin: 20px 0;">
            <a href="${fullLink}" style="background-color: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Learn More</a>
        </div>` : ''}
        <p>Best,<br>The LungiMart.in Team</p>
    `;
    sendEmail(user.email, subject, emailTemplate(content));
};


module.exports = {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendShippingUpdateEmail,
    sendGlobalNotificationEmail,
};