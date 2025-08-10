import React,{useEffect, useState} from 'react'
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {

  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  
  const getDashboardData = async () => {
    try{
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`, // Get the token from Clerk
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    }catch (error) {
      toast.error("Error fetching dashboard data:", error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    getDashboardData()
  },[])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 '>
          <div className='text-slate-600'>
            <p className='text-lg '>Total Creations</p>
            <p className='text-xl font-semibold'>{creations.length}</p>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        
        {/* for active plan */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 '>
          <div className='text-slate-600'>
            <p className='text-lg '>Active Plan</p>
            <p className='text-xl font-semibold'>
              <Protect plan="premium" fallback="free">Premium</Protect>
            </p>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

     {
      loading ? (
        <div className='flex justify-center items-center h-full'>
          <span className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full'></span>
        </div>
      ) : (
         <div className='space-y-3 '>
          <p className='mt-6 mb-4'>Recent Creations</p>
          {
            creations.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))
          }
      </div>
      )
     } 
    </div>
  )
}

export default Dashboard
