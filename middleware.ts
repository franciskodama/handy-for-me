export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

// Match any route (/.*)
// EXCEPT for routes that start with:

// /api
// /_next/static
// /_next/image
// /favicon.ico

// ==========================================
// matcher allows you to filter Middleware to run on specific paths.
// export const config = {
//   matcher: '/about/:path*'
// };

// ==========================================
// Clerk Reference

//   import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// export default clerkMiddleware((auth, req) => {
//   if (!isPublicRoute(req)) auth().protect();
// });

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//   ],
// };
