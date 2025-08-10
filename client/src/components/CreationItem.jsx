import React from 'react'
import Markdown from 'react-markdown';

const CreationItem = ({item}) => {

    const [expanded, setExpanded] = React.useState(false);

  return (
    <div onClick={()=> setExpanded(!expanded)} className='p-4 max-w-5xl  text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
       <div className='flex items-center gap-4 justify-between'> 
         <div>
            <h2>{item.prompt}</h2>
            <p className='text-gray-500'>{item.type}-{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button className='px-4 py-1 border-2 border-gray-200 bg-blue-600 text-white rounded-full'>{item.type}</button>
       </div>
       {
        expanded && (
            <div>
                {item.type=='image'?(
                    <div>
                        <img src={item.content} alt="image" className='mt-3 w-full max-w-md'/>
                    </div>
                ):(
                    <div className='mt-3 h-full overflow-y-scroll text-sm text-scale-600'>
                        {/* reset-tw written in index.css */}
                        <div className='reset-tw'> 
                            <Markdown>{item.content}</Markdown>
                        </div>
                    </div>
                )}
            </div>
        )
       }
    </div>
  )
}

export default CreationItem
