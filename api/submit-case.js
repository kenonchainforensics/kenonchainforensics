const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Capture all fields submitted from the form
        const formData = req.body;

        // Configure the email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kenonchainforensic@gmail.com',
                pass: process.env.NOTIFICATION_EMAIL_PASSWORD // Reuses your existing App Password
            }
        });

        // Format the email content dynamically based on what fields were filled out
        let formFieldsHtml = '';
        for (const [key, value] of Object.entries(formData)) {
            if (value && key !== 'caseId') {
                formFieldsHtml += `<p style="margin: 8px 0;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>`;
            }
        }

        const mailOptions = {
            from: 'kenonchainforensic@gmail.com',
            to: 'kenonchainforensic@gmail.com',
            subject: `💼 New Case Intake Submission: ${formData.caseId || 'New Case'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h3 style="color: #2563eb; margin-top: 0;">New Case Dossier Submitted</h3>
                    <p style="font-size: 1.1rem; color: #111;"><strong>Case ID:</strong> ${formData.caseId || 'Pending'}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6;">
                        ${formFieldsHtml}
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 20px;">
                    <p style="font-size: 0.85rem; color: #666; font-style: italic; margin-bottom: 0;">_Secure Form Intake Pipeline_</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Form submission email failed:', error);
        return res.status(500).json({ error: 'Failed to process case submission' });
    }
}