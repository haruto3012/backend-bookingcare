import patientService from "../services/patientService"

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointmentService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postVerifyBookAppointmentService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
}