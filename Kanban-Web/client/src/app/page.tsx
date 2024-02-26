'use client'
import KanbanBoard from "@/components/KanbanBoard";
import Image from "next/image";
import { ApolloProvider } from "@apollo/client";
import client from "./gql/apolloClient";

export default function Home() {
  return (
  <ApolloProvider client={client}>
    <KanbanBoard />
  </ApolloProvider>
    
  );
}
