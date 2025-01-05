"use server";

import * as z from "zod";
import { prisma } from "../../prisma/prisma";

import {  LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";



export const login = async (data: z.infer<typeof LoginSchema>) => {


    const validatedData = LoginSchema.parse(data);


    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    let { email, password } = validatedData;

    email = email.toLocaleLowerCase()




    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log("User Exists: ", userExists);

    if(!userExists || !userExists.password ){
      console.log("Invalid credentials")
      return { error: "Invalid email or password" };
    }

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirectTo: '/',
      });
      console.log(response)
      console.log("Hello 3")
      
      return {success:"Login Successful"}
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials"};
          case "CredentialsSignin":
            throw error;
          default:
            return { success: "Login Successful" };
        }
      }
      throw error
    }
};