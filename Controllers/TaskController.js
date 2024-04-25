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
    
    res.status(200).json({success:true,message:"task created",data:yourTask})
  })


 // listing the task
  const TaskListing = asyncHandler(async(req,res)=>{
    const TaskList = await taskModel.find().populate('user')

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

    await taskModel.deleteOne({ _id: taskid });
  
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  })

  module.exports={
    CreateTask,
    TaskListing,
    editTask,
    deleteTask
}