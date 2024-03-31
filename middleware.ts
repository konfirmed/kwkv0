// import { NextResponse, NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(request: NextRequest) {
//   const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

//   if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }



// Import necessary types from Next.js and next-auth
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Correctly type the request parameter and asynchronously fetch the session token
export async function middleware(request: NextRequest) {
  // Ensure your NEXTAUTH_SECRET environment variable is set in .env.local
  const sessionToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If there's no session and the path starts with "/dashboard", redirect to "/login"
  if (!sessionToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Use NextResponse.redirect to direct the user to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed with the request if the session exists or the path doesn't require authentication
  return NextResponse.next();
}