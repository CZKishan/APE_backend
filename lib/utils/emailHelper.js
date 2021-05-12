var nodemailer = require('nodemailer');
const adminEmailId = process.env.email

var transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: "baldev@webcluesinfotech.com", // generated ethereal user
        pass: "baldev#123" // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
})

function sendForgotPasswordLink(user, data) {
    let mailOptions = {
        from: `<${adminEmailId}>`,// sender address
        to: user.user_email, // list of receivers
        subject: `${process.env.appName} - Reset Password`,// Subject line
        // <img src="https://cdn2.iconfinder.com/data/icons/math-numbers-1/24/squared-512.png" height="50" width="50" style="margin-left: 27%;"/>
        html: `<!DOCTYPE html>
        <html lang="en">
        <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> 
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></head><body style="background-color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 16px; color: #000000;font-weight: 400; margin: 0 auto; width: 800px;">
        <table style="width: 800px;" border="0" cellpadding="0" cellspacing="0"> <tbody> <!--middle-body--> <tr> <td> 
        <table style="width: 800px; background-color:#EDF0F3;max-width: 800px;" align="left" border="0" cellpadding="0" cellspacing="0">
        <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 30px;"></td> <td align="left">
        <table style="width: 740px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" >
        <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 20px;"></td> 
        <td align="left"> <table style="width: 700px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" > 
        <tbody> <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 600;padding-bottom: 20px;">You have requested a password reset,</td></tr> <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">please follow the link below to reset your password with,NewsPod.</td></tr> 
        <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 10px;"><a href =${data}> Follow this link to reset your password. </a></td></tr> <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 5px;">Please ignore this email if you did not request a password change.</td></tr>
         <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;">Regards,</td></tr>
          <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;">${process.env.appName} team</td></tr> 
          </tbody> </table> </td> <td style="width: 20px;"></td> </tr>
           <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td> <td style="width: 30px;"></td> </tr> 
           <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td> </tr> </tbody></table></body></html>`
    }
    return new Promise(function (resolve, reject) {
        return transporter.sendMail(mailOptions, (err) => {
            console.log('-------------------------------------er', err)
            return (err) ? reject(err) : resolve(true);
        })
    })
}

function sendUserForgotPassword(user, data) {
    let mailOptions = {
        from: `<${adminEmailId}>`,// sender address
        to: user.user_email, // list of receivers
        subject: `${process.env.appName} - Email Verification request`,// Subject line
        html: `<!DOCTYPE html><html lang="en"><head>
        <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
         <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></head>
         <body style="background-color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 16px; color: #000000;font-weight: 400; margin: 0 auto; width: 800px;">
         <table style="width: 800px;" border="0" cellpadding="0" cellspacing="0"> <tbody> <!--middle-body-->
         <tr> <td> <table style="width: 800px; background-color:#EDF0F3;max-width: 800px;" align="left" border="0" cellpadding="0" cellspacing="0"> 
         <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 30px;"></td> <td align="left"> <table style="width: 740px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" > 
         <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 20px;"></td> <td align="left"> 
         <table style="width: 700px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" >
          <tbody> 
          <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 600;padding-bottom: 20px;">Hello ${user.user_name},</td></tr>
          <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">You have request for email verification,</td></tr>
           <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 10px;">Your OTP is ${data}.</td></tr> 
           <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 5px;">Please ignore this email if you did not request a  request for email verification.</td></tr>
            <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;">Regards,</td></tr>
            <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;"> ${process.env.appName} Team</td></tr> </tbody> </table> 
            </td> <td style="width: 20px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td>
          <td style="width: 30px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td> </tr> </tbody></table></body></html>`



    }
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, (err) => {
            return (err) ? reject(err) : resolve(true);
        })
    })
}


function sendUserAccountGenerate(password, data) {
    let mailOptions = {
        from: `<${adminEmailId}>`,// sender address
        to: data.user_email, // list of receivers
        subject: `${process.env.appName} - Account Creation. `,// Subject line
        // <img src="https://cdn2.iconfinder.com/data/icons/math-numbers-1/24/squared-512.png" height="50" width="50" style="margin-left: 27%;"/>
        html: `<!DOCTYPE html><html lang="en"><head>
        <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
         <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></head>
         <body style="background-color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 16px; color: #000000;font-weight: 400; margin: 0 auto; width: 800px;">
         <table style="width: 800px;" border="0" cellpadding="0" cellspacing="0"> <tbody> <!--middle-body-->
         <tr> <td> <table style="width: 800px; background-color:#EDF0F3;max-width: 800px;" align="left" border="0" cellpadding="0" cellspacing="0"> 
         <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 30px;"></td> <td align="left"> <table style="width: 740px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" > 
         <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 20px;"></td> <td align="left"> 
         <table style="width: 700px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" >
          <tbody> <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 600;padding-bottom: 20px;">"Thanks for joining ${process.env.appName} "</td></tr> 
          <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">Welcome ${data.user_name},</td></tr>
           <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 10px;">We are glad to have you on our platform.</td></tr> 
           <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 5px;">Email : ${data.user_email}</td></tr>
            <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">Password : ${password}</td></tr> 
            <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;">Regards,</td></tr>
            <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;"> ${process.env.appName} Team</td></tr> </tbody> </table> 
            </td> <td style="width: 20px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td>
          <td style="width: 30px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td> </tr> </tbody></table></body></html>`
    };


    return new Promise(function (resolve, reject) {
        return transporter.sendMail(mailOptions, (err) => {
            console.log('-------------------------------------er', err)
            return (err) ? reject(err) : resolve(true);
        })
    })

}


function sendInquiryMail(data) {
    let mailOptions = {
        from: `<${adminEmailId}>`,// sender address
        to: process.env.admin_email,
        subject: `${process.env.appName} - Contact us. `,// Subject line
        // <img src="https://cdn2.iconfinder.com/data/icons/math-numbers-1/24/squared-512.png" height="50" width="50" style="margin-left: 27%;"/>
        html: 
        `<!DOCTYPE html><html lang="en"><head>
                <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                 <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></head>
                 <body style="background-color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 16px; color: #000000;font-weight: 400; margin: 0 auto; width: 800px;">
                 <table style="width: 800px;" border="0" cellpadding="0" cellspacing="0"> <tbody> <!--middle-body-->
                 <tr> <td> <table style="width: 800px; background-color:#EDF0F3;max-width: 800px;" align="left" border="0" cellpadding="0" cellspacing="0"> 
                 <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 30px;"></td> <td align="left"> <table style="width: 740px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" > 
                 <tbody> <tr><td colspan="3" height="30px"></td></tr> <tr> <td style="width: 20px;"></td> <td align="left"> 
                 <table style="width: 700px;background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" >
                  <tbody> 
                  <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 600;padding-bottom: 20px;">Hello sir/madam,</td></tr> 
                  <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">Please Contact,</td></tr>
                   <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 10px;">Name: ${data.contact_user_name}</td></tr>
                   <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 5px;">Email : ${data.contact_user_email}</td></tr>
                   <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">Description : ${data.contact_description}</td></tr>
                   <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;padding-bottom: 20px;">If you have any questions or concerns, please do not hesitate to contact us for more information.</td></tr>
                   <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;">Regards,</td></tr>
                    <tr><td style="font-family: 'Poppins', sans-serif;font-size: 16px;color: #000000;font-weight: 400;"> ${process.env.appName} Team</td></tr>
                    </tbody> </table> 
                    </td> <td style="width: 20px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td>
                  <td style="width: 30px;"></td> </tr> <tr><td colspan="3" height="30px"></td></tr> </tbody> </table> </td> </tr> </tbody></table></body></html>`

    };

    return new Promise(function (resolve, reject) {
        return transporter.sendMail(mailOptions, (err) => {
            console.log('-------------------------------------er', err)
            return (err) ? reject(err) : resolve(true);
        })
    })

}
module.exports = {
    sendForgotPasswordLink,/**for forgot password reset link send to emailId */
    sendUserForgotPassword,

    sendUserAccountGenerate,
    sendInquiryMail
}
