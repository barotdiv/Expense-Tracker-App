import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CategoryPieChart = ({ expenses }) => {
    const categoryData = expenses.reduce((acc, expense) => {
        const existing = acc.find(
            item => item.name === expense.category
        );
        if (existing) {
            existing.value += expense.amount;
        } else {
            acc.push({
                name: expense.category,
                value: expense.amount,
            });
        }
        return acc;
    }, []);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryPieChart;