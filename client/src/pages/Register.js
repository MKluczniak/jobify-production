import { useState, useEffect } from "react"
import Wrapper from "../assets/wrappers/ErrorPage"
import { Logo, FormRow, Alert } from "../components"
import { useAppContext } from "../context/appContext"
import { useNavigate } from "react-router-dom"

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
  // showAlert: true, //just for time beeing
}

const Register = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState)
  //global State and useNavigate

  // const state = useAppContext()
  // console.log(state)
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } =
    useAppContext()

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  // this will fire every time we make some change in inputs, we access values with e obj.
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    // console.log(e.target) //that way we will see which input are we working
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert()
      return
    }
    const currentUser = { name, email, password, isMember }
    if (isMember) {
      loginUser(currentUser)
    } else {
      registerUser(currentUser)
      // console.log(currentUser)
    }
  }

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/")
      }, 3000)
    }
  }, [user, navigate])
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3> {values.isMember ? "Login" : "Register"}</h3>
        {/* below conditionaly if the show then we display <Alert> */}
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          ></FormRow>
        )}

        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        ></FormRow>
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        ></FormRow>
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit{" "}
        </button>
        <p>
          {!values.isMember ? "Not a member yet?  " : "Already a member?   "}
          <button type="button" onClick={toggleMember} className="member-btn">
            {!values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}

export default Register
