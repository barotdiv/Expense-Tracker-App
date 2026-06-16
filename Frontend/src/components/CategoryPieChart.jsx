import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
const COLORS = [
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#0088FE"
];

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
                <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >
                    {categoryData.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryPieChart;