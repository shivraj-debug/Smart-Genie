import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import 'dotenv/config';
import pdf from 'pdf-parse/lib/pdf-parse.js';


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;

    const plan = req.plan;

    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

    if (!prompt || !length) {
      return res.status(400).json({ error: "Prompt and length are required." });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      //   await sql`
      //     UPDATE users
      //     SET private_metadata = jsonb_set(private_metadata, '{free_usage}', (private_metadata->>'free_usage')::int + 1)
      //     WHERE id = ${userId}
      //   `;
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Article generated successfully.",
      content,
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;

    const plan = req.plan;

    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Article generated successfully.",
      content,
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const generateImage = async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const { prompt, publish } = req.body;

//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.status(403).json({
//         success: false,
//         message: "Free usage limit exceeded. Upgrade to premium plan.",
//       });
//     }

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required." });
//     }

//    const formData = new FormData()
//    formData.append('prompt', prompt) 
   
//    const {data}= await axios.post('https://clipdrop-api.co/text-to-image/v1',formData, {
//       headers: {
//         'x-api-key':process.env.CLIPDROP_API_KEY,
//       },
//       responseType: 'arraybuffer',
//     } );

//     const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;

//     const {secure_url}=await cloudinary.uploader.upload(base64Image)

//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type,publish)
//       VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
//     `;

//     res.json({
//       success: true,
//       message: "Article generated successfully.",
//       content: secure_url,
//     });
//   } catch (error) {
//     console.error("Error generating article:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const generateImage = async (req, res) => {
  try {
    // --- AUTHENTICATION & INPUT VALIDATION ---

    // Access user ID from the `req.auth` object.
    const { userId } = req.auth;
    const { prompt, publish } = req.body;
    const plan = req.plan;

    // 1. Check for premium plan access.
    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

    // 2. Validate the prompt.
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // --- GEMINI API CALL ---

    // 3. Prepare the payload for the Gemini API call.
    // NOTE: This payload is for the gemini-2.0-flash-preview-image-generation model.
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        },
    };
    
    const apiKey = process.env.GEMINI_API_KEY;
    // The updated API URL for the gemini-2.0-flash-preview-image-generation model.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

    let apiResponse;
    let retryCount = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second for exponential backoff

    // 4. Make the POST request to the Gemini API with exponential backoff.
    while (true) {
        try {
            apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!apiResponse.ok) {
                // If the response is not OK, we'll try to get the error message from the body.
                const errorBody = await apiResponse.text();
                throw new Error(`API error: ${apiResponse.status} ${apiResponse.statusText} - ${errorBody}`);
            }
            break; // Success, exit the loop
        } catch (error) {
            if (retryCount < maxRetries) {
                const delay = baseDelay * Math.pow(2, retryCount);
                console.warn(`API call failed. Retrying in ${delay}ms...`);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("Max retries exceeded for API call.");
                throw error; // Re-throw the error if max retries are exceeded
            }
        }
    }
    
    // 5. Parse the JSON response to get the base64 data.
    const result = await apiResponse.json();
    const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;


    if (!base64Data) {
      throw new Error("No image data returned from the Gemini API.");
    }

    // --- CLOUDINARY UPLOAD ---

    // 6. Convert the base64 string to a data URI for Cloudinary upload.
    const base64Image = `data:image/png;base64,${base64Data}`;

    // 7. Upload the base64 image to Cloudinary.
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // --- DATABASE STORAGE ---

    // 8. Insert the new image creation into the database.
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    // --- SUCCESS RESPONSE ---

    res.json({
      success: true,
      message: "Image generated successfully.",
      content: secure_url,
    });
  } catch (error) {
    // --- ERROR HANDLING ---

    // Log the error and send a generic internal server error response.
    console.error("Error generating image:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();

    const image = req.file;

    console.log("Image file received:", image);

    if(!image || !image.path) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

    const {secure_url}=await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
           effect: "background_removal",
           background_removal: "remove_the_background",
         }
      ]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId},${'Remove background from image'}, ${secure_url}, 'image')
    `;


    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.error("Error generating from remove background form image :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image=req.file;
    const {object}=req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

    const {public_id}=await cloudinary.uploader.upload(image.path);

    const imageUrl=cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`
        },
      ],
      resource_type: 'image',
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({
      success: true,
      message: "Article generated successfully.",
      content: imageUrl,
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume=req.file;
   
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to premium plan.",
      });
    }

   if(resume.size > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, error: "File size exceeds 5MB limit." });
   }

   const dataBuffer = fs.readFileSync(resume.path);

   const pdfData = await pdf(dataBuffer);

   const prompt=  `Please review the following resume and provide constructive feedback on its strength, weaknesses,areas of improvement, and overall effectiveness.Resume Content:\n\n${pdfData.text}`;

   const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${'Review the uploaded resume'}, ${content}, 'resume-review')
    `;

    res.json({
      success: true,
      message: "Article generated successfully.",
      content
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
