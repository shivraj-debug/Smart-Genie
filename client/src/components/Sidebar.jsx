import { useClerk, useUser,Protect } from "@clerk/clerk-react";
import { Hash, House, SquarePen,Image, Eraser, Scissors, FileText, Users, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const navItems = [
  {to:'/ai',label:'Dashboard',Icon:House},
  {to:'/ai/write-articles',label:'Write Article',Icon:SquarePen},
  {to:'/ai/blog-titles',label:'Blog Titles',Icon:Hash},
  {to:'/ai/generate-images',label:'Generate Images',Icon:Image},
  {to:'/ai/remove-background',label:'Remove Background',Icon:Eraser},
  {to:'/ai/remove-object',label:'Remove Object',Icon:Scissors},
  {to:'/ai/review-resume',label:'Review Resume',Icon:FileText},
  {to:'/ai/community',label:'Community',Icon:Users},
];


  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-16 bottom-0 ${
        isOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User Avatar "
          className="w-13 rounded-full mx-auto cursor-pointer"
        />
        <h2 className="text-center mt-2">
          {user.firstName}
        </h2>

        <div className="px-4 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({to,label,Icon})=>(
            <NavLink key={to} to={to} end={to === '/ai'} onClick={() => setIsOpen(false)} className={({ isActive }) => `px-3 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' :''}`}>
              {({ isActive }) => (
                <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-950' : 'text-gray-500'}`} /> 
                {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

        <div className="w-full border-t border-gray-200 p-5 px-7 flex items-center justify-between">
          <div className="flex gap-2 items-center cursor-pointer" onClick={openUserProfile}>
            <img src={user.imageUrl} alt="User Avatar" className="w-8 rounded-full" />
            <div>
              <h1 className="text-sm font-medium">{user.fullName}</h1>
              <p className="text-xs  text-gray-500">
                 <Protect className="text-gray-500" plan="premium" fallback="free">Premium</Protect>
                 {""} Plan
              </p>
            </div>
          </div>
          <LogOut className="w-5 h-5 text-gray-500 hover:text-gray-700 transition cursor-pointer" onClick={() => signOut()} />
        </div>
      
    </div>
  );
};

export default Sidebar;
