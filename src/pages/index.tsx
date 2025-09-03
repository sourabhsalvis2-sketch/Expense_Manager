import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const years = [2025, 2026, 2027, 2028, 2029, 2030];

export default function Home() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(months[new Date().getMonth()]);

    // Load expenses from Supabase
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("expenses").select("*");
            if (error) console.error(error);
            else setExpenses(data || []);
        };
        fetchData();
    }, []);

    // Add Default
    const addDefault = async (name: string, amount: number) => {
        const { data, error } = await supabase
            .from("expenses")
            .insert([{ type: "DEFAULT", name, amount }])
            .select();
        if (!error && data) setExpenses((prev) => [...prev, ...data]);
    };

    // Add Specific
    const addSpecific = async (name: string, amount: number, year: number, month: string) => {
        const { data, error } = await supabase
            .from("expenses")
            .insert([{ type: "SPECIFIC", name, amount, year, month }])
            .select();
        if (!error && data) setExpenses((prev) => [...prev, ...data]);
    };

    // Remove Expense
    const removeExpense = async (id: string) => {
        const { error } = await supabase.from("expenses").delete().eq("id", id);
        if (!error) setExpenses((prev) => prev.filter((e) => e.id !== id));
    };

    // Defaults (global for all months)
    const defaults = expenses.filter((e) => e.type === "DEFAULT");

    // Specifics for selected month
    const specifics = expenses.filter(
        (e) => e.type === "SPECIFIC" && e.year === year && e.month === month
    );

    // Month view = defaults + specifics
    const monthExpenses = [
        ...defaults.map((d) => ({ ...d, year, month })), // project defaults into selected month
        ...specifics,
    ];

    // Totals
    const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const grandTotal =
        defaults.reduce((sum, d) => sum + Number(d.amount) * 12, 0) +
        specifics.reduce((sum, s) => sum + Number(s.amount), 0);

    return (
        <div className="min-h-screen bg-gray-100 p-2 flex justify-center">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-4">
                <h1 className="text-xl font-bold mb-4 text-center">Expense Tracker</h1>

                {/* Form */}
                <ExpenseForm
                    onAddDefault={addDefault}
                    onAddSpecific={addSpecific}
                    year={year}
                    month={month}
                />

                {/* Month & Year Selectors */}
                <div className="flex gap-2 mb-4">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded p-2 text-sm flex-1"
                    >
                        {months.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border rounded p-2 text-sm flex-1"
                    >
                        {years.map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                    <p className="font-semibold">Month Total: ₹{monthTotal}</p>
                    <p className="font-semibold">Grand Total: ₹{grandTotal}</p>
                </div>

                {/* Table */}
                <ExpenseTable
                    expenses={monthExpenses}
                    onRemove={removeExpense}
                />
            </div>
        </div>
    );
}
