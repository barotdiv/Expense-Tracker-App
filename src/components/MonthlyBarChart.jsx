import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const MonthlyBarChart = ({ expenses }) => {
    const monthlyData = expenses.reduce((acc, expense) => {
        const month = new Date(
            expense.date
        ).toLocaleDateString("default", {
            month: "short",
        });
        const existing = acc.find(
            item => item.month === month
        );
        if (existing) {
            existing.amount += expense.amount;
        } else {
            acc.push({
                month,
                amount: expense.amount,
            });
        }
        return acc;
    }, []);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MonthlyBarChart;



