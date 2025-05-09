import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const [showPassword, setShowPassword] = useState(false);

type FormData = {
  username: string;
  password: string;
};

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('https://taxapp1099.onrender.com/register', data);
      toast.success('✅ Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error('❌ Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🆕 Register</h2>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
