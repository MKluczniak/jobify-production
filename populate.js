import { readFile } from "fs/promises" //"fs" by default we get the one that returns a callback, we want promise

import dotenv from "dotenv"
dotenv.config() //??

import connectDB from "./db/connect.js"
import Job from "./models/Job.js"

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Job.deleteMany() //delete all the jobs in the database
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    )
    await Job.create(jsonProducts)
    console.log("Success!!!")
    process.exit(0) //if you ever want to exit program you can go with process.exit(0) or process.exit(1) 0 means success and 1 means failure
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
