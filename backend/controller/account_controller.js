const User = require('../models/User')
const Employee = require('../models/Employee')
const bcrypt = require('bcryptjs');
class AccountController {
    static registration = async (req, res) => {
        const user = new User(req.body)
        delete user.password;
        try {
            await user.save()
            res.status(200).send({
                status: 200,
                message: 'Successfully Registered',
                userData: user
            })
        } catch (error) {
            res.status(400).send({
                status: 400,
                message: error.message
            })
        }
    }
    static genPwd = async (req, res) => {
        try {
            const pwd = await bcrypt.hash(req.params.pwd, 8)
            res.status(200).send({
                status: 200,
                message: 'Successfully Signin',
                data: pwd
            })
        } catch (error) {
            res.status(400).send({
                status: 400,
                message: error.message
            })
        }
    }
    static signin = async (req, res) => {
        try {
            //find the credentials from the database
            const user = await User.findByCredentials(req.body.email, req.body.password)
            //generate a token 
            const token = await user.generateUserToken()
            res.status(200).send({
                status: 200,
                message: 'Successfully Signin',
                data: {
                    token
                }
            })
        } catch (error) {
            res.status(400).send({
                status: 400,
                message: error.message
            })
        }
    }

    static generateUserCredentials= async (req, res) => {
        try {
            const employees = await Employee.find()
            const users = await User.find()
            for(let ix in employees){
                const emp = employees[ix];
                console.log(emp);
                if(users.filter(x=>x.email === emp.email).length === 0){
                    var fC = emp.firstname.substr(0,1).toUpperCase();
                    var lC = emp.lastname.substr(0,1).toUpperCase()
                    var p4 = emp.phonenumber.toString().substr(-4)
                    var dY = emp.dob.getFullYear();
                    var dM = emp.dob.getMonth()+1;
                    dM = dM.toString().length === 1? "0"+dM.toString(): dM.toString();
                    var txtPwd = `${fC}${lC}@${dY}${dM}!${p4}$`;
                    await User.create({email: emp.email, password: txtPwd, is_admin: false, is_active: true, txtPwd});
                }
            }
            res.status(200).send({
                status: 200,
                message: 'Password generated successfully',
            })
        } catch (error) {
            res.status(400).send({
                status: 400,
                message: error.message
            })
        }
    }
}

module.exports = AccountController;