import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // ログイン画面のURL
  const isLoginPage = nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage && nextUrl.pathname.includes("/edit")) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
