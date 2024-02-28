'use client'
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";

// Importe o componente ApexCharts dinamicamente
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart: React.FC = () => {
  const getLocalStorageData = (key: string) => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  const groupTasksByDate = (tasks: any[]) => {
    return tasks.reduce((acc: { [date: string]: number }, task: { completionDate: string }) => {
      const completionDate = format(new Date(task.completionDate), 'dd/MM/yyyy'); // Formatar a data
      acc[completionDate] = (acc[completionDate] || 0) + 1; // Incrementar a contagem de tarefas para a data
      return acc;
    }, {});
  }

  const doneTasks = getLocalStorageData('doneTasks');

  const tasksCompletedPerDate = groupTasksByDate(doneTasks);

  const uniqueDates = Object.keys(tasksCompletedPerDate).sort();

  const tasksCompletedCount = uniqueDates.map((date: string) => tasksCompletedPerDate[date]);

  const completionDates = uniqueDates;

  // Defina os dados do gráfico
  const chartData: ApexOptions = {
    series: [
      {
        name: "Número de Tarefas Concluídas",
        data: tasksCompletedCount,
      }
    ],
    chart: {
      height: 350,
      width: 800,
      type: "line", // Defina o tipo de gráfico como "line"
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true, // Habilitar os rótulos de dados para mostrar o número de tarefas concluídas
      formatter: function(val: any) {
        return val; // Exibir o valor diretamente sem formatação adicional
      }
    },
    stroke: {
      curve: "straight"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // Linhas de grade alternadas
        opacity: 0.5
      }
    },
    xaxis: {
      categories: completionDates
    }
  };

  return (
    <div>

      <Chart options={chartData} series={chartData.series} type="line" height={350} />
    </div>
  );
};

export default LineChart;
