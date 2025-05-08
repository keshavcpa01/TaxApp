import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface LoginProps {
  onLogin: (token: string) => void;
}

type FormData = {
  username: string;
  password: string;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      const params = new URLSearchParams();
      params.append('username', data.username);
      params.append('password', data.password);

      const response = await axios.post('https://taxapp1099.onrender.com/login', params);
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      onLogin(token);
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">🔐 Login</h2>
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
            Log In
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        <p className="mt-4 text-sm text-center">
          Forgot password?{' '}
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Reset it
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
