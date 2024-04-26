const userModel = require('../Schema_Model/users')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')// use to catch the error
const bcrypt = require("bcrypt"); 

// user signup controller
const userSignUp = asyncHandler(async (req, res) => {
   
    const { formData } = req.body;
    const { username,  password, role } = formData;
    
    const existingUser = await userModel.findOne({ username: username });
  

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



//user login controller
const userLogin = asyncHandler(async(req,res)=>{
    const { formData } = req.body;
    const {  username, password} = formData;
    const existinguser = await userModel.findOne({username:username});
    
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
        const userID = existinguser._id
 
    
    
        const aboutUser = jwt.sign({userID},process.env.secreteKey)
    
        res.cookie("userToken", aboutUser); 

        res.status(200).json({message:"login successfull",success:true, Data:existinguser})
})

// accessing logged user data
const userAccess = asyncHandler(async(req,res)=>{

    const UserId  = req.query.userId;

    const existingUser = await userModel.findOne({_id:UserId })
  
    if (!existingUser ) {
      return res.status(401).json({ successful: false, error: "Unauthorized" });
    }
  
   
    res.status(200).json({
      Data: existingUser,
      success: true
    });
})


// get all users datas to see auth user
const AllNormalusers = asyncHandler(async(req,res)=>{
 
    const normalUsers = await userModel.find({ role: 'user' });
       
        res.status(200).json({ success: true, users: normalUsers });
})

module.exports={
    userSignUp,
    userLogin,
    userAccess,
    AllNormalusers
}