import sql from "../config/db.js";

export  const getUserCreations=async (req, res) => {
  const {userId} = req.auth()

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

  try {

    const creations=await sql `SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`
    
    res.status(200).json({success: true, creations});

  } catch (error) {
    console.error("Error fetching user creations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export  const getPublishedCreations = async (req, res) => {

  try {

    const creations=await sql `SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`
    
    res.status(200).json({success: true, creations});

  } catch (error) {
    console.error("Error fetching user creations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export  const toggleLikeCreations = async (req, res) => {

  try {

    const { userId } = req.auth();
    const {id}=req.body;

    console.log("Toggling like for creation:", id);

    const [creation] = await sql `SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found." });
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;   
    let message;

     // User already liked the creation, so we remove their like
    if(currentLikes.includes(userIdStr)) {
        updatedLikes = currentLikes.filter((user) => user !== userIdStr);
        message = "Creation unliked successfully.";
    }else{
        // User has not liked the creation, so we add their like
        updatedLikes = [...currentLikes, userIdStr];
        message = "Creation liked successfully.";
    }

    const formattedArray=`{${updatedLikes.join(",")}}`;

    await sql `UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
    
    res.status(200).json({success: true, message});

  } catch (error) {
    console.error("Error fetching user creations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}