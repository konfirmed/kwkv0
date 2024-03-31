import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { sql } from '@vercel/postgres';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await sql`
          SELECT * FROM users WHERE email=${credentials?.email}`;
        const user = response.rows[0];
        console.log('user =' , response)
        console.log('credentials =' , credentials)

        const passwordCorrect = await compare(
          credentials?.password || '',
          user.password
        );

        console.log({ passwordCorrect });

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '', // Providing default value
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '', // Providing default value
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '', // Providing default value
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '', // Providing default value
    }),
  ],
});
export { handler as GET, handler as POST };
