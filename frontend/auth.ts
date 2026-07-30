import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'text@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // メールアドレスとパスワードが一致したらダミーのユーザーを返す
        if (
          credentials.email === 'admin@example.com' &&
          credentials.password === 'password123'
        ) {
          return {
            id: '1',
            name: '管理者ユーザー',
            email: 'admin@example.com',
          };
        }

        // 認証失敗
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
});
