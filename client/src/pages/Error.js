import img from "../assets/images/not-found.svg"
import { Link } from "react-router-dom"
import Wrapper from "../assets/wrappers/ErrorPage.js"

const Error = () => {
  return (
    <Wrapper>
      <div>
        <img src={img} alt="not found" />
        <h3>Ups! Page not found</h3>

        <Link to="/">Go Back Home Page</Link>
      </div>
    </Wrapper>
  )
}

export default Error
