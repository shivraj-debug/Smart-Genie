import { Edit, Sparkles } from 'lucide-react'
import React from 'react'
import axios from 'axios'
import { useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticles = () => {

   const articleLength=[
    {length:800,text:'Short (500-800 words)'},
    {length:1200,text:'Short (800-1200 words)'},
    {length:1600,text:'Short (1200-1600 words)'},
  ]

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const {getToken} = useAuth();

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    // Handle the form submission logic here
    try{
      setLoading(true);

      const prompt= `Generate an article on the topic: ${input} with a length of ${selectedLength.text} `;

      const response = await axios.post('/api/ai/generate-article', {
        prompt,
        length: selectedLength.length
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}` // Get the token from Clerk
        }
      });

      if(response.data.success){
        setContent(response.data.content);
      }else{
        toast.error("Failed to generate article. Please try again.");
      }
    }catch(error){
      toast.error(error.message || "An error occurred while generating the article.");
    }

    setLoading(false);
  }


  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
             <Sparkles className='w-6 text-[#4A7AFF]'/>
             <h1 className='text-xl font-semibold'>Article Configuration</h1>
          </div>

          <p className='mt-6 text-sm font-medium'>Article Topic</p>
          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter the topic of your article' className='w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required />

          <p className='mt-4 text-sm font-medium'>Article Length</p>

          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {articleLength.map((item,index) => (
              <span onClick={() => setSelectedLength(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-100 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={index}> 
                 {item.text}
              </span>
            ))}
          </div>

          <br/>

          <button disabled={loading} className='mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer'>
            {
              loading ? (
                <span className='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></span>
              ) : (
               <Edit className='w-5 h-5 ' />
              )
            }
            
            Generate Article
          </button>

         
      </form>
             {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[700px]'>
               <div className='flex items-center gap-3' >
                    <Edit className='w-5 h-5 text-blue-500' />
                    <h1 className='text-lg font-semibold'>Generated Article</h1>
               </div>

              {
                !content?(
                   <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center text-gray-500 gap-5'>
                  <Edit className='w-5 h-5' />
                  <p className='text-sm text-gray-500'>This is where the generated article will appear.</p>
                </div>
               </div>
                ):(
                  <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                    <div className='reset-tw'>
                      <Markdown>{content}</Markdown>
                    </div>
                  </div>
                )
              }
            </div>
    </div>
  )
}

export default WriteArticles
