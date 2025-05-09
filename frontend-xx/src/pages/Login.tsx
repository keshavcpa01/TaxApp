import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);

type FormData = {
  username: string;
  password: string;
};

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const params = new URLSearchParams();
      params.append('username', data.username);
      params.append('password', data.password);
  
      const response = await axios.post('https://taxapp1099.onrender.com/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      const token = response.data.access_token;
      onLogin(token); // Updates token in App
      toast.success('✅ Logged in!');
      navigate('/');
    } catch (err) {
      toast.error('❌ Login failed. Please check credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('username', { required: 'Username is required' })}
            placeholder="Username"
            className="w-full border rounded px-4 py-2"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}

          <div className="relative">
  <input
    {...register('password', { required: 'Password is required' })}
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    className="w-full border rounded px-4 py-2 pr-10"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
  >
    {showPassword ? 'Hide' : 'Show'}
  </button>
</div>

          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        <p className="text-sm mt-4 text-center text-gray-600">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </p>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
