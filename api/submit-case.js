const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body;
        const userEmail = formData.emailAddress;
        const caseId = formData.caseId || 'Pending';

        // Configure the email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kenonchainforensic@gmail.com',
                pass: process.env.NOTIFICATION_EMAIL_PASSWORD 
            }
        });

        // 1. FORMAT THE ADMIN NOTIFICATION EMAIL (For You)
        let formFieldsHtml = '';
        for (const [key, value] of Object.entries(formData)) {
            if (value && key !== 'caseId') {
                formFieldsHtml += `<p style="margin: 8px 0;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>`;
            }
        }

        const adminMailOptions = {
            from: 'kenonchainforensic@gmail.com',
            to: 'kenonchainforensic@gmail.com',
            subject: `💼 New Case Intake Submission: ${caseId}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h3 style="color: #2563eb; margin-top: 0;">New Case Dossier Submitted</h3>
                    <p style="font-size: 1.1rem; color: #111;"><strong>Case ID:</strong> ${caseId}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6;">
                        ${formFieldsHtml}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 20px;">
                    <p style="font-size: 0.85rem; color: #666; font-style: italic; margin-bottom: 0;">_Secure Form Intake Pipeline_</p>
                </div>
            `
        };

        // Send the admin notification
        await transporter.sendMail(adminMailOptions);

        // 2. FORMAT THE CLIENT CONFIRMATION EMAIL (For the User)
        if (userEmail && userEmail !== 'Not provided') {
            const clientMailOptions = {
                from: '"Ken On-Chain Forensics" <kenonchainforensic@gmail.com>',
                to: userEmail,
                subject: `Dossier Initialized: Case ID ${caseId}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <!-- Header Banner -->
                        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 30px 20px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.5px;">KEN ON-CHAIN FORENSICS</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9rem;">Digital Asset Recovery & Intelligence</p>
                        </div>
                        
                        <!-- Content Body -->
                        <div style="padding: 30px 25px; background-color: #ffffff; color: #334155; line-height: 1.6;">
                            <p style="margin-top: 0; font-size: 1.05rem;">Hello,</p>
                            
                            <p>Thank you for contacting Ken On-Chain Forensics. We are writing to confirm that your case intake dossier has been successfully submitted and secure telemetry routing is active.</p>
                            
                            <!-- Case ID Highlight Card -->
                            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                                <p style="margin: 0; font-size: 0.85rem; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px;">Your Assigned Case Reference</p>
                                <p style="margin: 5px 0 0 0; font-size: 1.3rem; font-weight: 700; color: #1e3a8a; font-family: monospace;">${caseId}</p>
                            </div>
                            
                            <h3 style="color: #1e3a8a; font-size: 1.1rem; margin-top: 25px;">Next Phases of Operations</h3>
                            <ul style="padding-left: 20px; margin: 10px 0;">
                                <li style="margin-bottom: 8px;"><strong>Dossier Evaluation:</strong> Our active engineering team has received your telemetry and is initiating a preliminary cross-examination of the provided transaction indices.</li>
                                <li style="margin-bottom: 8px;"><strong>Operational Communications:</strong> A dedicated analyst will reach out directly to this email address if further evidentiary details or local logs are required.</li>
                            </ul>
                            
                            <p style="margin-top: 25px;">You can monitor real-time updates using your Case Reference on our tracking infrastructure. Should you have immediate inquiries, please reach out to our active investigative response teams through our standard operational channels.</p>
                            
                            <p style="margin-top: 30px; margin-bottom: 0;">Regards,</p>
                            <p style="margin: 0; font-weight: 600; color: #1e3a8a;">Investigative Operations Command</p>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Ken On-Chain Forensics</p>
                        </div>
                        
                        <!-- Footer Banner -->
                        <div style="background-color: #f1f5f9; padding: 15px 20px; text-align: center; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0;">This is an automated operational transmission. Please do not reply directly to this email template.</p>
                        </div>
                    </div>
                `
            };

            // Send the client confirmation
            await transporter.sendMail(clientMailOptions);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Form submission email pipeline failed:', error);
        return res.status(500).json({ error: 'Failed to process case submission' });
    }
}