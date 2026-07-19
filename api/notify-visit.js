const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { referrer, timestamp } = req.body;

        // Extract geolocation and device info provided automatically by Vercel
        const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
        const region = req.headers['x-vercel-ip-country-region'] || 'Unknown Region';
        const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown Device';

        // Format a readable location string
        const location = country !== 'Unknown Country' 
            ? `${decodeURIComponent(city)}, ${region} (${country})` 
            : 'Unknown Location';

        // Configure the email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kenonchainforensic@gmail.com', 
                pass: process.env.NOTIFICATION_EMAIL_PASSWORD 
            }
        });

        // Set up the enriched email format
        const mailOptions = {
            from: 'kenonchainforensic@gmail.com',
            to: 'kenonchainforensic@gmail.com', 
            subject: `🔔 Alert: New Visitor from ${country}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h3 style="color: #2563eb; margin-top: 0;">New Traffic on Ken Forensics</h3>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 15px;">
                    
                    <p><strong>⏰ Time of Visit:</strong> ${new Date(timestamp).toLocaleString()}</p>
                    <p><strong>🌐 Traffic Source:</strong> ${referrer}</p>
                    <p><strong>📍 Location:</strong> ${location}</p>
                    <p><strong>🖥️ IP Address:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${ip.split(',')[0]}</code></p>
                    <p><strong>📱 Device/Browser:</strong> <span style="font-size: 0.9rem; color: #555;">${userAgent}</span></p>
                    
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 20px;">
                    <p style="font-size: 0.85rem; color: #666; font-style: italic; margin-bottom: 0;">_Automated Tracker Pipeline_</p>
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