import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from '@/app/lib/data';
import bcrypt from 'bcrypt';
import { z } from 'zod';



async function getUserByEmail(email: string | null | undefined): Promise<User | undefined> {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
  
  async function createUserFromGoogleProfile(profile: any): Promise<User> {
    try {
      // Extract user information from Google profile
      const email = profile.email;
      const username = profile.name;
      const image = profile.picture;
  
      // Create a new user in the database
      const newUser = await sql<User>`
        INSERT INTO users (email, username, image)
        VALUES (${email}, ${username}, ${image})
        RETURNING *
      `;
  
      return newUser.rows[0];
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user.');
    }
  }

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
  
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
  
            const user = await getUser(email);
            if (!user) return null;
  
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
          }
  
          console.log('Invalid credentials');
          return null;
        },
      }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
    //   const sessionUser = await User.findOne({ email: session.user.email });
    //   session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
        try {
            // Check if the user exists in the database based on their email
            const existingUser = await getUserByEmail(profile?.email);
    
            // If the user exists, sign them in
            if (existingUser) {
              return true;
            }
    
            // If the user doesn't exist, create a new user using their Google profile
            await createUserFromGoogleProfile(profile);
    
            // Sign in the user after creating their account
            return true;
          } catch (error) {
            console.error('Error signing in:', error);
            return false;
          }
    },
  }
})
export { handler as GET, handler as POST }
