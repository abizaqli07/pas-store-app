import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { productRouter } from "./userRouter/productRouter";
import { transactionRouter } from "./userRouter/transactionRouter";

export const userRouter = createTRPCRouter({
  product: productRouter,
  transaction: transactionRouter,
});