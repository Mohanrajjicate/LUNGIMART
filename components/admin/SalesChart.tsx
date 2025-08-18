import React, { useMemo } from 'react';
import { Order } from '../../types';

interface SalesChartProps {
    orders: Order[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
    const salesByMonth = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData: { [key: string]: number } = {};

        orders.forEach(order => {
            const date = new Date(order.date);
            const month = date.getMonth();
            const year = date.getFullYear();
            const key = `${year}-${String(month).padStart(2, '0')}`; // e.g., "2023-09"
            
            if (!monthlyData[key]) {
                monthlyData[key] = 0;
            }
            monthlyData[key] += order.total;
        });

        // Sort keys and format for chart
        return Object.keys(monthlyData).sort().map(key => {
            const [year, month] = key.split('-');
            return {
                name: `${monthNames[parseInt(month)]} '${String(year).slice(2)}`,
                total: monthlyData[key],
            };
        });
    }, [orders]);

    if (salesByMonth.length === 0) {
        return <div className="text-center py-12 text-slate-500">No sales data to display.</div>;
    }

    const maxValue = Math.max(...salesByMonth.map(d => d.total));
    const chartHeight = 250;
    const barWidth = 40;
    const barMargin = 20;
    const svgWidth = salesByMonth.length * (barWidth + barMargin);
    
    // Y-axis labels
    const yAxisLabels = useMemo(() => {
        const labels = [];
        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            labels.push(Math.round((maxValue / steps) * i));
        }
        return labels;
    }, [maxValue]);

    return (
        <div className="w-full overflow-x-auto">
            <svg width={svgWidth} height={chartHeight + 40} className="font-sans">
                {/* Y-axis labels and grid lines */}
                 {yAxisLabels.map((label, i) => (
                    <g key={i}>
                        <text x="0" y={chartHeight - (i * (chartHeight / 4))} dy="0.3em" className="text-xs fill-slate-500">
                            ₹{label.toLocaleString()}
                        </text>
                        <line 
                            x1="50" 
                            x2={svgWidth} 
                            y1={chartHeight - (i * (chartHeight / 4))} 
                            y2={chartHeight - (i * (chartHeight / 4))}
                            className="stroke-slate-200"
                            strokeDasharray="2,2"
                        />
                    </g>
                ))}
                
                {salesByMonth.map((data, index) => {
                    const barHeight = (data.total / maxValue) * chartHeight;
                    const x = index * (barWidth + barMargin) + 60; // Offset for Y-axis labels
                    const y = chartHeight - barHeight;

                    return (
                        <g key={index} className="group">
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                className="fill-primary/70 hover:fill-primary transition-colors"
                            />
                            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-xs font-semibold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                ₹{data.total.toLocaleString()}
                            </text>
                            <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle" className="text-xs font-medium fill-slate-600">
                                {data.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default SalesChart;
