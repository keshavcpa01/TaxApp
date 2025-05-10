import React, { useState } from 'react';
import axios from 'axios';

const TaxForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // Payer Info
    payer_name: '',
    payer_tin: '',
    payer_address: '',
    payer_city: '',
    payer_state: '',
    payer_zip: '',

    // Recipient Info
    recipient_name: '',
    recipient_tin: '',
    recipient_address: '',
    recipient_city: '',
    recipient_state: '',
    recipient_zip: '',

    // Compensation Info
    nonemployee_compensation: 0,
    federal_income_tax_withheld: 0,
    state: '',
    state_id: '',
    state_income: 0,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: ['nonemployee_compensation', 'federal_income_tax_withheld', 'state_income'].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/submit-1099/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ Submitted! Record ID: ${response.data.id}`);
    } catch (error: any) {
      const msg = error?.response?.data?.detail || '❌ Error submitting form. Please check required fields.';
      console.error('Axios error:', error.response || error.message);
      setMessage(msg);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-xl font-bold mb-4 text-center">📄 1099-NEC Submission Form</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <h3 className="font-semibold">Payer Information</h3>
        <input name="payer_name" placeholder="Payer Name" onChange={handleChange} required />
        <input name="payer_tin" placeholder="Payer TIN" onChange={handleChange} required />
        <input name="payer_address" placeholder="Payer Address" onChange={handleChange} required />
        <input name="payer_city" placeholder="Payer City" onChange={handleChange} required />
        <input name="payer_state" placeholder="Payer State" onChange={handleChange} required />
        <input name="payer_zip" placeholder="Payer ZIP" onChange={handleChange} required />

        <h3 className="font-semibold">Recipient Information</h3>
        <input name="recipient_name" placeholder="Recipient Name" onChange={handleChange} required />
        <input name="recipient_tin" placeholder="Recipient TIN" onChange={handleChange} required />
        <input name="recipient_address" placeholder="Recipient Address" onChange={handleChange} required />
        <input name="recipient_city" placeholder="Recipient City" onChange={handleChange} required />
        <input name="recipient_state" placeholder="Recipient State" onChange={handleChange} required />
        <input name="recipient_zip" placeholder="Recipient ZIP" onChange={handleChange} required />

        <h3 className="font-semibold">Payment Information</h3>
        <input name="nonemployee_compensation" type="number" placeholder="Box 1: Compensation" onChange={handleChange} required />
        <input name="federal_income_tax_withheld" type="number" placeholder="Box 4: Fed Tax Withheld" onChange={handleChange} />
        <input name="state" placeholder="Box 5: State" onChange={handleChange} />
        <input name="state_id" placeholder="Box 6: State ID" onChange={handleChange} />
        <input name="state_income" type="number" placeholder="Box 7: State Income" onChange={handleChange} />

        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit 1099
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default TaxForm;
