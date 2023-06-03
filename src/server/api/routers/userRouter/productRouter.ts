import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAllProduct: protectedProcedure
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          is_active: true
        }
      })

      return {
        data
      }
    }),
  getProduct: protectedProcedure
    .input(z.object({
      id: z.string().cuid()
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findUnique({
        where: {
          id: input.id
        },
        include: {
          Variant: true
        }
      })

      return {
        data
      }
    }),
});