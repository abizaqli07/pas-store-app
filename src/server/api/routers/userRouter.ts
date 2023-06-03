import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { productRouter } from "./userRouter/productRouter";

export const userRouter = createTRPCRouter({
  product: productRouter
});