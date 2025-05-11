import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TaxForm1099 {
  id: number;
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
  federal_income_tax_withheld: number;
  state: string;
  state_id: string;
  state_income: number;
}

const SubmissionsTable: React.FC = () => {
  const [records, setRecords] = useState<TaxForm1099[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No access token. Please log in.');
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecords(res.data);
      } catch (err: any) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again.');
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">🧾 1099-NEC Submissions</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Payer</th>
            <th className="border px-2 py-1">Recipient</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Fed Tax</th>
            <th className="border px-2 py-1">State</th>
            <th className="border px-2 py-1">Zip</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="text-sm">
              <td className="border px-2 py-1">{r.payer_name}<br/>{r.payer_city}, {r.payer_state}</td>
              <td className="border px-2 py-1">{r.recipient_name}<br/>{r.recipient_city}, {r.recipient_state}</td>
              <td className="border px-2 py-1 text-right">${r.nonemployee_compensation.toFixed(2)}</td>
              <td className="border px-2 py-1 text-right">${r.federal_income_tax_withheld.toFixed(2)}</td>
              <td className="border px-2 py-1">{r.state || '-'}</td>
              <td className="border px-2 py-1">{r.recipient_zip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
