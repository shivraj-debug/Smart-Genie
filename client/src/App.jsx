import { Routes,Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RemoveBackground from './pages/RemoveBackground.jsx'
import Layout from './pages/Layout.jsx'
import BlogTitles from './pages/BlogTitles.jsx'
import WriteArticles from './pages/WriteArticles.jsx'
import GenerateImage from './pages/GenerateImage.jsx'
import Community from "./pages/Community.jsx"
import RemoveObject from "./pages/RemoveObject.jsx"
import ReviewResume from "./pages/ReviewResume.jsx" 
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import {Toaster} from "react-hot-toast"



function App() {

  // const {getToken} = useAuth();

  // useEffect(()=>{
  //   getToken().then((token)=>{
  //     console.log("Token:", token);
  //   }).catch((error)=>{
  //     console.error("Error fetching token:", error);
  //   })  
  // },[])


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path="blog-titles" element={<BlogTitles />} />
            <Route path="write-articles" element={<WriteArticles />} />
            <Route path="remove-background" element={<RemoveBackground />} />
            <Route path="generate-images" element={<GenerateImage />} />
            <Route path="remove-object" element={<RemoveObject />} />
            <Route path="review-resume" element={<ReviewResume />} />
            <Route path="community" element={<Community />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/remove-background" element={<RemoveBackground />} />  
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

export default App
