import db from "../models/index"
let createNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64,
                })
            }

            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                message: 'OK',
                data
            })
        } catch (e) {
            reject(e)

        }
    })
}

let getDetailClinicByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let data = {}
                data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address']
                })

                if (data) {
                    let doctorCli = [];
                    doctorCli = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes: ['doctorId', 'clinicId']
                    }
                    )
                    data.doctorClinic = doctorCli
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data
                })
            }
        } catch (e) {
            reject(e)

        }
    })
}

module.exports = {
    createNewClinicService, getAllClinicService, getDetailClinicByIdService
}
