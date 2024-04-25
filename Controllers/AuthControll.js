const userModel = require('../Schema_Model/users')
const taskModel = require('../Schema_Model/tasks')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')// use to catch the error
const bcrypt = require("bcrypt"); 

// user signup controller
const userSignUp = asyncHandler(async (req, res) => {
    console.log("we are in usersign up page")
    const { formData } = req.body;
    const { username,  password, role } = formData;
    
    const existingUser = await userModel.findOne({ username: username });
    console.log(existingUser);

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new userModel({
        username,
        password,
        role,
    });

    const userSave = await newUser.save();

    res.status(200).json({
        success: true,
        user: userSave,
        message:"user created successfully"
    });
});

const userLogin = asyncHandler(async(req,res)=>{
    const { formData } = req.body;
    const {  username, password} = formData;
    const existinguser = await userModel.findOne({username:username});
        console.log(existinguser);
        if (!existinguser) {
            return res.status(400).json({message:"user not exist"})
        }

        const result = await bcrypt.compare(password,existinguser.password)
        if (!result) {
            res.status(401).json({
                success:false,
                message:"password is failed"
            })
        }
    const userName = existinguser.username
    console.log("userid is :-",userName)
    
    
        const aboutUser = jwt.sign({userName},process.env.secreteKey)
        console.log(aboutUser)
        res.cookie("userToken", aboutUser); 

        res.status(200).json({message:"login successfull",success:true, Data:existinguser})
})


const userAccess = asyncHandler(async(req,res)=>{
    console.log(req.query)
    const UserId  = req.query.userId;
    console.log(UserId )
    const existingUser = await userModel.findOne({username:UserId })
  
    if (!existingUser ) {
      return res.status(401).json({ successful: false, error: "Unauthorized" });
    }
  
    console.log(existingUser)
    res.status(200).json({
      Data: existingUser,
      success: true
    });
})

module.exports={
    userSignUp,
    userLogin,
    userAccess
}