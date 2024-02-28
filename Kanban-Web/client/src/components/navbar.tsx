"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import React from "react";
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

export const Navbar = () => {
  const router = useRouter(); 
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-background p-1 h-[70px] flex justify-center items-center border-b-2">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        <div style={{ listStyle: 'none', display: 'flex', flexGrow: 1, justifyContent: 'space-around' }}>
          <ModeToggle/>
        </div>
        <div onClick={() => handleNavigation('/')}>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
        </div>
        <div style={{ listStyle: 'none', display: 'flex', flexGrow: 1, justifyContent: 'space-around' }}>
          <Button onClick={() => handleNavigation('/dashboard')}>DashBoard</Button>
        </div>
        <div>
         
        </div>
      </div>
    </nav>
  );
};
