import { useState } from "react"
import { FormRow, Alert } from "../../components"
import { useAppContext } from "../../context/appContext"
import Wrapper from "../../assets/wrappers/DashboardFormPage"

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext()

  const [name, setName] = useState(user?.name) // all the props are on our user obj.
  const [email, setEmail] = useState(user?.email)
  const [lastName, setLastName] = useState(user?.lastName)
  const [location, setLocation] = useState(user?.location)

  const handleSubmit = (e) => {
    e.preventDefault()
    //remove while testing, bc we cant display errors if the check is here(on the front end)
    if (!name || !email || !lastName || !location) {
      displayAlert()
      return //return bc we dont want to run our update user
    }
    updateUser({ name, email, lastName, location })
  }

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="Your name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          ></FormRow>
          <FormRow
            type="text"
            labelText="Your last name"
            name="lastName"
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
          ></FormRow>
          <FormRow
            type="text"
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          ></FormRow>
          <FormRow
            type="text"
            name="Your location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait... " : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile
