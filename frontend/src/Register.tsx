import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface RegisterProps {
  onRegistered: () => void;
}

type FormData = {
  username: string;
  password: string;
};

const Register: React.FC<RegisterProps> = ({ onRegistered }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [message, setMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('https://taxapp1099.onrender.com/register', data);
      setMessage('✅ Registration successful. Please log in.');
      onRegistered();
    } catch (err) {
      setMessage('❌ Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">🆕 Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('username', { required: 'Username is required' })}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-red-600 mt-4 text-center">{message}</p>
      </div>
    </div>
  );
};

export default Register;
