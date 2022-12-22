import logo from "../assets/images/logo.svg"
import main from "../assets/images/main.svg"
import styled from "styled-components"
import { Logo } from "../components" //we intentionally set up the index.js inside components where we import Logo and then name exprt so we have easy access in our componenets, we dont need to import everything in new line

import { Link } from "react-router-dom"

// const Landing = () => {
//   const { user } = useAppContext()
//   return (
//     <React.Fragment>
//       {user && <Navigate to="/" />}
//       <Wrapper>
//         <nav>
//           <Logo />
//         </nav>
//         <div className="container page">
//           {/* info */}
//           <div className="info">
//             <h1>
//               job <span>tracking</span> app
//             </h1>
//             <p>
//               I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
//               bottle single-origin coffee chia. Aesthetic post-ironic venmo,
//               quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
//               narwhal.
//             </p>
//             <Link to="/register" className="btn btn-hero">
//               Login/Register
//             </Link>
//           </div>
//           <img src={main} alt="job hunt" className="img main-img" />
//         </div>
//       </Wrapper>
//     </React.Fragment>
//   )
// }

const Landing = () => {
  return (
    <Wrapper>
      <main>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job
              <span> tracking </span>
              app
            </h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
              commodi voluptas qui ea omnis tenetur magnam voluptatum expedita
              natus? Amet cumque facilis reiciendis mollitia tenetur dolorum
              distinctio veritatis odio delectus?
            </p>
            <Link to="/register" className="btn btn-hero">
              Login Register
            </Link>
          </div>
          <img src={main} alt="job hunt" />
        </div>
      </main>
    </Wrapper>
  )
}

//styled component with just styles
//since im wraping the entire component i call it main

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`

export default Landing
