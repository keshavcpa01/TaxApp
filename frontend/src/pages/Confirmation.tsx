import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface TaxForm1099 {
  id: number;
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
  created_at: string;
}

const Confirmation: React.FC = () => {
  const [records, setRecords] = useState<TaxForm1099[]>([]);
  const [error, setError] = useState('');
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submissions/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(res.data);
      } catch (err: any) {
        console.error(err);
        setError('Could not load confirmation data');
      }
    };

    fetchRecent();
  }, []);

  const downloadPDF = () => {
    if (pdfRef.current) {
      html2pdf().from(pdfRef.current).save('1099-confirmation.pdf');
    }
  };

  if (records.length === 0 && !error) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const payer = records[0];

  return (
    <div className="p-4">
      <div ref={pdfRef} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-2">🧾 Confirmation: Last 1099-NEC Submission</h2>
        <p className="mb-4">Submitted on: {new Date(payer.created_at).toLocaleString()}</p>

        <div className="border p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Payer Info</h3>
          <p><strong>Name:</strong> {payer.payer_name}</p>
          <p><strong>TIN:</strong> {payer.payer_tin}</p>
          <p><strong>Address:</strong> {payer.payer_address}</p>
        </div>

        <h3 className="font-semibold text-lg mb-2">Recipients</h3>
        {records.map((r, idx) => (
          <div key={r.id} className="border border-gray-300 p-3 mb-4">
            <p><strong>Recipient #{idx + 1}:</strong> {r.recipient_name}</p>
            <p><strong>TIN:</strong> {r.recipient_tin}</p>
            <p><strong>Address:</strong> {r.recipient_address}</p>
            <p><strong>Nonemployee Compensation:</strong> ${r.nonemployee_compensation.toFixed(2)}</p>
            <p><strong>Federal Tax Withheld:</strong> ${r.federal_income_tax_withheld.toFixed(2)}</p>
            <p><strong>State:</strong> {r.state} ({r.state_id})</p>
            <p><strong>State Income:</strong> ${r.state_income.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={downloadPDF}
          className="bg-green-700 text-white px-6 py-2 rounded mr-4"
        >
          Download PDF
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-700 text-white px-6 py-2 rounded"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
