import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
// import { compare } from 'bcrypt';
import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

const prisma = new PrismaClient();

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    debug: true,
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/sign-in',
        /// signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/sign-up',
    },
    site: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    // TODO: Credentials sign-in & sign-up
    providers: [
        // CredentialsProvider({
        //     name: 'Login',
        //     credentials: {
        //         login: { label: 'Login', type: 'text' },
        //         password: { label: 'Password', type: 'password' },
        //     },
        //     authorize: async (credentials) => {
        //         if (credentials === undefined) {
        //             return null;
        //         }
        //         const { login, password } = credentials;
        //         // console.log(credentials);

        //         const user = await prisma.user.findUnique({
        //             where: { login },
        //         });
        //         // console.log(user);
        //         // console.log('compare:', await compare(password, user?.password || ''));
        //         await prisma.$disconnect();
        //         if (user === null || await compare(password, user.password)) {
        //             return null;
        //         }
        //         return {
        //             id: user.id.toString(),
        //             name: user.name,
        //             email: user.email,
        //         };
        //     },
        // }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
    ],
};

export default NextAuth(authOptions);
