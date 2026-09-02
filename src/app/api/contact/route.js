import nodemailer from "nodemailer";

// In-memory rate limiting map
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 3;

  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter((timestamp) => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    return true;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return false;
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many messages sent. Please wait a few minutes." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await req.json();
    const { name, email, message, botcheck } = data;

    // Honeypot check for automated bots
    if (botcheck) {
      return new Response(
        JSON.stringify({ message: "Message sent successfully!" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please enter your name." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please enter a message of at least 10 characters." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // If SMTP environment variables are configured, send real email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: email.trim(),
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name.trim()}`,
        text: `New contact submission from portfolio website:

Name: ${name.trim()}
Email: ${email.trim()}

Message:
${message.trim()}
`,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log("Contact form submission logged (SMTP credentials not set):", {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ message: "Message sent successfully! I will respond within 24 hours." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email API route error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try emailing directly." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
