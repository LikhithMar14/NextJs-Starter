import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from "../prisma/prisma"
import Google from "next-auth/providers/google"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"

 
export const { auth, handlers:{GET,POST}, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session:{strategy:"jwt"},
    ...authConfig,
    callbacks:{
        async signIn({user,account}){
            return true
        },
        async jwt({token,profile,account}){

            if(!token|| !token.sub)return token
            const existingUser = await getUserById(token?.sub);

            if(!existingUser)return token;

            const existingAccount = await getAccountByUserId(existingUser?.id);

            token.isOauth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.image = existingUser.image;
            



            // console.log("Token:",token);
            // console.log("Profile:",profile);
            // console.log("Account:",account);
            return token
        },
        async session({token,session}){
            //This will only run when the users are authenticated
            return {
                ...session,
                user:{
                    ...session.user,
                    id:token.sub,
                    isOauth: token.isOauth
                }
            }
        }
    },


})