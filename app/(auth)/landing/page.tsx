"use client"

import { Hero } from "@/components/on-board/hero";
//import { logout } from "@/store/slices/authSlice";
import { store, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 
export default function LandingPage() {
 /*
  //const dispatch = useAppDispatch();
  const { isAuthenticated } = store.getState().auth;// useAppSelector((state) => state.auth);

  useEffect(() => {
    
    const router = useRouter();

    if (isAuthenticated) {
      router.push("/home");
    }
  }, []);
*/
  return <Hero />;
}
