import React, { useState } from "react";

interface ExpenseFormProps {
    onAddDefault: (name: string, amount: number) => void;
    onAddSpecific: (name: string, amount: number, year: number, month: string) => void;
    defaults: { id: number; name: string; amount: number }[];
    specifics: { id: number; name: string; amount: number; year: number; month: string }[];
    onRemoveDefault: (id: number) => void;
    onRemoveSpecific: (id: number) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function ExpenseForm({
    onAddDefault,
    onAddSpecific,
    defaults,
    specifics,
    onRemoveDefault,
    onRemoveSpecific,
}: ExpenseFormProps) {
    const [type, setType] = useState<"default" | "specific">("default");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(months[new Date().getMonth()]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount) return;

        if (type === "default") {
            onAddDefault(name, amount);
        } else {
            onAddSpecific(name, amount, year, month);
        }

        setName("");
        setAmount(0);
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 border-b pb-4 mb-4"
            >
                {/* Type selection */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={type === "default"}
                            onChange={() => setType("default")}
                        />
                        Add Default
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={type === "specific"}
                            onChange={() => setType("specific")}
                        />
                        Add Specific
                    </label>
                </div>

                {/* Fields */}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mt-1 w-full border rounded p-2"
                    />
                </div>

                {type === "specific" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Year</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="mt-1 w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="mt-1 w-full border rounded p-2"
                            >
                                {months.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                    Add Expense
                </button>
            </form>

            {/* Table for quick view */}
            <div>
                <h3 className="font-semibold mb-2">Current Expenses</h3>
                <table className="w-full border text-sm">
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
                        {defaults.map((d) => (
                            <tr key={`d-${d.id}`}>
                                <td className="p-2 border">Default</td>
                                <td className="p-2 border">{d.name}</td>
                                <td className="p-2 border">₹{d.amount}</td>
                                <td className="p-2 border">–</td>
                                <td className="p-2 border">–</td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => onRemoveDefault(d.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {specifics.map((s) => (
                            <tr key={`s-${s.id}`}>
                                <td className="p-2 border">Specific</td>
                                <td className="p-2 border">{s.name}</td>
                                <td className="p-2 border">₹{s.amount}</td>
                                <td className="p-2 border">{s.year}</td>
                                <td className="p-2 border">{s.month}</td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => onRemoveSpecific(s.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {defaults.length === 0 && specifics.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 p-3">
                                    No expenses added yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
