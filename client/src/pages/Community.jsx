import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = React.useState([]);
  const { user } = useUser();
  const [loading, setLoading] = React.useState(false);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`, // Get the token from Clerk
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        console.error("Failed to fetch creations");
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
    } finally {
      setLoading(false);
    }
  };

 const imageLikeToggle = async (id) => {
  const prevCreations = [...creations];

  setCreations((prev) =>
    prev.map((post) => {
      if (post.id === id) {
        const alreadyLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter((uid) => uid !== user.id) // remove user
            : [...post.likes, user.id], // add user
        };
      }
      return post;
    })
  );

  try {
    const { data } = await axios.post(
      "/api/user/toggle-like-creations",
      { id },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
      setCreations(prevCreations); // rollback
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    setCreations(prevCreations); // rollback
  }
};



  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]); // Fetch creations when user is available or changes

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold mb-4">Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3  w-full rounded-lg sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 left-3 right-0 top-0 flex gap-2 items-end justify-end  group-hover:justify-between p-3  group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block mb-2">{creation.prompt}</p>

              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
    </div>
  );
};

export default Community;
