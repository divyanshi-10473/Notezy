import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginUser } from '../../../store/auth-slice/index';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import GoogleLogins from '@/components/auth/googleLogin';

const AuthLogin = () => {
  const dispatch= useDispatch();
  const navigate = useNavigate(); 
   const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const result = await dispatch(loginUser(formData)).unwrap();
   
      toast({
        title: result.message,
        className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
      });
     
    } catch (errorMessage) {
      toast({
        title: errorMessage,
        variant: "destructive",
        className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
      });
    }
  };
  
  


  return (
    <div className='flex flex-col justify-center items-center'>
      <img src={logo} alt="App Logo" className="h-20 w-60 my-4" />
      <div
        className="mx-auto w-full lg:h-[600px] h-full max-w-md space-y-6 bg-cover bg-center "
        style={{ backgroundImage: `url('/assets/login-Photoroom.png')` }}
      >
        <div className="pl-[17%] py-8 lg:py-14 h-[60vh] custom-padding">
          <h1 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="text-center mb-[10%] md:mb-[20%]">
            Don't have an account
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
          <GoogleLogins/>

          <form className="h-[80%]" onSubmit={onSubmit}>
            <Label className="mb-1" htmlFor="email">Email</Label>
            <Input
              placeholder="Enter your email"
              id="email"
              name="email"
              type="email"
              className="w-[85%]"
              value={formData.email}
              onChange={handleChange}
            />

            <Label className="mb-1" htmlFor="password">Password</Label>
            <Input
              placeholder="Enter your password"
              id="password"
              name="password"
              type="password"
              className="w-[85%]"
              value={formData.password}
              onChange={handleChange}
            />

            <Button type="submit" className="w-[85%] bg-black text-purple-50 mt-6">
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* Inline media query for screen <250px */}
      <style>
        {`
          @media (max-width: 270px) {
            .custom-padding {
              padding-left: 7% !important;
            }
          }
        `}
      </style>
      
    </div>
  );
};

export default AuthLogin;
