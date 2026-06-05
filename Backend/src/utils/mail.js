import Mailgen from "mailgen";
import ApiError from "./ApiError.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// console.log(process.env.RESEND_API_KEY);
// console.log(process.env.EMAIL_FROM);

// ================= 📧 MAILGEN CONFIG =================
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Nutricart",
    link: "https://nutricart.com",
  },
});

// ================= 🧠 CORE EMAIL SENDER =================
export const sendEmail = async ({ to, subject, mailContent }) => {
  try {
    const html = mailGenerator.generate(mailContent);
    const text = mailGenerator.generatePlaintext(mailContent);

    const info = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });
    // console.log("RESEND RESPONSE:", info);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new ApiError(500, "Failed to send email");
  }
};

// =================================================================
// ✉️  TEMPLATE BUILDERS  (return raw Mailgen content objects)
// =================================================================

// ── 1. Email Verification ──────────────────────────────────────────
export const emailVerificationMailgenContent = (username, verificationUrl) => ({
  body: {
    name: username,
    intro: "Welcome to Nutricart! We're excited to have you on board.",
    action: {
      instructions: "To verify your email, please click the button below:",
      button: {
        color: "#1aae5a",
        text: "Verify your email",
        link: verificationUrl,
      },
    },
    outro:
      "If you did not create this account, please ignore this email. Need help? Just reply to this email.",
  },
});

// ── 2. Reset Password ──────────────────────────────────────────────
export const resetPasswordMailgenContent = (username, resetUrl) => ({
  body: {
    name: username,
    intro: "You requested to reset your password.",
    action: {
      instructions:
        "This link is valid for 15 minutes. Click below to set a new password:",
      button: { color: "#e63946", text: "Reset Password", link: resetUrl },
    },
    outro:
      "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.",
  },
});

// ── 3. Password Changed Confirmation ──────────────────────────────
export const passwordChangedMailgenContent = (username) => ({
  body: {
    name: username,
    intro: "Your Nutricart password was successfully changed.",
    outro: [
      "If you made this change, no further action is required.",
      "If you did NOT change your password, please reset it immediately or contact our support team.",
    ],
  },
});

// ── 4. Welcome (post-verification) ────────────────────────────────
export const welcomeMailgenContent = (username, shopUrl) => ({
  body: {
    name: username,
    intro: "🎉 Your email has been verified — welcome to Nutricart!",
    action: {
      instructions: "Start exploring healthy products crafted just for you:",
      button: { color: "#1aae5a", text: "Shop Now", link: shopUrl },
    },
    outro: "Questions? Just reply to this email — we're happy to help.",
  },
});

// ── 5. Order Confirmation ──────────────────────────────────────────
/**
 * @param {string}  username
 * @param {object}  order
 * @param {string}  order.id          - e.g. "ORD-20240512-001"
 * @param {Array}   order.items        - [{ name, description, price, quantity }]
 * @param {number}  order.subtotal
 * @param {number}  order.shipping
 * @param {number}  order.total
 * @param {string}  order.trackingUrl
 * @param {object}  order.address      - { line1, city, state, zip }
 */
export const orderConfirmationMailgenContent = (username, order) => ({
  body: {
    name: username,
    intro: `Thank you for your order! 🛒 Your order <strong>#${order.id}</strong> has been placed successfully.`,
    table: {
      data: order.items.map((item) => ({
        Item: item.name,
        Description: item.description ?? "—",
        Qty: item.quantity,
        Price: `₹${(item.price * item.quantity).toFixed(2)}`,
      })),
      columns: {
        customWidth: {
          Item: "40%",
          Description: "30%",
          Qty: "10%",
          Price: "20%",
        },
        customAlignment: { Price: "right", Qty: "center" },
      },
    },
    // Summary rows below the table
    action: {
      instructions: `
        <strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}<br/>
        <strong>Shipping:</strong> ₹${order.shipping.toFixed(2)}<br/>
        <strong>Total:</strong> ₹${order.total.toFixed(2)}<br/><br/>
        <strong>Delivering to:</strong> ${order.address.line1}, ${order.address.city}, ${order.address.state} – ${order.address.zip}
      `,
      button: { color: "#1aae5a", text: "View Order", link: order.trackingUrl },
    },
    outro:
      "We'll send you another email once your order ships. Questions? Reply to this email.",
  },
});

// ── 6. Order Shipped ──────────────────────────────────────────────
/**
 * @param {string} username
 * @param {object} shipment
 * @param {string} shipment.orderId
 * @param {string} shipment.carrier         - e.g. "Delhivery"
 * @param {string} shipment.trackingNumber
 * @param {string} shipment.trackingUrl
 * @param {string} shipment.estimatedDate   - e.g. "14 May 2024"
 */
export const orderShippedMailgenContent = (username, shipment) => ({
  body: {
    name: username,
    intro: `Great news! Your Nutricart order <strong>#${shipment.orderId}</strong> is on its way. 🚚`,
    dictionary: {
      Carrier: shipment.carrier,
      "Tracking Number": shipment.trackingNumber,
      "Estimated Delivery": shipment.estimatedDate,
    },
    action: {
      instructions: "Track your package in real time:",
      button: {
        color: "#457b9d",
        text: "Track Shipment",
        link: shipment.trackingUrl,
      },
    },
    outro:
      "If you have any questions about your delivery, feel free to reach out.",
  },
});

// ── 7. Order Delivered ─────────────────────────────────────────────
export const orderDeliveredMailgenContent = (username, order) => ({
  body: {
    name: username,
    intro: `Your order <strong>#${order.id}</strong> has been delivered! 🎉 We hope you enjoy your Nutricart products.`,
    action: {
      instructions: "Loved your order? Share your experience:",
      button: {
        color: "#f4a261",
        text: "Leave a Review",
        link: order.reviewUrl,
      },
    },
    outro:
      "Have an issue with your order? Contact us within 7 days and we'll make it right.",
  },
});

// ── 8. Order Cancelled ─────────────────────────────────────────────
/**
 * @param {string} username
 * @param {object} order
 * @param {string} order.id
 * @param {string} order.reason    - cancellation reason
 * @param {number} order.refundAmt - 0 if no refund
 * @param {string} order.supportUrl
 */
export const orderCancelledMailgenContent = (username, order) => ({
  body: {
    name: username,
    intro: `Your order <strong>#${order.id}</strong> has been cancelled.`,
    dictionary: {
      Reason: order.reason,
      ...(order.refundAmt > 0 && {
        "Refund Amount": `₹${order.refundAmt.toFixed(2)}`,
        "Refund Timeline": "5–7 business days to your original payment method",
      }),
    },
    action: {
      instructions: "Need help or want to place a new order?",
      button: {
        color: "#e63946",
        text: "Contact Support",
        link: order.supportUrl,
      },
    },
    outro:
      "We're sorry for the inconvenience. We hope to serve you again soon.",
  },
});

// =================================================================
// 📬  SEND WRAPPERS  (ready-to-call from controllers)
// =================================================================

export const sendVerificationEmail = (to, username, verificationUrl) =>
  sendEmail({
    to,
    subject: "Verify your Nutricart email address",
    mailContent: emailVerificationMailgenContent(username, verificationUrl),
  });

export const sendResetPasswordEmail = (to, username, resetUrl) =>
  sendEmail({
    to,
    subject: "Reset your Nutricart password",
    mailContent: resetPasswordMailgenContent(username, resetUrl),
  });

export const sendPasswordChangedEmail = (to, username) =>
  sendEmail({
    to,
    subject: "Your Nutricart password was changed",
    mailContent: passwordChangedMailgenContent(username),
  });

export const sendWelcomeEmail = (to, username, shopUrl) =>
  sendEmail({
    to,
    subject: "Welcome to Nutricart 🎉",
    mailContent: welcomeMailgenContent(username, shopUrl),
  });

export const sendOrderConfirmationEmail = (to, username, order) =>
  sendEmail({
    to,
    subject: `Order Confirmed – #${order.id}`,
    mailContent: orderConfirmationMailgenContent(username, order),
  });

export const sendOrderShippedEmail = (to, username, shipment) =>
  sendEmail({
    to,
    subject: `Your order #${shipment.orderId} is on its way! 🚚`,
    mailContent: orderShippedMailgenContent(username, shipment),
  });

export const sendOrderDeliveredEmail = (to, username, order) =>
  sendEmail({
    to,
    subject: `Order #${order.id} delivered – How was it?`,
    mailContent: orderDeliveredMailgenContent(username, order),
  });

export const sendOrderCancelledEmail = (to, username, order) =>
  sendEmail({
    to,
    subject: `Order #${order.id} has been cancelled`,
    mailContent: orderCancelledMailgenContent(username, order),
  });
