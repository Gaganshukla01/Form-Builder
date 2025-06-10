import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const backend_url = import.meta.env.VITE_BACKEND_URI;

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Changed from false to null
    const [loading, setLoading] = useState(true); 
    const getAuthState = async () => {
        axios.defaults.withCredentials = true;
        try {
            const { data } = await axios.get(`${backend_url}/api/auth/isAuthenticate`);
            
            if (data.sucess) {
                setIsLoggedin(true);
                await getUserData(); // Added await
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            console.log(error.response?.data?.message || "Authentication check failed");
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setLoading(false); // Set loading to false regardless of outcome
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backend_url}/api/user/data`);
            
            // Fixed typo: 'sucess' should be 'success'
            if (data.success) {
                setUserData(data.message);
            } else {
                toast.error(data.message);
                setUserData(null);
            }
        } catch (error) {
            // Fixed: use error.response?.data?.message instead of data.message
            toast.error(error.response?.data?.message || "Failed to fetch user data");
            setUserData(null);
        }
    };

    // Add logout function
    const logout = async () => {
        try {
            await axios.post(`${backend_url}/api/auth/logout`);
            setIsLoggedin(false);
            setUserData(null);
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Logout error:", error);
            // Even if logout fails on server, clear local state
            setIsLoggedin(false);
            setUserData(null);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backend_url,
        isLoggedIn,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        logout,
        loading // Added loading state to context
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
