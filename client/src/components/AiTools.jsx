import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="px-10 sm:px-20 xl:px-40 ">
      <div className="text-center">
        <h2 className="text-[42px] text-gray-600 font-semibold ">
          Powerful AI Tools
        </h2>
        <p className=" text-gray-600 mt-4 max-w-xl mx-auto">
            Explore our suite of AI tools designed to help you create, analyze,
        </p>
      </div>
      <div className="flex flex-wrap mt-10 justify-center">
        {AiToolsData.map((tool, index) => (
          <div 
            key={index}
            className="p-10 m-4 max-w-xs rounded-lg shadow-lg cursor-pointer bg-[#FDFDFE] border border-gray-200 hover:-translate-y-2 transition-all duration-300"
            onClick={() => {
              if (user) {
                navigate(tool.path);
              } else {
                navigate("/sign-in");
              }
            }}
          > 
          <tool.Icon className="w-12 h-12 p-3 text-white rounded-xl " style={{background:`linear-gradient(to bottom ,${tool.bg.from},${tool.bg.to})`}} />
     
            <h3 className="text-lg mt-6 mb-3  font-semibold">{tool.title}</h3>
            <p className="text-gray-600 text-sm max-w-[95%]">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
