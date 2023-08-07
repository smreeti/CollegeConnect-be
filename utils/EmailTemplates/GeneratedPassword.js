require("dotenv").config();

module.exports = {
  generatePasswordEmail: (username, email, token, generatedPassword) => {
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
                                    margin-bottom: 20px;
                                }
                                
                                a {
                                    color: #ffffff !important;
                                    background-color: #007bff;
                                    text-decoration: none;
                                    padding: 10px 20px;
                                    border-radius: 4px;
                                }
                                
                                a:hover {
                                    background-color: #0056b3;
                                    cursor: pointer;
                                }

                                .reset-button{
                                    text-align: center;
                                    margin: 35px auto;
                                }

                                .reset-button a{
                                    color: white !important;
                                }
                        </style>
                        </head>
                            
                        <body>
                            <div className="container">
                                <h1>Password Reset Request</h1>
                                <p>Dear ${username},</p>
                                <p>Find below your temporary password:</p>
                                <h3 className="bold">${generatedPassword}</h3>
                                </br>
                                <p>Do not share this code with anyone</p>
                                
                                <p>If you did not request a password reset, please ignore this email. Your account is still secure.</p>
                                <p>Thank you,</p>
                                <p>College Connect Team</p>
                            </div>
                        </body>
                        </html>
              `;
    return {
      from: process.env.FROM_EMAIL_ADDRESS,
      to: email,
      subject: "Generated Password",
      html: template,
    };
  },
};
