import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '@/hooks/useContract';

const ApprovedRecipients: React.FC = () => {
    const { contractState } = useContract();
    const navigate = useNavigate();

    const approvedRecipients = contractState.aidRequests.filter(r => r.approved && !r.claimed);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Approved Recipients</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedRecipients.map((r, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-gray-900">{r.name}</h2>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                Approved
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                            <p>
                                <span className="font-medium text-gray-800">Address:</span><br />
                                <span className="break-all text-gray-600">{r.recipient}</span>
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Contact:</span><br />
                                <span className="text-gray-600">{r.contact}</span>
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Location:</span><br />
                                <span className="text-gray-600">{r.location}</span>
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Reason for Aid:</span><br />
                                <span className="text-gray-600">{r.reason}</span>
                            </p>
                        </div>

                        <div className="text-right">
                            <button
                                onClick={() => navigate(`/donor?recipient=${r.recipient}`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors"
                            >
                                Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ApprovedRecipients;
