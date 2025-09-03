import { Scissors, Sparkles } from "lucide-react";
import React from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = React.useState("");
  const [object, setObject] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        toast.error("Please enter a single word for the object to remove.");
        return;
      }

      const formdata = new FormData();
      formdata.append("image", input);
      formdata.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Get the token from Clerk
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error("Failed to remove object. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while processing your request."
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
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          row={4}
          placeholder="Describe which type of image you want to generate"
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Scissors className="w-5 h-5 " />
          )}
          Remove object
        </button>
      </form>
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center text-gray-500 gap-5">
            <Scissors className="w-9 h-9" />
            <p className="text-sm text-gray-500">
              upload an image and click to remove object for process
            </p>
          </div>
        </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <img src={content} alt="Processed" className="w-full h-auto" />
          </div>
        )}

      </div>
    </div>
  );
};

export default RemoveObject;
