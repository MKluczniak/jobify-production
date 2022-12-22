import React, { useReducer, useContext } from "react" /// co sie stanie jak wywale pierwszy react? sprawdz error
import reducer from "./reducer"
import axios from "axios"
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  // GET_CURRENT_USER_BEGIN,
  // GET_CURRENT_USER_SUCCESS,
} from "./actions"

const token = localStorage.getItem("token")
const user = localStorage.getItem("user")
const userLocation = localStorage.getItem("location")

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: userLocation || "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  jobs: [], //since we are getting this values from the server we are going to update them once we make the req
  totalJobs: 0,
  page: 1,
  numOfPages: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
}

const AppContext = React.createContext()

//when we create context above we have access to the Provider, and Consumer we are going to use only Provider
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // the difference with useReducer is that im not updating the state directly but i CAN access it

  // axios.defaults.headers["Authorization"] = `Bearer ${state.token}` alternative global axios set up (no need ot send the authorization header in every request, but it has a down side if we are trying to hit some external API we will unfortunately send our token) we are going to take one more approach with the authFetch

  const authFetch = axios.create({
    baseURL: "/api/v1/",
    // headers: {
    //   Authorization: `Bearer ${state.token}`,
    // },
  })

  //we can do the same on axios ofc
  // request
  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // response
  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        // console.log("AUTH ERROR")
        logoutUser()
      }

      return Promise.reject(error)
    }
  )

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert()
  }
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 3000)
  }

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
    localStorage.setItem("location", location)
  }

  const RemoveUserFromLocalStorage = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("location")
  }

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN })
    //if there is some kind of error resp. from our server we go straight to the catch
    try {
      // console.log("xxx")
      const response = await axios.post("/api/v1/auth/register", currentUser)
      // console.log(response)
      const { user, token, location } = response.data //im pulling them out bc i already know there was no error
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      })
      addUserToLocalStorage({ user, token, location })
      //local storage
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN })
    //if there is some kind of error resp. from our server we go straight to the catch
    try {
      console.log("xxx")
      const { data } = await axios.post("/api/v1/auth/login", currentUser) //post req going to our back end, there is giant obj. but we only take the 'data'

      const { user, token, location } = data //im pulling them out bc i already know there was no error
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      })
      addUserToLocalStorage({ user, token, location }) //it imp with the page refresh
      //local storage
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert() //(clearing alert after 3 sec)
  }

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER })
    RemoveUserFromLocalStorage()
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })

    try {
      const { data } = await authFetch.patch(
        "/auth/updateUser",
        currentUser
        // {
        //   headers: {
        //     Authorization: `Bearer ${state.token}`,
        //   },
        // }
      )
      // const { data: tours } = await axios.get(
      //   "https://course-api.com/react-tours-project"
      // )
      // console.log(tours)
      const { user, location, token } = data
      console.log(data)
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      })
      addUserToLocalStorage({ user, location, token })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        }) //that's the axios
      }

      // console.log(error.response)
    }
    clearAlert()
  }

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
  }

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.post("/jobs", {
        //we have the interceptor which adds the base url
        position,
        company,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type: CREATE_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return //we return to avoid alert hanging for 3 sec
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state
    let url = `/jobs?page=${page}status=${searchStatus}&jobType${searchType}&sort=${sort}` //you dont have to add page as first
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url) //optionally authFetch.get(url) get is by default
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      // console.log(error.response)
      logoutUser()
    }
  }
  clearAlert() //precaution if there is some alert, hide it coz they could be possibly displayed in another place if moved quickly

  //testing functionality of getJobs() when no component yet set up
  // useEffect(() => {
  //   getJobs()
  // }, [])

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } })
  }
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs() //refreshing the list of jobs
    } catch (error) {
      // console.log(error.response)
      logoutUser()
    }
  }

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })

    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })

      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        //if another error
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch.get("/jobs/stats")
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.defaultStats,
        },
      })
    } catch (error) {
      // console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
      {/* why we use the children becouse that is our application and that what we are rendering ??P */}
    </AppContext.Provider>
  )
} // Like i mentioned first we are lookig for a children bc we are going to render our entire application

const useAppContext = () => {
  return useContext(AppContext)
}

// const useSinus45 = () => {
//   return Math.sin(45)
// }
// {??P}

export { AppProvider, initialState, useAppContext } //and then we want to set up the hook why?? because if your not going to have it hooked thenin every component you will have to do two things, import useContext from react,and you're also going to get  AppcContext, and only then you will have access to whatever you have in the value prop
