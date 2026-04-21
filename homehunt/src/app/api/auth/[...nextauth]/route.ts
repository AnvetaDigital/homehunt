import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
    async signIn({ user }) {
      await connectDB();

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      }

      user.id = existingUser._id.toString();
      return true;
    },

    async jwt({ token, user }) {
    if (user) {
      token.id = user.id; // store in JWT
    }
    return token;
  },

    async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string; // read from JWT and add to session
    }
    return session;
  },

}
})

export { handler as GET, handler as POST };


/*
1) User clicks Login
Button calls signIn("google")
This is handled by NextAuth.js

2️)Redirect to Google
User goes to Google OAuth screen
Enters credentials & consent

This uses your:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

3) Callback to your app
Google redirects back to your app with an authorization code

4) NextAuth exchanges code for tokens
NextAuth.js takes the code and gets access & ID tokens from Google

5) NextAuth verifies tokens
NextAuth.js checks the tokens are valid and extracts user info (email, name, image)

6) User info stored in session
NextAuth creates a session for the user with their info

7) User is logged in
Your app now knows the user is authenticated and can show personalized content  

8) User clicks Logout
Button calls signOut()
NextAuth.js clears the session and logs the user out
*/  