import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  payer_name: string;
  payer_tin: string;
  payer_address: string;
  payer_city: string;
  payer_state: string;
  payer_zip: string;
  recipient_name: string;
  recipient_tin: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_zip: string;
  nonemployee_compensation: number;
  federal_income_tax_withheld?: number;
  state?: string;
  state_id?: string;
  state_income?: number;
}

const TaxForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/submit-1099/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ 1099 submitted!');
      reset();
    } catch (err: any) {
      console.error('Error submitting 1099:', err);
      alert('❌ Submission failed');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📄 Submit 1099-NEC</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
        {/* You can extract these fields into subcomponents if needed */}
        <input placeholder="Payer Name" {...register('payer_name', { required: true })} />
        <input placeholder="Payer TIN" {...register('payer_tin', { required: true })} />
        <input placeholder="Payer Address" {...register('payer_address', { required: true })} />
        <input placeholder="Payer City" {...register('payer_city', { required: true })} />
        <input placeholder="Payer State" {...register('payer_state', { required: true })} />
        <input placeholder="Payer ZIP" {...register('payer_zip', { required: true })} />

        <input placeholder="Recipient Name" {...register('recipient_name', { required: true })} />
        <input placeholder="Recipient TIN" {...register('recipient_tin', { required: true })} />
        <input placeholder="Recipient Address" {...register('recipient_address', { required: true })} />
        <input placeholder="Recipient City" {...register('recipient_city', { required: true })} />
        <input placeholder="Recipient State" {...register('recipient_state', { required: true })} />
        <input placeholder="Recipient ZIP" {...register('recipient_zip', { required: true })} />

        <input type="number" step="0.01" placeholder="Nonemployee Compensation" {...register('nonemployee_compensation', { required: true })} />
        <input type="number" step="0.01" placeholder="Federal Tax Withheld (optional)" {...register('federal_income_tax_withheld')} />
        <input placeholder="State (optional)" {...register('state')} />
        <input placeholder="State ID (optional)" {...register('state_id')} />
        <input type="number" step="0.01" placeholder="State Income (optional)" {...register('state_income')} />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit 1099
        </button>
      </form>
    </div>
  );
};

export default TaxForm;
