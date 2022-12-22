import jwt from "jsonwebtoken"
import { UnAuthenticatedError } from "../errors/index.js"

const auth = async (req, res, next) => {
  const headers = req.headers
  const authHeader = req.headers.authorization
  //   console.log(headers)
  // console.log(authHeader)
  console.log("authenticate user middleware")
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid")
  }
  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { userId: payload.userId } //this one will be on the request obj. and in those controllers example update user we will access it, u can check in the updateUser f. (in appContext) we always have access to the user
    // console.log(payload)

    next() // next() otherwise the user will be hanging
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid")
  }
}

export default auth
