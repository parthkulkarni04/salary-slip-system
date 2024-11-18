import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const SalarySlipManagement = () => {
  const [slips, setSlips] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlip, setCurrentSlip] = useState({
    employeeNumber: '',
    daysWorked: '',
    basicPay: '',
    gradePay: '',
    dearnessAllowance: '',
    dearnessPay: '',
    hra: '',
    specialPay: '',
    otherAllowance: ''
  });

  // Fetch all salary slips
  const fetchSlips = async () => {
    try {
      const response = await fetch('http://localhost:5015/api/salary-slips');
      const data = await response.json();
      setSlips(data);
    } catch (error) {
      console.error('Error fetching slips:', error);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  // Add or update salary slip
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5015/api/salary-slips/${currentSlip._id}`
        : 'http://localhost:5015/api/salary-slips';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentSlip),
      });
      
      setCurrentSlip({
        employeeNumber: '',
        daysWorked: '',
        basicPay: '',
        gradePay: '',
        dearnessAllowance: '',
        dearnessPay: '',
        hra: '',
        specialPay: '',
        otherAllowance: ''
      });
      setIsEditing(false);
      fetchSlips();
    } catch (error) {
      console.error('Error saving slip:', error);
    }
  };

  // Delete salary slip
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary slip?')) {
      try {
        await fetch(`http://localhost:5015/api/salary-slips/${id}`, {
          method: 'DELETE',
        });
        fetchSlips();
      } catch (error) {
        console.error('Error deleting slip:', error);
      }
    }
  };

  // Edit salary slip
  const handleEdit = (slip) => {
    setCurrentSlip(slip);
    setIsEditing(true);
  };

  // Filter slips based on search term
  const filteredSlips = slips.filter(slip => 
    slip.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Salary Slip Management</h1>
        <p>CNT Lab exam, Roll no. 30</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 w-full justify-center relative ">
        <div className="justify-items-center relative">
          <input
            type="text"
            placeholder="Search by Employee Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>


      {/* Salary Slips List */}
      <div className="mb-6 overflow-x-auto rounded-2xl shadow-md bg-slate-100">
        <table className="min-w-full bg-grey-100 pl-10 pr-10">
          <thead>
            <tr className="bg-slate-400">
              <th className="py-3 px-4 text-left">Employee Number</th>
              <th className="py-3 px-4 text-left">Days Worked</th>
              <th className="py-3 px-4 text-left">Basic Pay</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlips.map((slip) => {
              const total = Number(slip.basicPay) + 
                          Number(slip.gradePay) + 
                          Number(slip.dearnessAllowance) + 
                          Number(slip.dearnessPay) + 
                          Number(slip.hra) + 
                          Number(slip.specialPay) + 
                          Number(slip.otherAllowance);
              
              return (
                <tr key={slip._id} className="border-b hover:bg-gray-300">
                  <td className="py-3 px-4">{slip.employeeNumber}</td>
                  <td className="py-3 px-4">{slip.daysWorked}</td>
                  <td className="py-3 px-4">{slip.basicPay}</td>
                  <td className="py-3 px-4">{total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(slip)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(slip._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Salary slip details</h2>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Number</label>
            <input
              type="text"
              value={currentSlip.employeeNumber}
              onChange={(e) => setCurrentSlip({...currentSlip, employeeNumber: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days Worked</label>
            <input
              type="number"
              value={currentSlip.daysWorked}
              onChange={(e) => setCurrentSlip({...currentSlip, daysWorked: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Basic Pay</label>
            <input
              type="number"
              value={currentSlip.basicPay}
              onChange={(e) => setCurrentSlip({...currentSlip, basicPay: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade Pay</label>
            <input
              type="number"
              value={currentSlip.gradePay}
              onChange={(e) => setCurrentSlip({...currentSlip, gradePay: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dearness Allowance</label>
            <input
              type="number"
              value={currentSlip.dearnessAllowance}
              onChange={(e) => setCurrentSlip({...currentSlip, dearnessAllowance: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dearness Pay</label>
            <input
              type="number"
              value={currentSlip.dearnessPay}
              onChange={(e) => setCurrentSlip({...currentSlip, dearnessPay: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HRA</label>
            <input
              type="number"
              value={currentSlip.hra}
              onChange={(e) => setCurrentSlip({...currentSlip, hra: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Special Pay</label>
            <input
              type="number"
              value={currentSlip.specialPay}
              onChange={(e) => setCurrentSlip({...currentSlip, specialPay: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Other Allowance</label>
            <input
              type="number"
              value={currentSlip.otherAllowance}
              onChange={(e) => setCurrentSlip({...currentSlip, otherAllowance: e.target.value})}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {isEditing ? 'Update Salary Slip' : 'Add Salary Slip'}
        </button>
      </form>
    </div>
  );
};

export default SalarySlipManagement;