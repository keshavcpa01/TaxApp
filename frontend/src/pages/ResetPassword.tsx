// ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

type FormData = {
  new_password: string;
  confirm_password: string;
};

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('❌ Invalid or missing token');
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    try {
      setLoading(true);
      await axios.post('https://taxapp1099.onrender.com/reset-password', {
        token,
        new_password: data.new_password,
      });
      toast.success('✅ Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error('❌ Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🔁 Reset Your Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium mb-1">New Password</label>
            <input
              id="new_password"
              type="password"
              {...register('new_password', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter new password"
              className="w-full border rounded px-4 py-2"
            />
            {errors.new_password && <p className="text-sm text-red-600">{errors.new_password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              id="confirm_password"
              type="password"
              {...register('confirm_password', {
                validate: (value) => value === watch('new_password') || 'Passwords do not match',
              })}
              placeholder="Confirm password"
              className="w-full border rounded px-4 py-2"
            />
            {errors.confirm_password && <p className="text-sm text-red-600">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
