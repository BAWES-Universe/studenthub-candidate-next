"use client"

import { useAppSelector } from "@/store/store";
//import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DefaultPage() {
 
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
 
    if (isAuthenticated)
    {
      redirect("/home");
    } else {
      redirect("/landing");
    }  
    
  }, []);
}
