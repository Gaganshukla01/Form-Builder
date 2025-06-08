import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

function Navbar() 
{
  const navigate = useNavigate();
  const { userData,setUserData, setIsLoggedin, backend_url } = useContext(AppContent);

  const sendVerificationMail=async()=>{
    try {
      axios.defaults.withCredentials=true
      const {data}=await axios.post(backend_url+"/api/auth/sendverifyOtp")
      if(data.sucess){
        navigate("/EmailVerify")
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error)
    }
  }

  const logout= async ()=>{
    try {
      axios.defaults.withCredentials=true
      const {data}= await axios.post(backend_url+"/api/auth/logout")
      
      if(data.sucess){ 
        console.log("iam here")
        setIsLoggedin(false)
        setUserData(false)
        navigate("/")
      }
     
    } catch (error) {
      toast.error(error)
    }
  }
  return (
    <>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img src={assets.logo} alt="error" className="w-28 sm:w-32" />

        {userData.name? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black
           text-white relative group">
            {userData.name[0].toUpperCase()}

            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black
             rounded pt-10">
                <ul className="list-none bg-gray-100 m-0 p-2 text-sm">
                    {!userData.isAccountVerifed &&
                     <li onClick={sendVerificationMail} className="py-1 w-30 px-2 hover:bg-gray-200 
                     cursor-pointer ">Verify Email</li>
                    }
                    
                    <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={logout}>Logout</li>
                </ul>
            
          </div>
          </div>

        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2
text-gray-800 hover:bg-gray-100 cursor-pointer transition-all"
          >
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;
