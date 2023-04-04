require('dotenv').config()
import nodemailer from "nodemailer";

let testSendEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Haruto Đẹp Trai 😎" <leduyphuong3012@gmail.com>', // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "THÔNG TIN ĐẶT LỊCH KHÁM BỆNH", // Subject line
        html: getBodyHTMLEmail(dataSend)


        ,
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn đã đặt lịch online thành công trên website Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div>Bác sĩ: <b> ${dataSend.doctorName}</b></div>
        <div>Thời gian: <b> ${dataSend.time}</b></div>
        <div>Địa chỉ phòng khám: <b> ${dataSend.address}</b></div>
        <i>Nếu thông tin trên là đúng sự thật. Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</i>
        <div>
        <a href=${dataSend.redirectLink} target="_blank"> Click here </a>
        </div>
        <div>Xin cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You have booked succeed an appointment on Booking Care website</p>
        <p>Booking Appointment Information: </p>
        <div>Doctor: <b> ${dataSend.doctorName}</b></div>
        <div>Time: <b> ${dataSend.time}</b></div>
        <div>Clinic's address: <b> ${dataSend.address}</b></div>
        <i>If the above information is true. Please click on the link below to confirm and complete the procedure to book an appointment</i>
        <div>
        <a href=${dataSend.redirectLink} target="_blank"> Click here </a>
        </div>
        <div>Best regards!</div>
        `
    }

    return result
}

let sendAttachment = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Haruto Đẹp Trai 😎" <leduyphuong3012@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "KẾT QUẢ ĐẶT LỊCH KHÁM BỆNH", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]


        ,
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã khám bệnh thành công thông qua Booking Care</p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm: </p>
        <div>Xin cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You have received this email because you completed medical examination through Booking Care website</p>
        <p>Prescription/invoice information is sent in the attached file: </p>
        <div>Best regards!</div>
        `
    }

    return result
}


module.exports = {
    testSendEmail, sendAttachment
}