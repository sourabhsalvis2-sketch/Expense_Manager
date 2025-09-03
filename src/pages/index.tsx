import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ExpenseForm from "../components/ExpenseForm"
import MonthCard from "../components/MonthCard"

// Types for expenses
interface Expense {
    id: number
    name: string
    amount: number
}

interface SpecificExpense {
    id: number
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
    // State
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // 1–12
    const [defaults, setDefaults] = useState<Expense[]>([])
    const [specifics, setSpecifics] = useState<SpecificExpense[]>([])
    const [deleteTarget, setDeleteTarget] = useState<{ type: "default" | "specific"; id: number } | null>(null)

    // Load data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            const { data: defaultsData } = await supabase.from("defaults").select("*")
            const { data: specificsData } = await supabase.from("specifics").select("*")
            if (defaultsData) setDefaults(defaultsData)
            if (specificsData) setSpecifics(specificsData)
        }
        fetchData()
    }, [])

    // Add default expense
    const addDefault = async (name: string, amount: number) => {
        const { data } = await supabase.from("defaults").insert([{ name, amount }]).select()
        if (data) setDefaults([...defaults, ...data])
    }

    // Add specific expense
    const addSpecific = async (name: string, amount: number, year: number, month: string) => {
        const { data } = await supabase.from("specifics").insert([{ name, amount, year, month: Number(month) }]).select()
        if (data) setSpecifics([...specifics, ...data])
    }

    // Delete confirm + handle
    const confirmDelete = (type: "default" | "specific", id: number) => {
        setDeleteTarget({ type, id })
    }

    useEffect(() => {
        const performDelete = async () => {
            if (!deleteTarget) return

            try {
                if (deleteTarget.type === "default") {
                    const { error } = await supabase.from("defaults").delete().eq("id", deleteTarget.id)
                    if (error) throw error
                    setDefaults(defaults.filter(d => d.id !== deleteTarget.id))
                } else {
                    const { error } = await supabase.from("specifics").delete().eq("id", deleteTarget.id)
                    if (error) throw error
                    setSpecifics(specifics.filter(s => s.id !== deleteTarget.id))
                }
            } catch (err) {
                console.error("Delete error:", err)
            } finally {
                setDeleteTarget(null)
            }
        }
        performDelete()
    }, [deleteTarget])

    // Totals
    const defaultsTotal = defaults.reduce((acc, d) => acc + Number(d.amount), 0)
    const grandTotal = months.reduce((acc, m, idx) => {
        const specificsForMonth = specifics.filter(s => s.year === year && s.month === idx + 1)
        const specificsTotal = specificsForMonth.reduce((a, b) => a + Number(b.amount), 0)
        return acc + defaultsTotal + specificsTotal
    }, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold">Monthly Expense Manager</h1>
                    <p className="text-sm text-slate-600">
                        Recurring defaults + month-specific expenses. Stored in Supabase.
                    </p>
                </header>

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

                        <div className="mt-4">
                            <label className="block text-sm font-medium">Select Month</label>
                            <select
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(Number(e.target.value))}
                                className="mt-2 border rounded p-2 w-full"
                            >
                                {months.map((m, idx) => (
                                    <option key={idx + 1} value={idx + 1}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1">
                    <MonthCard
                        month={months[selectedMonth - 1]}
                        year={year}
                        defaults={defaults}
                        specifics={specifics.filter(s => s.year === year && s.month === selectedMonth)}
                        onRemoveSpecific={(id) => confirmDelete("specific", id)}
                        onRemoveDefault={(id) => confirmDelete("default", id)}
                    />
                </section>
            </div>
        </div>
    )
}
