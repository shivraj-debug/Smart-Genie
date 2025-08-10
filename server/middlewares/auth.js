// middleware to check user_id and haspremiumplan

import { clerkClient } from "@clerk/express";

export const auth=async (req,res,next)=>{
     try{
        const { userId, has } =await req.auth();

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const hasPremiumPlan = await has({plan:"premium"});

        const user=await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata?.free_usage){
            req.free_usage = user.privateMetadata.free_usage;
        }else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })

            req.free_usage = 0;

        }

        req.plan = hasPremiumPlan ? "premium" : "free";
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}