import { useAppContext } from "../context/appContext"
import StatItem from "./StatItem.js"
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa"
import Wrapper from "../assets/wrappers/StatsContainer"
import ChartsContainer from "./ChartsContainer"

const StatsContainer = () => {
  const { stats } = useAppContext()
  const defaultStats = [
    {
      title: "pending applications",
      count: stats.pending || 0, // just a precaution coz we are sending from sever where we have default pending on
      icon: <FaSuitcaseRolling />,
      color: "#e9b949", // in the button we were adding the classes but here we hardcode the css
      bcg: "#fcefc7",
    },
    {
      title: "interviews scheduled",
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "jobs declined",
      count: stats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ]
  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />
      })}
      <ChartsContainer />
    </Wrapper>
  )
}

export default StatsContainer
