import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { TIN_MASK, PHONE_MASK, ZIP_MASK, DATE_MASK } from '../utils/masks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Recipient {
  recipient_name: string;
  recipient_tin: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_zip: string;
  payment_date: string;
  nonemployee_compensation: number;
  federal_income_tax_withheld?: number;
  state?: string;
  state_id?: string;
  state_income?: number;
}

interface FormData {
  payer_name: string;
  payer_tin: string;
  payer_phone: string;
  payer_address: string;
  payer_city: string;
  payer_state: string;
  payer_zip: string;
  payer_email?: string;
  recipients: Recipient[];
}

const TaxForm: React.FC = () => {
  const { register, handleSubmit, reset, control } = useForm<FormData>({
    defaultValues: { recipients: [{}] as Recipient[] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'recipients' });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in.');
      return;
    }

    const {
      payer_name,
      payer_tin,
      payer_phone,
      payer_address,
      payer_city,
      payer_state,
      payer_zip,
      payer_email,
    } = data;

    const forms = data.recipients.map((recipient) => ({
      ...recipient,
      payer_name,
      payer_tin,
      payer_phone,
      payer_address,
      payer_city,
      payer_state,
      payer_zip,
      payer_email,
    }));

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/submit-multiple-1099/`, forms, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ 1099s submitted!');
      navigate('/confirmation');
    } catch (err) {
      console.error(err);
      toast.error('❌ Submission failed. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📄 Submit 1099-NEC for Multiple Recipients</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div>
          <h3 className="font-semibold text-lg">Payer Info</h3>
          <input placeholder="Name" {...register('payer_name', { required: true })} />
          <InputMask mask={TIN_MASK} {...register('payer_tin', { required: true })}>
            {(inputProps) => <input {...inputProps} placeholder="Payer TIN (123-45-6789)" />}
          </InputMask>
          <InputMask mask={PHONE_MASK} {...register('payer_phone')}>
            {(inputProps) => <input {...inputProps} placeholder="Phone (123) 456-7890" />}
          </InputMask>
          <input placeholder="Email (for confirmation)" type="email" {...register('payer_email')} />
          <input placeholder="Address" {...register('payer_address', { required: true })} />
          <input placeholder="City" {...register('payer_city', { required: true })} />
          <input placeholder="State" {...register('payer_state', { required: true })} />
          <InputMask mask={ZIP_MASK} {...register('payer_zip', { required: true })}>
            {(inputProps) => <input {...inputProps} placeholder="ZIP (5-digit)" />}
          </InputMask>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Recipients</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4 rounded bg-gray-50">
              <h4 className="font-semibold">Recipient #{index + 1}</h4>
              <input placeholder="Name" {...register(`recipients.${index}.recipient_name`, { required: true })} />
              <InputMask mask={TIN_MASK} {...register(`recipients.${index}.recipient_tin`, { required: true })}>
                {(inputProps) => <input {...inputProps} placeholder="TIN" />}
              </InputMask>
              <InputMask mask={PHONE_MASK} {...register(`recipients.${index}.recipient_phone`)}>
                {(inputProps) => <input {...inputProps} placeholder="Phone" />}
              </InputMask>
              <input placeholder="Address" {...register(`recipients.${index}.recipient_address`, { required: true })} />
              <input placeholder="City" {...register(`recipients.${index}.recipient_city`, { required: true })} />
              <input placeholder="State" {...register(`recipients.${index}.recipient_state`, { required: true })} />
              <InputMask mask={ZIP_MASK} {...register(`recipients.${index}.recipient_zip`, { required: true })}>
                {(inputProps) => <input {...inputProps} placeholder="ZIP" />}
              </InputMask>
              <InputMask mask={DATE_MASK} {...register(`recipients.${index}.payment_date`)}>
                {(inputProps) => <input {...inputProps} placeholder="Payment Date" />}
              </InputMask>
              <input type="number" step="0.01" placeholder="Compensation" {...register(`recipients.${index}.nonemployee_compensation`, { required: true })} />
              <input type="number" step="0.01" placeholder="Federal Tax Withheld" {...register(`recipients.${index}.federal_income_tax_withheld`)} />
              <input placeholder="State" {...register(`recipients.${index}.state`)} />
              <input placeholder="State ID" {...register(`recipients.${index}.state_id`)} />
              <input type="number" step="0.01" placeholder="State Income" {...register(`recipients.${index}.state_income`)} />

              <button type="button" className="text-red-600 underline mt-2" onClick={() => remove(index)}>Remove Recipient</button>
            </div>
          ))}
          <button type="button" onClick={() => append({} as Recipient)} className="bg-gray-200 px-4 py-2 rounded">+ Add Recipient</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Submit All 1099s</button>
      </form>
    </div>
  );
};

export default TaxForm;
