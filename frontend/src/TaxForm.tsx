import React, { useState } from 'react';
import axios from 'axios';

const TaxForm: React.FC = () => {
  const [formData, setFormData] = useState({
    payer_name: '',
    payer_tin: '',
    payer_address: '',
    recipient_name: '',
    recipient_tin: '',
    recipient_address: '',
    amount_paid: 0,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'amount_paid' ? parseFloat(value) : value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://taxapp1099.onrender.com/submit-1099/', formData);
      setMessage(`✅ Submitted! Record ID: ${response.data.id}`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error submitting form.');
    }
  };

  return (
    <div>
      <h1>1099-NEC Form</h1>
      <form onSubmit={handleSubmit}>
        <input name="payer_name" placeholder="Payer Name" onChange={handleChange} />
        <input name="payer_tin" placeholder="Payer TIN" onChange={handleChange} />
        <input name="payer_address" placeholder="Payer Address" onChange={handleChange} />
        <input name="recipient_name" placeholder="Recipient Name" onChange={handleChange} />
        <input name="recipient_tin" placeholder="Recipient TIN" onChange={handleChange} />
        <input name="recipient_address" placeholder="Recipient Address" onChange={handleChange} />
        <input name="amount_paid" type="number" placeholder="Amount Paid" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default TaxForm;
