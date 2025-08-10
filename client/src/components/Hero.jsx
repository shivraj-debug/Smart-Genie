import React from "react";
import { useNavigate } from "react-router-dom";
import {assets} from "../assets/assets";

function Hero() {
  const navigate=useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center min-h-screen  bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat ">
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl  font-semibold max-auto leading-[1.2] text-center">
          With <span className="font-bold text-blue-500">AI Tools</span> create
          amazing content <br /> in minutes
        </h1>
        <p className="max-w-xs sm:max-w-sm md:max-w-md 2xl:max-w-3xl text-center mt-4 text-gray-600 m-auto">
          Transform your ideas into reality with our AI-powered tools. Whether
          you're a content creator, marketer, or business owner, our platform
          helps you generate high-quality content quickly and efficiently.
        </p>

        <div className="gap-4 mr-15 flex flex-col sm:flex-row justify-center items-center mt-3">
          <button onClick={() => navigate("/ai")} className="bg-blue-500 text-white px-6 py-3 rounded-full mt-6 hover:bg-blue-600 transition cursor-pointer duration-300">
            Start creating now
          </button>

          <button className="bg-blue-500 text-white px-6 py-3 rounded-full mt-6 hover:bg-blue-600 transition cursor-pointer  duration-300">
            Watch Demo
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-8 text-gray-600">
          <img
            src={assets.user_group}
            alt="Hero"
            className="w-30 h-12 rounded-full "
          />
          Trusted by over 1000+ users
        </div>
      </div>
    </div>
  );
}

export default Hero;
