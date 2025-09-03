import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ExpenseForm from "../components/ExpenseForm"
import MonthCard from "../components/MonthCard"

interface Expense {
    id: string
    name: string
    amount: number
}

interface SpecificExpense {
    id: string
    name: string
    amount: number
    year: number
    month: number
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function Home() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // default: current month
    const [defaults, setDefaults] = useState<Expense[]>([])
    const [specifics, setSpecifics] = useState<SpecificExpense[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const { data: defaultsData } = await supabase.from("default_expenses").select("*")
            const { data: specificsData } = await supabase.from("specific_expenses").select("*")
            if (defaultsData) setDefaults(defaultsData)
            if (specificsData) setSpecifics(specificsData)
        }
        fetchData()
    }, [])

    const addDefault = async (name: string, amount: number) => {
        const { data } = await supabase.from("default_expenses").insert([{ name, amount }]).select()
        if (data) setDefaults([...defaults, ...data])
    }

    const addSpecific = async (name: string, amount: number, year: number, month: string) => {
        const { data } = await supabase.from("specific_expenses").insert([{ name, amount, year, month }]).select()
        if (data) setSpecifics([...specifics, ...data])
    }

    const removeSpecific = async (id: string) => {
        await supabase.from("specific_expenses").delete().eq("id", id)
        setSpecifics(specifics.filter(s => s.id !== id))
    }

    const defaultsTotal = defaults.reduce((acc, d) => acc + Number(d.amount), 0)
    const grandTotal = months.reduce((acc, m, i) => {
        const specificsForMonth = specifics.filter(s => s.year === year && s.month === i + 1)
        const specificsTotal = specificsForMonth.reduce((a, b) => a + Number(b.amount), 0)
        return acc + defaultsTotal + specificsTotal
    }, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold">Monthly Expense Manager</h1>
                    <p className="text-sm text-slate-600">
                        Recurring defaults + month-specific expenses. Stored in Supabase.
                    </p>
                </header>

                {/* Form + Year + Totals */}
                <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <ExpenseForm
                            onAddDefault={addDefault}
                            onAddSpecific={addSpecific}
                            defaults={defaults}
                        />
                    </div>
                    <div className="p-4 rounded-2xl shadow bg-white">
                        <label className="block text-sm font-medium">Year</label>
                        <input
                            type="number"
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="mt-2 w-full border rounded p-2"
                        />

                        <div className="mt-4">
                            <h3 className="font-semibold">Grand total (all months)</h3>
                            <div className="text-2xl font-bold">
                                ₹{grandTotal.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Month Selector */}
                <section className="mb-6">
                    <label className="block text-sm font-medium mb-2">Select Month</label>
                    <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                        className="border p-2 rounded w-full md:w-1/3"
                    >
                        {months.map((m, i) => (
                            <option key={m} value={i + 1}>
                                {m}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Show only one month card */}
                <section>
                    <MonthCard
                        month={months[selectedMonth - 1]}
                        year={year}
                        defaults={defaults}
                        specifics={specifics.filter(
                            s => s.year === year && s.month === selectedMonth
                        )}
                        onRemoveSpecific={removeSpecific}
                    />
                </section>
            </div>
        </div>
    )
}
