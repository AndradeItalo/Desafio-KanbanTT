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
    <nav className="bg-slate-500 p-1 h-[70px] w-full flex justify-center items-center border-b-2">
      <div className="flex justify-around items-center w-full">
        <div className="flex flex-grow justify-around">
          <ModeToggle/>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
        </div>
        <div className="flex flex-grow justify-around">
          <Button onClick={() => handleNavigation('/dashboard')}>DashBoard</Button>
        </div>
        <div>
         
        </div>
      </div>
    </nav>
  );
};
