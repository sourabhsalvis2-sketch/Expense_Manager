import React from "react";

interface Expense {
    id: string;
    type: string;
    name: string;
    amount: number;
    year: number;
    month: string;
}

interface Props {
    expenses: Expense[];
    onRemove: (id: string) => void;
}

export default function ExpenseTable({ expenses, onRemove }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp) => (
                        <tr key={exp.id}>
                            <td className="p-2 border">{exp.type}</td>
                            <td className="p-2 border">{exp.name}</td>
                            <td className="p-2 border">₹{Number(exp.amount)}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => onRemove(exp.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    {expenses.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center p-2 text-gray-500">
                                No expenses added
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
