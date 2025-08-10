import React from "react";
import { Sparkles, Image } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Set the base URL for axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {
  const imageStyle = [
    "Realistic",
    "Cartoon",
    "Abstract",
    "Surreal",
    "Minimalist",
    "Vintage",
    "Futuristic",
    "Fantasy",
    "Gibberish",
  ];

  const [selectedImageStyle, setSelectedImageStyle] = React.useState(
    imageStyle[0]
  );
  const [input, setInput] = React.useState("");
  const [publish, setPublish] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here

    try {
      setLoading(true);

      const prompt = `Generate an image with the following description: ${input} in the style of ${selectedImageStyle}`;

      const response = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Get the token from Clerk
          },
        }
      );

      if (response.data.success) {
        setContent(response.data.content);
      } else {
        toast.error("Failed to generate image. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while generating the image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe your Image</p>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          row={4}
          placeholder="Describe which type of image you want to generate"
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle.map((item, index) => (
            <span
              onClick={() => setSelectedImageStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedImageStyle === item
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition">
              {" "}
            </div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Publish this image to the community gallery</p>
        </div>

        <br />

        <button
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Image className="w-5 h-5 " />
          )}
          Generate Image
        </button>
      </form>
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center text-gray-500 gap-5">
              <Image className="w-9 h-9" />
              <p className="text-sm text-gray-500">
                This is where the generated titles will appear.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="">
               <img src={content} alt={prompt} className="w-full h-auto rounded-lg shadow-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImage;
