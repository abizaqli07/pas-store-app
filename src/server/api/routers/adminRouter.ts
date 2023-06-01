import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { productRouter } from "./adminRouter/productRouter";
import { variantRouter } from "./adminRouter/variantRouter";

export const adminRouter = createTRPCRouter({
  product: productRouter,
  variant: variantRouter,
});
