import { prisma } from "../../prisma/prisma";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    });
    return account;
  } catch (err) {
    console.log(err);
    return null;
  }
};
