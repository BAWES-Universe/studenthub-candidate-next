import { NextRequest, NextResponse } from 'next/server'
import { RootState, useAppSelector } from '@/store/store';
 
// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {

    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
 
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
   
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