import React from "react"

interface Expense {
    id: string
    name: string
    amount: number
}

interface SpecificExpense extends Expense {
    year: number
    month: number
}

interface MonthCardProps {
    month: string
    year: number
    defaults: Expense[]
    specifics: SpecificExpense[]
    onRemoveSpecific: (id: string) => void
}

const MonthCard: React.FC<MonthCardProps> = ({
    month,
    year,
    defaults,
    specifics,
    onRemoveSpecific
}) => {
    const defaultsTotal = defaults.reduce((acc, d) => acc + Number(d.amount), 0)
    const specificsTotal = specifics.reduce((acc, s) => acc + Number(s.amount), 0)
    const monthlyTotal = defaultsTotal + specificsTotal

    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-indigo-600">
                {month} {year}
            </h3>

            <div className="mt-2 text-sm text-slate-600">
                <p>Defaults: ₹{defaultsTotal.toLocaleString()}</p>
                <p>Specific total: ₹{specificsTotal.toLocaleString()}</p>
                <p className="mt-1 font-bold">
                    Monthly total: ₹{monthlyTotal.toLocaleString()}
                </p>
            </div>

            {specifics.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                    {specifics.map(s => (
                        <li key={s.id} className="flex justify-between items-center">
                            <span>{s.name} — ₹{Number(s.amount).toLocaleString()}</span>
                            <button
                                onClick={() => onRemoveSpecific(s.id)}
                                className="text-red-500 text-xs hover:underline"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MonthCard
