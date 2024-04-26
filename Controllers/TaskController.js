const userModel = require('../Schema_Model/users')
const taskModel = require('../Schema_Model/tasks')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')// use to catch the error


//create the task
const CreateTask= asyncHandler(async(req,res)=>{
 
    const {title,description,dueDate,priority,userID}= req.body.taskData

    const existingUser = await userModel.findOne({_id:userID});
  
    if (!existingUser ) {
      return res.status(401).json({ successful: false, error: "Unauthorized" });
    }
  
    const yourTask = await taskModel.create({
        title,
        description,
        dueDate, 
        priority,
        user: existingUser._id 
      });
  
    existingUser.tasks.push(yourTask._id);
    await existingUser.save()

    const authuser = await userModel.findOne({_id:userID}).populate('tasks')
    const allTask=authuser.tasks
    res.status(200).json({success:true,message:"task created",Data:allTask})
  })


 // listing the task
  const TaskListing = asyncHandler(async(req,res)=>{
    const TaskList = await taskModel.find().populate('user')

    res.status(200).json({
      task:TaskList,
      success:true
    })
  })




  //listing the task of auth user
  const AuthUserTaskListing = asyncHandler(async(req,res)=>{
    const UserId  = req.query.userId;

    const existingUser = await userModel.findOne({_id:UserId }).populate('tasks')
    if(!existingUser){
      return res.status(401).json({ successful: false, error: "Unauthorized" });
    }
    const TaskList = existingUser.tasks

    res.status(200).json({
      task:TaskList,
      success:true
    })
  })




//auth user editing the task
  const editTask = asyncHandler(async(req,res)=>{
    const {dateEdit,headingEdit,descriptionEdit,priorityEdit,taskid}=req.body
  
    const checkTask = await taskModel.findOne({_id:taskid})
  
  
   if (!checkTask) {
    return res.status(400).send("task not found");
  }
  
    const updateTask= await taskModel.findByIdAndUpdate(
        taskid,
      {
        $set: {
          title: headingEdit || checkTask.title,
          description: descriptionEdit || checkTask. description,
          dueDate: dateEdit ||checkTask.dueDate, 
          priority:priorityEdit || checkTask.priority
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Successfully edited",
      success: true
    });
  })

  //auth user delete the task
  const deleteTask = asyncHandler(async(req,res)=>{
    const {taskid}=req.body
   
    const checkTask = await taskModel.findOne({_id:taskid})


    if (!checkTask) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const userid = checkTask.user

    const checkUser = await userModel.findOne({_id: userid})


    if(!checkUser){
      return res.status(404).json({ success: false, message: 'user not found' });
    }

    await userModel.updateOne(
      { _id: userid },
      { $pull: { tasks: taskid } }
    );


    await taskModel.deleteOne({ _id: taskid });
  
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  })

  module.exports={
    CreateTask,
    TaskListing,
    editTask,
    deleteTask,
    AuthUserTaskListing
}