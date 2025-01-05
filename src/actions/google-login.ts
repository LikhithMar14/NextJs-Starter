"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"


export async function googleAuthenticate(){
    try{
        await signIn('google')
    }catch(err){
        if(err instanceof AuthError)return 'google logIn failed'
        
        throw err
    }
}