import { UnAuthenticatedError } from "../errors/index.js"

const checkPermissions = (requestUser, resourceUserId) => {
  // if (requestUser.role === 'admin') return //we proceed
  if (requestUser.userId === resourceUserId.toString()) return //we proceed (and someone who is authorized but isnt the user, or the addmin cant edit job anymore)

  throw new UnAuthenticatedError("You are not authorized to access this route")
}

export default checkPermissions
