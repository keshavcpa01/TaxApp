import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TaxForm1099 {
  id: number;
  payer_name: string;
  payer_tin: string;
  payer_address: string;
  recipient_name: string;
  recipient_tin: string;
  recipient_address: string;
  nonemployee_compensation: number | string;
  federal_income_tax_withheld: number | string;
  state: string;
  state_id: string;
  state_income: number | string;
}

const SubmissionsTable: React.FC = () => {
  const [records, setRecords] = useState<TaxForm1099[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load submissions. Please try again.');
      }
    };

    fetchSubmissions();
  }, []);

  const filtered = records.filter(r =>
    r.recipient_name.toLowerCase().includes(search.toLowerCase()) ||
    r.recipient_tin.includes(search) ||
    r.state?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = Object.keys(records[0] || {}).join(',');
    const rows = records.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'submissions.csv';
    link.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧾 1099-NEC Submissions</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Search by name, TIN, or state"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 w-1/2"
        />
        <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">Export CSV</button>
      </div>

      <table className="w-full text-sm border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Payer Name</th>
            <th className="border px-2">Payer TIN</th>
            <th className="border px-2">Recipient Name</th>
            <th className="border px-2">Recipient TIN</th>
            <th className="border px-2">Compensation</th>
            <th className="border px-2">Federal Tax</th>
            <th className="border px-2">State</th>
            <th className="border px-2">State Income</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-2">{r.payer_name}</td>
              <td className="border px-2">{r.payer_tin}</td>
              <td className="border px-2">{r.recipient_name}</td>
              <td className="border px-2">{r.recipient_tin}</td>
              <td className="border px-2">${Number(r.nonemployee_compensation).toFixed(2)}</td>
              <td className="border px-2">${Number(r.federal_income_tax_withheld).toFixed(2)}</td>
              <td className="border px-2">{r.state}</td>
              <td className="border px-2">${Number(r.state_income).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
