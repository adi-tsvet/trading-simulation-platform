import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "trader@example.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0],
              role: credentials.email.includes("admin") ? "ADMIN" : "TRADER",
            },
          })
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as "TRADER" | "ADMIN"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
  },
  session: { strategy: "jwt" },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }