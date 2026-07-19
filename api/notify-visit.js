const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { referrer, timestamp } = req.body;

        // Configure the email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kenonchainforensic@gmail.com', 
                pass: process.env.NOTIFICATION_EMAIL_PASSWORD  // Your Gmail App Password set in Vercel
            }
        });

        // Set up the email format
        const mailOptions = {
            from: 'kenonchainforensic@gmail.com',
            to: 'kenonchainforensic@gmail.com', // Sends the alert directly back to your inbox
            subject: '🔔 Alert: New Website Visitor Detected',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h3 style="color: #2563eb;">New Traffic on Ken Forensics</h3>
                    <p><strong>Time of Visit:</strong> ${new Date(timestamp).toLocaleString()}</p>
                    <p><strong>Traffic Source:</strong> ${referrer}</p>
                    <br>
                    <p style="font-size: 0.85rem; color: #666;">_Automated Tracker Pipeline_</p>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Email alert failed:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}