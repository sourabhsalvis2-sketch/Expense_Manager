import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function Home() {
    const currentMonth = months[new Date().getMonth()];
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [year, setYear] = useState(new Date().getFullYear());

    const [defaults, setDefaults] = useState<
        { id: number; description: string; amount: number }[]
    >([]);
    const [specifics, setSpecifics] = useState<
        { id: number; description: string; amount: number; year: number; month: string }[]
    >([]);

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<"default" | "specific">("default");

    // Fetch from Supabase
    useEffect(() => {
        const fetchExpenses = async () => {
            const { data, error } = await supabase.from("expenses").select("*");
            if (error) {
                console.error("Error fetching:", error);
                return;
            }
            if (data) {
                setDefaults(data.filter((e) => e.type === "default"));
                setSpecifics(data.filter((e) => e.type === "specific"));
            }
        };
        fetchExpenses();
    }, []);

    // Add Expense
    const addExpense = async () => {
        if (!description || amount <= 0) return;

        if (type === "default") {
            const newItem = { id: Date.now(), description, amount };
            setDefaults((prev) => [...prev, newItem]);

            await supabase.from("expenses").insert([
                { type: "default", description, amount, year }
            ]);
        } else {
            const newItem = { id: Date.now(), description, amount, year, month: selectedMonth };
            setSpecifics((prev) => [...prev, newItem]);

            await supabase.from("expenses").insert([
                { type: "specific", description, amount, year, month: selectedMonth }
            ]);
        }

        setDescription("");
        setAmount(0);
    };

    // Remove Expense
    const removeExpense = async (id: number, type: string) => {
        if (type === "Default") {
            setDefaults((prev) => prev.filter((e) => e.id !== id));
        } else {
            setSpecifics((prev) => prev.filter((e) => e.id !== id));
        }
        await supabase.from("expenses").delete().eq("id", id);
    };

    // Month Expenses (defaults always show, specifics only if month/year match)
    const monthExpenses = [
        ...defaults.map((d) => ({
            ...d,
            type: "Default",
            year,
            month: selectedMonth,
        })),
        ...specifics
            .filter((s) => s.year === year && s.month === selectedMonth)
            .map((s) => ({ ...s, type: "Specific" })),
    ];

    // Totals
    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const grandTotal =
        defaults.reduce((sum, d) => sum + d.amount * 12, 0) +
        specifics.reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

                {/* Selectors */}
                <div className="flex gap-4 mb-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
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

                {/* Add Form */}
                <div className="mb-6">
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                value="default"
                                checked={type === "default"}
                                onChange={() => setType("default")}
                            />{" "}
                            Default
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="specific"
                                checked={type === "specific"}
                                onChange={() => setType("specific")}
                            />{" "}
                            Specific
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg p-2 w-full mb-2"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="border rounded-lg p-2 w-full mb-2"
                    />

                    <button
                        onClick={addExpense}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Add Expense
                    </button>
                </div>

                {/* Totals */}
                <div className="mb-4">
                    <p className="font-semibold">
                        Month Total ({selectedMonth} {year}): ₹{monthTotal}
                    </p>
                    <p className="font-semibold">
                        Grand Total (All months): ₹{grandTotal}
                    </p>
                </div>

                {/* Table */}
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Description</th>
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
                                <td className="p-2 border">{exp.description}</td>
                                <td className="p-2 border">₹{exp.amount}</td>
                                <td className="p-2 border">{exp.year}</td>
                                <td className="p-2 border">{exp.month}</td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => removeExpense(exp.id, exp.type)}
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
