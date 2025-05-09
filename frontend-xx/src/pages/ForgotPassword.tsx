import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

type FormData = {
  username: string;
  new_password: string;
};

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('https://taxapp1099.onrender.com/reset-password', data);
      toast.success('✅ Password reset! You can now log in.');
    } catch (err) {
      toast.error('❌ Failed to reset password.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🔁 Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('username', { required: 'Username is required' })}
            placeholder="Username"
            className="w-full border rounded px-4 py-2"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}

          <input
            {...register('new_password', { required: 'New password is required' })}
            type="password"
            placeholder="New Password"
            className="w-full border rounded px-4 py-2"
          />
          {errors.new_password && <p className="text-sm text-red-600">{errors.new_password.message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
