'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Importa a função dynamic do Next.js


// Importa o componente Chart dinamicamente usando a função dynamic
const DynamicChart = dynamic(() => import('react-apexcharts'), { ssr: false });


const BarChart: React.FC = () => {
  const getLocalStorageData = (key: string) => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  const todoTasks = getLocalStorageData('todoTasks');
  const inProgressTasks = getLocalStorageData('inProgressTasks');
  const doneTasks = getLocalStorageData('doneTasks');

  const taskCounts = {
    todo: todoTasks.length,
    inProgress: inProgressTasks.length,
    done: doneTasks.length,
  };

  // Definindo o estado para os dados do gráfico
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      labels: ['TO DO', 'IN PROGRESS', 'DONE'],
    },
    series: [
      { name: 'Tasks', data: [taskCounts.todo, taskCounts.inProgress, taskCounts.done] },
    ],
  });

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <DynamicChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            width="500"
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
