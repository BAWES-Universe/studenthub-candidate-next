"use client"

import { Hero } from "@/components/on-board/hero";
import { store } from "@/store/store";
import HomePage from "./(dash)/home/page";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function DefaultPage() {

  const state = store.getState(); // Get the state directly from the store

  const { isAuthenticated } = state.auth;  

  useEffect(() => {
    if (isAuthenticated)
    {
      redirect("/home");
      return;
    }
  }, []);

  return (
    <>
      { isAuthenticated? <HomePage />: <Hero /> }
    </>
  );
}
