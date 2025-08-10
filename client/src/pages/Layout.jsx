import React from "react";
import { Outlet } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Hash, House, Menu,  SquarePen,  X,Image, Eraser, Scissors, FileText, Users } from "lucide-react";
import { useUser, SignIn } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";


const Layout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();

  return user ? (
    <div className=" flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-16 flex items-center justify-between bg-white shadow-sm">
        <img src={assets.logo} alt="Logo" onClick={() => navigate("/")} className="cursor-pointer rounded-full object-cover w-15" />
        {isOpen ? (
          <X
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setIsOpen(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      <div className="flex-1 w-full flex h-[calc(100vh - 64px)]">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 bg-[#F4F7FB]">
          {/* Main content goes here */}
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <SignIn />
    </div>
  );
};

export default Layout;
