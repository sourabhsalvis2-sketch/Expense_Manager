type Props = {
    expenses: {
        id: string;
        type: "default" | "specific";
        description: string;
        amount: number;
        year: number;
        month: string;
    }[];
    onRemove: (id: string) => void;
};

export default function ExpenseTable({ expenses, onRemove }: Props) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Year</th>
                        <th className="border p-2">Month</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((e) => (
                        <tr key={e.id}>
                            <td className="border p-2">{e.type}</td>
                            <td className="border p-2">{e.description}</td>
                            <td className="border p-2">{e.amount}</td>
                            <td className="border p-2">{e.year}</td>
                            <td className="border p-2">{e.month}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => onRemove(e.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr className="font-bold bg-gray-200">
                        <td colSpan={2} className="border p-2 text-right">
                            Grand Total:
                        </td>
                        <td className="border p-2">{total}</td>
                        <td colSpan={3}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
