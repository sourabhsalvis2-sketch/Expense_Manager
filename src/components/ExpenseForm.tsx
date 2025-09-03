import React, { useState } from "react";

interface Props {
    onAddDefault: (name: string, amount: number) => void;
    onAddSpecific: (name: string, amount: number, year: number, month: string) => void;
    year: number;
    month: string;
}

export default function ExpenseForm({ onAddDefault, onAddSpecific, year, month }: Props) {
    const [type, setType] = useState<"DEFAULT" | "SPECIFIC">("DEFAULT");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || amount <= 0) return;
        if (type === "DEFAULT") onAddDefault(name, amount);
        else onAddSpecific(name, amount, year, month);
        setName("");
        setAmount(0);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
            <div className="flex gap-2">
                <label>
                    <input
                        type="radio"
                        value="DEFAULT"
                        checked={type === "DEFAULT"}
                        onChange={() => setType("DEFAULT")}
                    />{" "}
                    Default
                </label>
                <label>
                    <input
                        type="radio"
                        value="SPECIFIC"
                        checked={type === "SPECIFIC"}
                        onChange={() => setType("SPECIFIC")}
                    />{" "}
                    Specific
                </label>
            </div>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Expense Name"
                className="w-full border p-2 rounded text-sm"
            />

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Amount"
                className="w-full border p-2 rounded text-sm"
            />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded p-2 text-sm"
            >
                Add Expense
            </button>
        </form>
    );
}
