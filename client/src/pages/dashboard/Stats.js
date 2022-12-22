import { useEffect } from "react"
import { useAppContext } from "../../context/appContext"
import { StatsContainer, Loading, ChartsContainer } from "../../components"

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext()

  useEffect(() => {
    showStats()
  }, [])

  if (isLoading) {
    return <Loading center />
  }
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
      {/* && 'only then' we want to display charts container */}
    </>
  )
}

export default Stats
