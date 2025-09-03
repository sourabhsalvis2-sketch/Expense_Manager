import React, { useState } from "react";

type Props = {
    onAdd: (type: string, description: string, amount: number, year: number, month: string) => void;
    months: string[];
    year: number;
    month: string;
};

export default function ExpenseForm({ onAdd, months, year, month }: Props) {
    const [type, setType] = useState("default");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount <= 0) return;
        onAdd(type, description, amount, year, month);
        setDescription("");
        setAmount(0);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-2xl shadow-lg"
        >
            <h2 className="text-xl font-bold text-indigo-700">➕ Add Expense</h2>

            {/* Expense Type */}
            <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={type === "default"}
                        onChange={() => setType("default")}
                        className="accent-indigo-600"
                    />
                    <span className="font-medium">Default</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={type === "specific"}
                        onChange={() => setType("specific")}
                        className="accent-indigo-600"
                    />
                    <span className="font-medium">Specific</span>
                </label>
            </div>

            {/* Description */}
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter expense description"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />

            {/* Amount */}
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Enter amount"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
            >
                Add Expense
            </button>
        </form>
    );
}
