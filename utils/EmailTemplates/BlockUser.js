require("dotenv").config();

module.exports = {
    generateBlockUserEmail: (username, email, token) => {
        const template = `<!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>Password Reset Request</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #e3e3e3;
                                    border-radius: 5px;
                                }
                            
                                h1 {
                                    color: #333333;
                                    margin-bottom: 20px;
                                }
                                
                                p {
                                    color: black;
                                }
                           
                        </style>
                        </head>
                            
                        <body>
                            <div className="container">
                                <h1>Account Blocked</h1>
                                <p>Dear ${username},</p>
                                <p>Your account has been blocked by the College Connect admin.</p>
                                <p>If you believe this is an error, or if you have any questions, please contact our support team.</p>
                                <p>Thank you,</p>
                                <p>College Connect Team</p>
                            </div>
                        </body>
                        </html>
              `;
        return {
            from: process.env.FROM_EMAIL_ADDRESS,
            to: email,
            subject: "Account Blocked",
            html: template,
        };
    },
};
