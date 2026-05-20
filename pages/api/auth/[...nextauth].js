
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        assisstant_code: {
          label: 'Assistant Code',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assisstant_code: credentials?.assisstant_code,
              password: credentials?.password,
            }),
          });

          const response = await res.json();
          console.log("NEXTAUTH RESPONSE:", response); 
          console.log("STATUS:", response.status); 
          console.log("TOKEN:", response.token);

          console.log('LOGIN RESPONSE:', response);

          if (response.status === true) {
            return {
              id: response.payload.id,
              name: response.payload.name,
              assistantCode: response.payload.assisstant_code,
              token: response.token,
            };
          }

          console.log("LOGIN FAILED"); 
          return null;
        } catch (error) {
          console.log('AUTH ERROR:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.assistantCode = user.assistantCode;
        token.token = user.token;
      }

      return token;
    },


    async session({ session, token }) {

      session.user.id = token.id;
      session.user.name = token.name;
      session.user.assistantCode = token.assistantCode;
      session.user.token = token.token;

      return session;
    }
  },


  pages: {
      signIn: '/SignIn',
    },
  });

