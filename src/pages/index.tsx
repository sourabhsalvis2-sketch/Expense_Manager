import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ExpenseForm from "../components/ExpenseForm"
import MonthCard from "../components/MonthCard"
import ConfirmDialog from "../components/ConfirmDialog"
import toast from "react-hot-toast"

// Types
interface Expense {
    id: string
    name: string
    amount: number
}
interface SpecificExpense extends Expense {
    year: number
    month: number
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function Home() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [defaults, setDefaults] = useState<Expense[]>([])
    const [specifics, setSpecifics] = useState<SpecificExpense[]>([])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ type: "default" | "specific"; id: string } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const { data: defaultsData } = await supabase.from("default_expenses").select("*")
            const { data: specificsData } = await supabase.from("specific_expenses").select("*")
            if (defaultsData) setDefaults(defaultsData)
            if (specificsData) setSpecifics(specificsData)
        }
        fetchData()
    }, [])

    // Add default
    const addDefault = async (name: string, amount: number) => {
        const { data, error } = await supabase.from("default_expenses").insert([{ name, amount }]).select()
        if (error) toast.error("Failed to add default")
        if (data) {
            setDefaults([...defaults, ...data])
            toast.success("Default added")
        }
    }
    // Add specific
    const addSpecific = async (name: string, amount: number, year: number, month: number) => {
        const { data, error } = await supabase.from("specific_expenses").insert([{ name, amount, year, month }]).select()
        if (error) toast.error("Failed to add specific expense")
        if (data) {
            setSpecifics([...specifics, ...data])
            toast.success("Expense added")
        }
    }

    // Delete handlers
    const confirmDelete = (type: "default" | "specific", id: string) => {
        setDeleteTarget({ type, id })
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return

        try {
            if (deleteTarget.type === "default") {
                const { error } = await supabase.from("defaults_expenses").delete().eq("id", deleteTarget.id)
                if (error) throw error
                setDefaults(defaults.filter(d => d.id !== deleteTarget.id))
            } else {
                const { error } = await supabase.from("specific_expenses").delete().eq("id", deleteTarget.id)
                if (error) throw error
                setSpecifics(specifics.filter(s => s.id !== deleteTarget.id))
            }
            toast.success("Expense deleted successfully")
        } catch {
            toast.error("Failed to delete expense")
        }

        setConfirmOpen(false)
        setDeleteTarget(null)
    }

    const handleCancelDelete = () => {
        setConfirmOpen(false)
        setDeleteTarget(null)
    }

    // Totals
    const defaultsTotal = defaults.reduce((acc, d) => acc + Number(d.amount), 0)
    const grandTotal = months.reduce((acc, m) => {
        const specificsForMonth = specifics.filter(s => s.year === year && s.month === months.indexOf(m) + 1)
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
                            <h4 className="text-sm text-slate-500">Defaults</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                {defaults.map(d => (
                                    <li key={d.id} className="flex justify-between items-center">
                                        <span>{d.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span>₹{Number(d.amount).toLocaleString()}</span>
                                            <button
                                                onClick={() => confirmDelete("default", d.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {months.map(m => (
                        <MonthCard
                            key={m}
                            month={m}
                            defaults={defaults}
                            specifics={specifics.filter(s => s.year === year && s.month === months.indexOf(m) + 1)}
                            onRemoveDefault={(id) => confirmDelete("default", id)}
                            onRemoveSpecific={(id) => confirmDelete("specific", id)}
                        />
                    ))}
                </section>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmOpen}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    )
}
