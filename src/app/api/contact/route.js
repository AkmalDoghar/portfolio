import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, address, phone, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Create transporter using Gmail + app password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Your email
      replyTo: email,                // Sender's email
      to: process.env.EMAIL_USER,    // Where you want to receive emails
      subject: `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Address: ${address || "N/A"}
Phone: ${phone || "N/A"}
Message: ${message}
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200 });
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
