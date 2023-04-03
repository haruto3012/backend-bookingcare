import db from "../models/index"
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = '';

    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result
}
let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {

                let token = uuidv4()

                await emailService.testSendEmail({
                    receiversEmail: data.email,
                    patientName: data.fullName,
                    doctorName: data.doctorName,
                    time: data.timeString,
                    address: data.addressClinic,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                    language: data.language
                })
                //upert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    default: {
                        email: data.email,
                        roleId: 'R3'
                    },
                    raw: false
                })
                //create booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }

                resolve({
                    errCode: 0,
                    message: 'Booking Appointment Succeed!',
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let apm = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (apm) {
                    apm.statusId = 'S2'
                    await apm.save()
                    resolve({
                        errCode: 0,
                        message: "Update the appointment succeed!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        ereMmessage: "Appointment has been activated or does not exist"
                    })
                }
            }


        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointmentService,
    postVerifyBookAppointmentService
}