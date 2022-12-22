import Job from "../models/Job.js"

import { StatusCodes } from "http-status-codes"

import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js"
import checkPermissions from "../utils/checkPermissions.js"
import mongoose from "mongoose"
import moment from "moment"

const createJob = async (req, res) => {
  const { position, company } = req.body
  if (!position || !company) {
    throw new BadRequestError("Please provide all values")
  }
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

//"since our requests are going thru the middleware there is going to be the user, middleware coz middleware wont let it go through if no user  "
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query
  const queryObject = { createdBy: req.user.userId }
  //add stuff based on condition
  console.log(queryObject)
  //the reason we cant see them on the front end is that for the time being when we dont have the f. getjobs the are undefined  status && status !== "all" can temporarily fix it ??P
  if (status && status !== "all") {
    queryObject.status = status
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" } // the mango syntax for searching with out an exact match "i"case insensitive 'we are looking for positions where that text matches in general
  }

  //NO AWAIT
  let result = Job.find(queryObject) // gonna give us all jobs user created

  //chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt")
  }
  if (sort === "oldest") {
    result = result.sort("createdAt")
  }
  if (sort === "a-z") {
    result = result.sort("-position")
  }
  if (sort === "z-a") {
    result = result.sort("-position")
  }

  //pagination
  const page = Number(req.query.page) || 1 // you can ofc destructure/pull out out to the separate variable
  const limit = Number(req.query.limit) || 10

  const skip = (page - 1) * limit // we subtract 1 from whatever is the page and multiply by limit on our page

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)

  const numOfPages = Math.ceil(totalJobs / limit)

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: totalJobs, numOfPages: numOfPages })
}

const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  const { position, company } = req.body // you can check for more values but it is just another precaution anyway, and our front is set up like that they will all come in to us

  if (!position || !company) {
    throw new BadRequestError("Please provide all values")
  }

  const job = await Job.findOne({ _id: jobId }) // we are gonna find the job by id and the user who created it

  // in case some bug and job doesnt exist
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`)
  }

  //check permissions
  // req.user.userId is coming with our authentication middleware ??
  //req.user.userId (string) === job.createdBy (Object))
  // console.log(typeof job.createdBy)
  // console.log(typeof req.user.userId);

  // checkPermissions(req.user, job.createdBy)

  //will let the empty value go through but if status not inlin with enum it will throw error
  //validators will run only on the values we provide in req.body, those we dont provide wont be takie into cosnideration
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  })
  // also findOneAndUpdate will NOT trigger the hook in our model( we dont have it we have in the user model) but if we would have it we would go withe the await job.save() method

  res.status(StatusCodes.OK).json({ updatedJob })
}
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params

  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`)
  }
  //same as in updateJob if you are logged in as another user you cant delete your job even you know the id
  checkPermissions(req.user, job.createdBy)

  await job.remove()
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" }) //just for postman
}

//first i wanna get all the jobs that belong to the certain user, then group them by status and then sort them
//&match is equal to an obj., then chose the property we want to match, in our case it is createdBy, then we want to match it with the user id (we already have it in req.user.userId) but i is a string and we need to convert it to an object id
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    //each step is going to be represented as an obj.
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, //get me all the jobs that belong to the user anna, etc. //we need to import mongoose
    //grouping by status our results, we go with $group operator (that's the syntax) as you setting up the steps in the agregation pipeline you need to go with ',' and then go with next obj
    { $group: { _id: "$status", count: { $sum: 1 } } },
    //we are accessing status prop value, then we come up with another property we place in the obj. "count"
  ])
  //aggreagtion pipline above we grab the jobs for the certain user and then we group them by status and then we count them

  //we manipulate the data so we return it in the way we want

  // in reduce we are going to iteratoe over the array and we are going to return an obj. ...{})""

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr //thats comming from each currnet item
    acc[title] = count //no we dynamically set up one obj.
    return acc // always return the acc otherwise it will be undefined!!1 (working with reduce)
  }, {})
  //acc is the obj. we are returning and curr is the current item

  //default values so the front end will not crash,we could do that on a front end but here seams to be safer

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ])
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y")
      return { date, count }
    })
    .reverse()
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }

//we have that middleware that passes the req.user to us??
