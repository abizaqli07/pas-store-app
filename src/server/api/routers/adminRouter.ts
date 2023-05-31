import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { productRouter } from "./adminRouter/productRouter";

export const adminRouter = createTRPCRouter({
  product: productRouter
});
