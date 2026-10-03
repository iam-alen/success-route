import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import HomePage from './pages/HomePage.jsx'
import CareerAdvice from './pages/CareerAdvice.jsx'
import RoadmapGenerator from './pages/RoadmapGenerator.jsx'
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route path="/roadmap" element={<RoadmapGenerator />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
