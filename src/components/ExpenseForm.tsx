import React, { useState } from 'react'
import { supabase } from '../lib/supabase';

async function addDefault(name: string, amount: number) {
    const { data, error } = await supabase
        .from("defaults")
        .insert([{ name, amount }]);
    if (error) console.error(error);
}

// Add a month-specific expense
async function addSpecific(name: string, amount: number, year: number, month: number) {
    const { data, error } = await supabase
        .from("specifics")
        .insert([{ name, amount, year, month }]);
    if (error) console.error(error);
}

export default function ExpenseForm({ onAddDefault, onAddSpecific, defaults }: any) {
    const [dName, setDName] = useState('')
    const [dAmount, setDAmount] = useState('')
    const [sName, setSName] = useState('')
    const [sAmount, setSAmount] = useState('')
    const [sYear, setSYear] = useState(new Date().getFullYear())
    const [sMonth, setSMonth] = useState(new Date().getMonth() + 1)


    return (
        <div className="p-4 rounded-2xl shadow bg-white space-y-4">
            <h2 className="text-lg font-semibold">Add Expense</h2>


            <div>
                <h3 className="font-medium">Add default recurring</h3>
                <div className="flex gap-2 mt-2">
                    <input value={dName} onChange={e => setDName(e.target.value)} placeholder="Name" className="flex-1 p-2 border rounded" />
                    <input value={dAmount} onChange={e => setDAmount(e.target.value)} placeholder="Amount" className="w-36 p-2 border rounded" />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { if (dName && dAmount) { onAddDefault(dName, Number(dAmount)); setDName(''); setDAmount(''); } }}>Add</button>
                </div>
            </div>


            <div>
                <h3 className="font-medium">Add specific to month</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
                    <input value={sName} onChange={e => setSName(e.target.value)} placeholder="Name" className="col-span-2 p-2 border rounded" />
                    <input value={sAmount} onChange={e => setSAmount(e.target.value)} placeholder="Amount" className="p-2 border rounded" />
                    <input type="number" value={sYear} onChange={e => setSYear(Number(e.target.value))} className="p-2 border rounded" />
                    <select value={sMonth} onChange={e => setSMonth(Number(e.target.value))} className="p-2 border rounded">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="col-span-5 md:col-span-1">
                        <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded" onClick={() => { if (sName && sAmount) { onAddSpecific(sName, Number(sAmount), sYear, sMonth); setSName(''); setSAmount(''); } }}>Add Specific</button>
                    </div>
                </div>
            </div>


            <div>
                <h4 className="text-sm text-slate-500">Defaults quick-add</h4>
                <div className="flex gap-2 mt-2">
                    {defaults.slice(0, 5).map((d: any) => (
                        <button key={d.id} className="px-2 py-1 border rounded text-sm" onClick={() => onAddSpecific(d.name + ' (adj)', Number(d.amount), new Date().getFullYear(), new Date().getMonth() + 1)}>
                            +{d.name}
                        </button>
                    ))}
                </div>
            </div>


        </div>
    )
}