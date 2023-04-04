import doctorService from "../services/doctorService";

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;

    try {
        let response = await doctorService.getTopDoctorService(+limit);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }

}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService()
        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })

    }
}

let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctorsService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })

    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorByIdService(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getProfileInforDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getProfileInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let response = await doctorService.getListPatientService(req.query.doctorId, req.query.date);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedyService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctors: getAllDoctors,
    postInforDoctors: postInforDoctors,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileInforDoctorById: getProfileInforDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}