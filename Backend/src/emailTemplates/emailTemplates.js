// <!-- REGISTRATION SUCCESSFULL -->
const REGISTRATION_SUCCESSFULL=
` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verified – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .content {
          padding: 16px !important;
        }
        .btn {
          padding: 10px 16px !important;
          font-size: 14px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 400px;
      margin: 0 auto;
      padding: 40px;
      background: url('../navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 24px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Registration Successful 
      </h1>
    </div>

    <div
      class="content"
      style="
        background-color: #ffffffee;
        padding: 34px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      "
    >
      <p>Hi there,</p>
      <p>
       Your account has been successfully verified.
Thank you for your patience and welcome aboard!
        <strong style="color: rgb(220, 220, 40);">My <span style="color: black;">Startup</span> NEWS</strong>.
      </p>
      
      

      <p>
        Need assistance? Feel free to reach out at
        <a href="mailto:support@omsheel.com" style="color: rgb(206, 206, 33);">support@MyStartupNEWS</a>.
      </p>

      <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong>MyStartup NEWS</strong>
      </p>
      <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from MyStartup NEWS Please do not reply.</p>
    </div>
    </div>

  </body>
</html> `
// <!-- EMAIL VERIFICATION -->
const EMAIL_VERIFICATION=
 ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .code-box {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 500px;
      margin: 0 auto;
      padding: 30px;
      background: url('./navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      class="header"
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 18px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Let’s Get You Verified 
      </h1>
    </div>

    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
        Welcome to <strong>MyStartupNEWS</strong> — we’re excited to have you on board.
      </p>
      <p>
        To activate your account  please verify your email address using the code below:
      </p>

      <div
        class="code-box"
        style="
          text-align: center;
          margin: 30px 0;
          padding: 15px;
          border-radius: 8px;
          background: linear-gradient(to right, yellow, black);
          color: white;
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 6px;
        "
      >
        {verificationcode}
      </div>

      <p>
        This code is valid for <strong>5 minutes </strong>. If it expires,
        you can request a new one anytime.
      </p>
      <p>
        Didn’t sign up with us? No problem — just ignore this message and we’ll take care of the rest.
      </p>

      <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong>The MyStartupNEWS Team</strong>
      </p>
    </div>

    <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from Omsheel Group. Please do not reply.</p>
    </div>
  </body>
</html>  `
// <!-- ACCOUNT APPROVED SUCCESSFULLY -->
const ACCOUNT_APPROVED_SUCCESSFULLY=
` <!DOCTYPE html>


<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .code-box {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 400px;
      margin: 0 auto;
      padding: 30px;
      background: url('./navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      class="header"
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 18px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Let’s Get You Verified 
      </h1>
    </div>

    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
        Welcome to <strong>MyStartupNEWS</strong> — we’re excited to have you on board.
      </p>
      <p>
We’re happy to inform you that your account has been successfully approved       
      </p>
<p>You can now log in and start using all the features available to you.

</p>
<p>Start submitting articles and news stories right away.</p>
<p>
   Earn recognition, grow your profile, and reach a wider audience.


</p>
<p>
  You can now log in and access your personalized writer dashboard
</p>
    <p>
      Welcome to the platform — we’re excited to see your contributions!
    </p>
     <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong> MyStartupNEWS Team</strong>
      </p>
    </div>

    <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from Omsheel Group. Please do not reply.</p>
    </div>
      </div>

    
      

  </body>
</html> `
// <!-- ACCOUNT REJECTED -->
const ACCOUNT_REJECTED=
 ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .code-box {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 400px;
      margin: 0 auto;
      padding: 30px;
      background: url('./navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      class="header"
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 18px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Let’s Get You Verified 
      </h1>
    </div>

    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
        Welcome to <strong style="color: rgb(202, 202, 57);">MyStartup <span style="color: black;">NEWS</span></strong>— we're excited to have you here and truly appreciate your interest in joining our platform.
</p>
      </p>
      <p>
        We regret to inform you that your account has not been approved at this time.



      </p>
<p>We appreciate your interest and the effort you put into your application. While we’re unable to move forward right now, we encourage you to stay connected and consider reapplying in the future as opportunities evolve.
</p>
     <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong> MyStartupNEWS Team</strong>
      </p>
    </div>

    <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from Omsheel Group. Please do not reply.</p>
    </div>
      </div>

    
      

  </body>
</html>`
 
// <!-- BLOG APPROVED SUCCESSFULLY -->
const BLOG_APPPROVED_SUCCESSFULLY=
 ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .code-box {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 400px;
      margin: 0 auto;
      padding: 30px;
      background: url('./navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      class="header"
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 18px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Let’s Get You Verified 
      </h1>
    </div>

    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
        This is a message from <strong>MyStartupNEWS</strong> 
      </p>
    
<p>
  We’re happy to inform you that your new blog has been <strong>successfully approved</strong>!
</p>
<p>
  It’s now live and ready to reach our community. Thank you for sharing your voice with <strong>MyStartupNEWS</strong>.
</p>
<p>
  Keep writing, keep inspiring — we’re excited to see what you create next!
</p>

     <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong> MyStartupNEWS Team</strong>
      </p>
    </div>

    <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from Omsheel Group. Please do not reply.</p>
    </div>
      </div>

    
      

  </body>
</html>   
`
// <!-- BLOG REJECTED -->
const BLOG_REJECTED=
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email – Omsheel Group</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 180px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .code-box {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
        .footer {
          font-size: 0.75em !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 400px;
      margin: 0 auto;
      padding: 30px;
      background: url('./navLogo.png') center center no-repeat;
      background-size: 300px;
    "
  >
    <div
      class="header"
      style="
        background: linear-gradient(135deg, yellow, black);
        padding: 18px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Let’s Get You Verified 
      </h1>
    </div>

    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
  This is a message from <strong>MyStartupNEWS</strong> to inform you that your recent blog submission has <strong>not been approved</strong> at this time.
</p>
<p>
  We appreciate the time and effort you put into your submission. However, it did not meet some of our publishing guidelines.
</p>
<p>
  You’re welcome to review our content standards and submit again. We look forward to seeing more from you in the future.
</p>
<p>
  Thank you for being a part of the <strong>MyStartupNEWS</strong> community.
</p>


     <p style="margin-bottom: 0;">
        With appreciation,<br />
        <strong> MyStartupNEWS Team</strong>
      </p>
    </div>

    <div
      class="footer"
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>This is an automated message from Omsheel Group. Please do not reply.</p>
    </div>
      </div>

    
      

  </body>
</html>  `



// <!-- FEEDBACK SUBMISSION -->
const FEEDBACK_SUBMISSION=
    ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title></title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: #111; /* Dark background */
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background: #000; /* Black background */
      background-image: url('./Omsheel-wb.png'); /* Replace with correct path or full URL */
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 280px;
      box-shadow: 0 2px 8px rgba(255, 255, 0, 0.2);
      border-radius: 10px;
      color: #facc15; /* Yellow text */
    }

    .header {
      background: linear-gradient(135deg, #facc15, #eab308); /* Yellow gradient */
      padding: 24px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }

    .header h2 {
      color: #000;
      margin: 0;
      font-size: 22px;
      font-weight: bold;
    }

    .details {
      padding: 24px;
      background-color: rgba(0, 0, 0, 0.85);
      border-radius: 0 0 10px 10px;
      backdrop-filter: blur(3px);
    }

    .details p {
      font-size: 16px;
      margin: 12px 0;
      color: #fefce8; /* Off-white for readability */
    }

    .details strong {
      color: #facc15; /* Highlighted yellow for labels */
    }

    .footer-note {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 20px;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 16px;
      }
      .header h2 {
        font-size: 18px;
      }
      .details p {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>One FeedBack Received from MyStartupNEWS</h2>
    </div>

    <div class="details">
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong> Location:</strong> {location}</p>
      <p><strong> FeedBack:</strong> {feedBack}</p>
      <p>
  📩 Your feedback has been recorded via 
  <strong style="color:#facc15;">MyStartup<span style="color:white;">NEWS</span></strong>.  
  Thank you for helping us improve.
</p>

    </div>

    <div class="footer-note">
      <p>Internal Notification – MyStartupNEWS</p>
    </div>
  </div>
</body>
</html> `



const PASSWORD_RESET_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Code – MyStartupNEWS</title>
  <style>
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px !important;
        background-size: 180px !important;
      }
      .content {
        padding: 16px !important;
      }
      .code {
        font-size: 28px !important;
        letter-spacing: 4px !important;
      }
      .footer {
        font-size: 0.75em !important;
      }
    }
  </style>
</head>
<body
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #222;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: url('../navLogo.png') center center no-repeat;
    background-size: 280px;
  "
>
  <!-- Header -->
  <div
    style="
      background: linear-gradient(135deg, #000000, #facc15);
      padding: 24px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    "
  >
    <h1 style="color: white; margin: 0; font-size: 24px;">
      Password Reset Request
    </h1>
  </div>

  <!-- Body -->
  <div
    class="content"
    style="
      background-color: #ffffffee;
      padding: 24px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    "
  >
    <p>Hello,</p>
    <p>We received a request to reset your password for your <strong>MyStartupNEWS</strong> account.</p>
    <p>Please use the verification code below to reset your password:</p>

    <div
      class="code"
      style="
        text-align: center;
        margin: 30px 0;
        padding: 16px;
        background: linear-gradient(to right, #000000, #facc15);
        color: white;
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 8px;
        border-radius: 8px;
      "
    >
      {resetCode}
    </div>

    <p>This code is valid for <strong>1 minute</strong>. If you didn’t request a password reset, you can safely ignore this message.</p>

    <p style="margin-bottom: 0;">
      Stay secure,<br />
      <strong>The MyStartupNEWS Security Team</strong>
    </p>
  </div>

  <!-- Footer -->
  <div
    class="footer"
    style="
      text-align: center;
      margin-top: 25px;
      font-size: 0.8em;
      color: #666;
    "
  >
    <p>This is an automated message from <strong>MyStartupNEWS</strong>. Please do not reply.</p>
  </div>
</body>
</html>
`

const PASSWORD_RESET_SUCCESS_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Successful – MyStartupNEWS</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
          background-size: 200px !important;
        }
        .container {
          padding: 16px !important;
        }
        .header h1 {
          font-size: 20px !important;
        }
        .info-box {
          font-size: 14px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: url('../navLogo.png') center center no-repeat;
      background-size: 280px;
    "
  >
    <!-- Header -->
    <div
      class="header"
      style="
        background: linear-gradient(135deg, #000000, #facc15);
        padding: 24px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px;">
        Password Updated Successfully 🔐
      </h1>
    </div>

    <!-- Body -->
    <div
      class="container"
      style="
        background-color: #ffffffdd;
        padding: 24px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p style="margin-top: 0;">Hi there,</p>
      <p>
        This is a quick confirmation that your password for
        <strong>MyStartupNEWS</strong> was successfully changed.
      </p>
      <p>
        <strong>Didn't request this change?</strong> Please reset your password
        immediately and contact our support team.
      </p>

      <p style="margin-bottom: 0;">
        Stay safe,<br />
        <strong>The MyStartupNEWS Security Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div
      style="
        text-align: center;
        margin-top: 25px;
        font-size: 0.8em;
        color: #999;
      "
    >
      <p>
        This is an automated message from <strong>MyStartupNEWS</strong>.
        Please do not reply.
      </p>
    </div>
  </body>
</html>
`
module.exports={REGISTRATION_SUCCESSFULL,EMAIL_VERIFICATION,BLOG_APPPROVED_SUCCESSFULLY,BLOG_REJECTED,ACCOUNT_APPROVED_SUCCESSFULLY,ACCOUNT_REJECTED,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE}