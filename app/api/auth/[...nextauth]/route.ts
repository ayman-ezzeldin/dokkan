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
          fullName: user.fullName,
          phonePrimary: user.phonePrimary,
          phoneSecondary: user.phoneSecondary,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || (token as any).role || 'user';
        (token as any).fullName = (user as any).fullName ?? (token as any).fullName;
        (token as any).phonePrimary = (user as any).phonePrimary ?? (token as any).phonePrimary;
        (token as any).phoneSecondary = (user as any).phoneSecondary ?? (token as any).phoneSecondary;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).sub;
        (session.user as any).role = (token as any).role;
        (session.user as any).fullName = (token as any).fullName;
        (session.user as any).phonePrimary = (token as any).phonePrimary;
        (session.user as any).phoneSecondary = (token as any).phoneSecondary;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


