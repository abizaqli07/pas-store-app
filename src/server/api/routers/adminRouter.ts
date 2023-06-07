import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { productRouter } from "./adminRouter/productRouter";
import { variantRouter } from "./adminRouter/variantRouter";
import { orderRouter } from "./adminRouter/orderRouter";

export const adminRouter = createTRPCRouter({
  product: productRouter,
  variant: variantRouter,
  order: orderRouter,
});
