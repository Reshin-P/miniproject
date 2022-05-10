import asyncHandler from 'express-async-handler'
import User from '../DatabaseModel/UserModel.js';
import generateToken from '../util/JWT.js'


//@desc  Register-user
//@route POST /api/user/
//@access Public

const registerUser = asyncHandler(async (req, res) => {

    const exist = await User.exists({ email: req.body.email })
    if (exist) {

        res.status(400)
        throw new Error('Email Id already Used')
    }
    else {

        const user = User.create({
            name: req.body.name,
            mob: req.body.mob,
            email: req.body.email,
            password: req.body.password
        })

        res.status(200).json(user)
    }
})



//@desc  login-user
//@route POST /api/user/login
//@access Public

const authUser = asyncHandler(async (req, res) => {
    console.log("auth user");
    console.log(req.body)

    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email: email })
    console.log(user);
    if (user && (await user.matchPassword(password))) {


        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mob: user.mob,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("invalid email or password")
    }
})

export {
    authUser,
    registerUser
}