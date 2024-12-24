"use client";

import { NextRequest, NextResponse } from 'next/server'
import { RootState, store, useAppSelector } from '@/store/store';
import { cookies } from 'next/headers';
 
// 1. Specify protected and public routes
export const protectedRoutes = ['/activity', '/assignment/[id]', '/bank', 
  "/change-password", "/chat", "/chat/[id]", "/company", "/discount", "/discount/[id]",
  "/home", "/interview", "/interview/[id]",  "/invitation", "/invitation/[id]", "/invitation/feedback",
  "/payments",  "/profile", "/request", "/request/[id]", "/wallet", "/work-history", 
  "/work-log/end-session", "/work-log/log-date-list", "/work-log/log-hour-list", "/work-log/log-time-manually", 
  "/work-log/track-work", "/about-yourself", "/civil-id", "/complete", "/dob", "/driver-licence", 
  "/education-complete", "/educations", "/experience", "/gender", "/objective", "/nationality", 
  "/personal-photo", "/personal-info-complete", "/phone-number", "/preferred-time", "/profile-url", 
  "/skills", "/video"]

export const publicRoutes = ['/login', '/', "/verify-email/[email]", 
  "/forgot-password", "/reset-password", "/name", "/email"]
 
export default async function middleware(req: NextRequest) {

  const state = store.getState(); // Get the state directly from the store

  const { isAuthenticated } = state.auth;  
  
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
   
  console.log(path, isProtectedRoute, isPublicRoute, isAuthenticated);

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  
  if (
    isPublicRoute &&
    isAuthenticated &&
    !req.nextUrl.pathname.startsWith('/home')
  ) {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }
 
  //todo:
  /*if(!isProfileCompleted && isAuthenticated) {
    return NextResponse.redirect(new URL('/complete-profile', req.nextUrl))
  }*/
     
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}