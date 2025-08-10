import { Hash, Sparkles } from "lucide-react";
import React from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Finance",
    "Entertainment",
    "Sports",
    "Fashion",
    "Business",
    "Science",
    "Art",
    "Politics",
  ];

  const [selectedCategory, setSelectedCategory] = React.useState(
    blogCategories[0]
  );
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    try {
      setLoading(true);
      const prompt = `Generate blog titles for the topic: ${input} in the category: ${selectedCategory}`;

      const response = await axios.post(
        "/api/ai/generate-blog-title",
        {
          prompt,
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
        toast.error("Failed to generate titles. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while generating titles."
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
          <h1 className="text-xl font-semibold">AI Blog Title Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Keyworld</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter the topic of your article"
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item, index) => (
            <span
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
            >
              {item}
            </span>
          ))}
        </div>

        <br />

        <button
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Hash className="w-5 h-5 " />
          )}
          Generate Article
        </button>
      </form>
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold">Generated Titles</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center text-gray-500 gap-5">
              <Hash className="w-9 h-9" />
              <p className="text-sm text-gray-500">
                This is where the generated titles will appear.
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

export default BlogTitles;
