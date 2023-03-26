import db from "../models/index";
import bcrypt from "bcryptjs"
const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}
let userHandleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = "Ok"
                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `User's email not found`
                }

            } else {
                userData.errCode = 1
                userData.errMessage = `Your's email is'nt exists`
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } else {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,

                    // data. (key của state bên react)
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user is'nt exists`
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                message: 'The user deleted!'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.gender || !data.positionId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing param'
                })
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.phoneNumber = data.phoneNumber
                user.positionId = data.positionId
                user.gender = data.gender
                user.roleId = data.roleId

                if (data.avatar) {

                    user.image = data.avatar
                }

                await user.save()
                resolve({
                    errCode: 0,
                    message: 'Update user success!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {

                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    userHandleLogin: userHandleLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,

}