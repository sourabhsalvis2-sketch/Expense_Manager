import React from "react";

type Expense = {
    id: number;
    name: string;
    amount: number;
};

type SpecificExpense = {
    id: number;
    name: string;
    amount: number;
};

type MonthCardProps = {
    month: string;
    year: number;
    defaults: Expense[];
    specifics: SpecificExpense[];
    onRemoveSpecific: (id: number) => void;
    onRemoveDefault: (id: number) => void;
};

const MonthCard: React.FC<MonthCardProps> = ({
    month,
    year,
    defaults,
    specifics,
    onRemoveSpecific,
    onRemoveDefault,
}) => {
    const defaultTotal = defaults.reduce((sum, d) => sum + Number(d.amount), 0);
    const specificTotal = specifics.reduce((sum, s) => sum + Number(s.amount), 0);
    const total = defaultTotal + specificTotal;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">
                {month} {year}
            </h3>
            <p className="text-slate-500">Total: ₹{total.toLocaleString()}</p>

            <div className="mt-3">
                <h4 className="text-sm text-slate-500">Defaults</h4>
                <ul className="mt-1 space-y-1 text-sm">
                    {defaults.map((d) => (
                        <li key={d.id} className="flex justify-between items-center">
                            <span>
                                {d.name} – ₹{Number(d.amount).toLocaleString()}
                            </span>
                            <button
                                onClick={() => onRemoveDefault(d.id)}
                                className="ml-2 text-red-500 hover:underline text-xs"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-3">
                <h4 className="text-sm text-slate-500">Specifics</h4>
                <ul className="mt-1 space-y-1 text-sm">
                    {specifics.map((s) => (
                        <li key={s.id} className="flex justify-between items-center">
                            <span>
                                {s.name} – ₹{Number(s.amount).toLocaleString()}
                            </span>
                            <button
                                onClick={() => onRemoveSpecific(s.id)}
                                className="ml-2 text-red-500 hover:underline text-xs"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MonthCard;
