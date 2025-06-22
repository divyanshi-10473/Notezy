
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from '@/hooks/use-toast';
import { loginWithGoogle } from '../../../store/auth-slice';
import { useDispatch } from 'react-redux';
import logo from '../../assets/google.png'

function GoogleLogins() {
  const dispatch = useDispatch();
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google Login Success:', tokenResponse); 

      
        const result = await dispatch(loginWithGoogle(tokenResponse)).unwrap();
        console.log(result);

        toast({
          title: result.message || "Google login successful",
          className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
        });

      } catch (error) {
        toast({
          title: error || "Google login failed",
          variant: "destructive",
          className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
        });
        console.error("Login Error:", error);
      
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
    },
    flow: 'auth-code', // Use "auth-code" for secure login (for server-side)
  });

  return (
<button
  onClick={handleGoogleLogin}
  className="mb-4 w-[85%] py-2 px-4 flex items-center justify-center gap-2 bg-orange-100 text-black border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
>
  <img
    src={logo}
    alt="Google icon"
    className="w-5 h-5"
  />
  <span className="font-medium">Continue with Google</span>
</button>

  );
}

export default GoogleLogins;
