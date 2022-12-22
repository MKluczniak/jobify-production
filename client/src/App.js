import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Landing, Error, Register, ProtectedRoute } from "./pages"

import {
  AddJob,
  AllJobs,
  Stats,
  Profile,
  SharedLayout,
} from "./pages/dashboard" //bc we have index no need for more specific path

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route
          path="/landing"
          element={
            <div>
              <Landing></Landing>
            </div>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
