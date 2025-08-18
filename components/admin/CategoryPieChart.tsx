import React, { useMemo, useState } from 'react';
import { Order, Product } from '../../types';

interface CategoryPieChartProps {
    orders: Order[];
    products: Product[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ orders, products }) => {
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

    const categoryData = useMemo(() => {
        const salesByCategory: { [key: string]: { name: string; value: number } } = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const categoryId = product.category.id;
                    if (!salesByCategory[categoryId]) {
                        salesByCategory[categoryId] = { name: product.category.name, value: 0 };
                    }
                    salesByCategory[categoryId].value += item.price * item.quantity;
                }
            });
        });

        const totalValue = Object.values(salesByCategory).reduce((sum, cat) => sum + cat.value, 0);

        return Object.values(salesByCategory)
            .sort((a, b) => b.value - a.value)
            .map(cat => ({
                ...cat,
                percentage: totalValue > 0 ? (cat.value / totalValue) * 100 : 0,
            }));

    }, [orders, products]);

    if (categoryData.length === 0) {
        return <div className="text-center py-12 text-slate-500 h-full flex items-center justify-center">No sales data to display category breakdown.</div>;
    }

    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };
    
    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                <svg viewBox="-1.2 -1.2 2.4 2.4" className="transform -rotate-90">
                    {categoryData.map((slice, index) => {
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercent / 100);
                        cumulativePercent += slice.percentage;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercent / 100);
                        const largeArcFlag = slice.percentage > 50 ? 1 : 0;
                        const isHovered = hoveredSlice === slice.name;

                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `L 0 0`,
                        ].join(' ');

                        return (
                            <path
                                key={slice.name}
                                d={pathData}
                                fill={COLORS[index % COLORS.length]}
                                className={`transition-transform duration-200 ${isHovered ? 'transform scale-110' : 'transform-none'}`}
                                onMouseEnter={() => setHoveredSlice(slice.name)}
                                onMouseLeave={() => setHoveredSlice(null)}
                            />
                        );
                    })}
                </svg>
                {hoveredSlice && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                           <p className="text-sm font-bold text-slate-800">{hoveredSlice}</p>
                           <p className="text-xs text-slate-600">{categoryData.find(c => c.name === hoveredSlice)?.percentage.toFixed(1)}%</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full">
                <ul className="space-y-2 text-sm">
                    {categoryData.map((slice, index) => (
                         <li 
                            key={slice.name} 
                            className="flex justify-between items-center"
                            onMouseEnter={() => setHoveredSlice(slice.name)}
                            onMouseLeave={() => setHoveredSlice(null)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span className="font-medium text-slate-700">{slice.name}</span>
                            </div>
                            <span className="font-semibold text-slate-800">{slice.percentage.toFixed(1)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryPieChart;