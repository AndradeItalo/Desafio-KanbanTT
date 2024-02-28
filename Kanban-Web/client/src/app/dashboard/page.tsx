"use client";

import React from 'react';
import BarChart from '@/components/Chartbar';
import { ApolloProvider } from '@apollo/client';
import client from '../gql/apolloClient';
import { Separator } from "@/components/ui/separator"
import LineChart from '@/components/Chartline';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashBoard() {
    const router = useRouter(); 
    const handleNavigation = (path: string) => {
      router.push(path);
    };

    return (
        <ApolloProvider client={client}>
            <div className="relative">
                <Button onClick={() => handleNavigation('/')} className="mt-10 ml-20 fixed">KANBAN --&gt;</Button>
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
            </div>
        </ApolloProvider>
    );
}


