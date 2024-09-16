const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "Password"')
            }
        }

    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
const bcrypt = require('bcryptjs');
// This function will be called before user object get saved in the Users collection. It will simply hash the plain text passord if it is modified by the user.
adminSchema.pre('save', async function (next) {
    const admin = this
    // It will check if the password is being modified or not.
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})
const jwt = require('jsonwebtoken')
adminSchema.methods.generateAdminToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString(), email: admin.email, firstName: admin.firstName,lastName: admin.lastName ,phoneNumber: admin.phoneNumber}, 'thesecretcode');
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email:email })
    if (!admin) {
        throw new Error('Unable to Signin1')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        throw new Error('Unable to Signin:2')
    }
    return admin
}
const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin