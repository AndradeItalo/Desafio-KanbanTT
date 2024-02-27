"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import React from "react";
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter(); 
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav style={{ background: 'pink', color: 'white', padding: '1rem', height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexGrow: 1, justifyContent: 'space-around' }}>
          <Avatar>
            <AvatarImage src="../../tt.png" />
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
        </ul>
        <div onClick={() => handleNavigation('/')}>
          <h1 style={{ color: 'black', fontSize: '24px', margin: 0 }}>Kanban Board</h1>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexGrow: 1, justifyContent: 'space-around' }}>
          <Button onClick={() => handleNavigation('/dashboard')}>DashBoard</Button>
        </ul>
      </div>
    </nav>
  );
};
