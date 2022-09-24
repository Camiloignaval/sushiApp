import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { db, dbUsers } from "../../../database";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          email: "Correo",
          type: "email",
          placeholder: "correo@mail.com",
        },
        password: {
          email: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],

  //   custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: "jwt",
    updateAge: 86400, //1d
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          // case "oauth":
          //   token.user = await dbUsers.oAuthToDbUser(
          //     user?.email || "",
          //     user?.name || ""
          //   );
          //   break;
          case "credentials":
            token.user = user;
            break;

          default:
            break;
        }
      }
      return token;
    },
    async session({ session, user, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
