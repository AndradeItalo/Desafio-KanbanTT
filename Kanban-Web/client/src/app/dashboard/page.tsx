"use client";

import React from 'react';
import BarChart from '@/components/Chartbar';
import { ApolloProvider } from '@apollo/client';
import client from '../gql/apolloClient';
import { Separator } from "@/components/ui/separator"
import LineChart from '@/components/Chartline';

export default function DashBoard() {
    return (
        <ApolloProvider client={client}>
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='flex'>
                    <div className='w-1/2 mr-4 flex flex-col items-center'>
                        <h1 className='text-2xl font-bold mb-4'>Distribuição das Tarefas</h1>
                        <BarChart />
                    </div>
                    <div className="mx-32">
                        <Separator orientation="vertical" />
                    </div>
                    <div className='w-1/2 ml-4 flex flex-col items-center'>
                        <h1 className='text-2xl font-bold mb-4'>Histórico de Conclusão</h1>
                        <LineChart />
                    </div>
                </div>
            </div>
        </ApolloProvider>
    );
}
