import React, { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function Home() {
    const [defaults, setDefaults] = useState<
        { id: number; name: string; amount: number }[]
    >([]);
    const [specifics, setSpecifics] = useState<
        { id: number; name: string; amount: number; year: number; month: string }[]
    >([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(months[new Date().getMonth()]);

    // Add Default
    const addDefault = (name: string, amount: number) => {
        const newItem = { id: Date.now(), name, amount };
        setDefaults((prev) => [...prev, newItem]);
    };

    // Add Specific
    const addSpecific = (
        name: string,
        amount: number,
        year: number,
        month: string
    ) => {
        const newItem = { id: Date.now(), name, amount, year, month };
        setSpecifics((prev) => [...prev, newItem]);
    };

    // Remove Default
    const removeDefault = (id: number) => {
        setDefaults((prev) => prev.filter((item) => item.id !== id));
    };

    // Remove Specific
    const removeSpecific = (id: number) => {
        setSpecifics((prev) => prev.filter((item) => item.id !== id));
    };

    // Expenses for the selected month
    const monthExpenses = [
        ...defaults.map((d) => ({ ...d, type: "Default", year, month })),
        ...specifics
            .filter((s) => s.year === year && s.month === month)
            .map((s) => ({ ...s, type: "Specific" })),
    ];

    // Totals
    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const grandTotal =
        defaults.reduce((sum, d) => sum + d.amount * 12, 0) +
        specifics.reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Monthly Expense Manager</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Add Expense Form */}
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <ExpenseForm
                        onAddDefault={addDefault}
                        onAddSpecific={addSpecific}
                        defaults={defaults}
                        specifics={specifics}
                        onRemoveDefault={removeDefault}
                        onRemoveSpecific={removeSpecific}
                    />
                </div>

                {/* Month / Year Selector + Totals */}
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <div className="flex gap-4 mb-4">
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border rounded-lg p-2"
                        >
                            {months.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="border rounded-lg p-2 w-24"
                        />
                    </div>

                    <p className="font-semibold">
                        Month Total ({month} {year}): ₹{monthTotal}
                    </p>
                    <p className="font-semibold mt-2">
                        Grand Total (All months): ₹{grandTotal}
                    </p>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
                <h2 className="text-lg font-bold mb-4">
                    Expenses - {month} {year}
                </h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Year</th>
                            <th className="p-2 border">Month</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthExpenses.map((exp) => (
                            <tr key={exp.id}>
                                <td className="p-2 border">{exp.type}</td>
                                <td className="p-2 border">{exp.name}</td>
                                <td className="p-2 border">₹{exp.amount}</td>
                                <td className="p-2 border">{exp.year}</td>
                                <td className="p-2 border">{exp.month}</td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() =>
                                            exp.type === "Default"
                                                ? removeDefault(exp.id)
                                                : removeSpecific(exp.id)
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {monthExpenses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-3 text-gray-500">
                                    No expenses added
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
