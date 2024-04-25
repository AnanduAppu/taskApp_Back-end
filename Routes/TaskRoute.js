const express = require('express');
const router = express();
const taskControl = require('../Controllers/TaskController')

router.route("/createtask").post(taskControl.CreateTask);
router.route("/edittask").put(taskControl.editTask);
router.route("/deletetask").delete(taskControl.deleteTask);
router.route("/taskaccess").get(taskControl.TaskListing);

module.exports = router;