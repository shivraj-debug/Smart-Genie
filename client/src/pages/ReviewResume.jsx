import { FileText, Sparkles } from "lucide-react";
import React from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    const formData = new FormData();
    formData.append("resume", input);

    try {
      setLoading(true);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`, // Get the token from Clerk
        },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error("Failed to review resume. Please try again.");
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
          <h1 className="text-xl font-semibold">Resume Review </h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Resume</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports only pdf format
        </p>

        <button
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <FileText className="w-5 h-5 " />
          )}
          Review Resume
        </button>
      </form>
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold">Reviewed Resume</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center text-gray-500 gap-5">
              <FileText className="w-9 h-9" />
              <p className="text-sm text-gray-500">
                upload a pdf and click on review resume for review your resume{" "}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
