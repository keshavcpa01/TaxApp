import React, { useEffect, useState } from 'react';
import axios from 'axios';

type TaxForm1099 = {
  payer_name: string;
  payer_tin: string;
  payer_address: string;
  recipient_name: string;
  recipient_tin: string;
  recipient_address: string;
  nonemployee_compensation: number;
  federal_income_tax_withheld: number;
  state: string;
  state_id: string;
  state_income: number;
};

const SubmissionsTable: React.FC<{ token: string }> = ({ token }) => {
  const [records, setRecords] = useState<TaxForm1099[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(res.data);
      } catch (err: any) {
        console.error('❌ Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again.');
      }
    };

    fetchSubmissions();
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">🧾 1099-NEC Submissions</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Payer Name</th>
            <th>Payer TIN</th>
            <th>Payer Address</th>
            <th>Recipient Name</th>
            <th>Recipient TIN</th>
            <th>Recipient Address</th>
            <th>Nonemployee Compensation</th>
            <th>Federal Tax Withheld</th>
            <th>State</th>
            <th>State ID</th>
            <th>State Income</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.payer_name}</td>
              <td>{r.payer_tin}</td>
              <td>{r.payer_address}</td>
              <td>{r.recipient_name}</td>
              <td>{r.recipient_tin}</td>
              <td>{r.recipient_address}</td>
              <td>${r.nonemployee_compensation.toFixed(2)}</td>
              <td>${r.federal_income_tax_withheld.toFixed(2)}</td>
              <td>{r.state}</td>
              <td>{r.state_id}</td>
              <td>${r.state_income.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
