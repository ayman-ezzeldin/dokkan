import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { scryptHash } from '@/lib/auth';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        await connectDB();
        const email = String(creds?.email || '').toLowerCase().trim();
        const password = String(creds?.password || '');
        if (!email || !password) return null;
        const user = await User.findOne({ email });
        if (!user) return null;
        if (!user.passwordHash || !user.passwordSalt) return null;
        const salt = user.passwordSalt;
        const hash = await scryptHash(password, salt);
        if (hash !== user.passwordHash) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || (token as any).role || 'user';
        (token as any).firstName = (user as any).firstName ?? (token as any).firstName;
        (token as any).lastName = (user as any).lastName ?? (token as any).lastName;
        (token as any).phoneNumber = (user as any).phoneNumber ?? (token as any).phoneNumber;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).sub;
        (session.user as any).role = (token as any).role;
        (session.user as any).firstName = (token as any).firstName;
        (session.user as any).lastName = (token as any).lastName;
        (session.user as any).phoneNumber = (token as any).phoneNumber;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


