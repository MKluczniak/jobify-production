import express from "express"

const router = express.Router()

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController.js"

router.route("/").post(createJob).get(getAllJobs)
router.route("/stats").get(showStats)
router.route("/:id").delete(deleteJob).patch(updateJob)

export default router

//you could add the middleware from 'auth.js' to our routes here but we are going to do it in the server
