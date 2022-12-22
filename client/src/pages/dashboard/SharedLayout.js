import { Outlet, Link } from "react-router-dom"

import Wrapper from "../../assets/wrappers/SharedLayout"

import { Navbar, BigSidebar, SmallSidebar } from "../../components"

const SharedLayout = () => {
  return (
    <Wrapper>
      {/* here in the wrapper you have all the css for the dashboard class etc. */}
      <main className="dashboard">
        <SmallSidebar />
        {/* at the end only one will be rendered bc of css in the Wrapper Big/SmallSidbar styled element */}
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
      <nav>{/* in outlet we render all the pages  */}</nav>
    </Wrapper>
  )
}

export default SharedLayout

//Outlet that's where the nested pages will be displayed
