import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getProduct: protectedProcedure
    .query( async({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        orderBy: {
          createdAt: "desc"
        }
      })

      return {
        data
      }
    }),
  createProduct: protectedProcedure
    .input(z.object({
      name: z.string(),
      small_description: z.string(),
      description: z.string(),
      is_active: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const insert = await ctx.prisma.product.create({
          data: {
            name: input.name,
            small_description: input.small_description,
            description: input.description,
            is_active: input.is_active
          }
        })
      } catch (error) {
        return {
          success: false,
          message: "Failed creating product, some error occured",
          error: error,
        }
      }

      return {
        success: true,
        message: "Product successfully created",
        error: null,
      }
    }),
});
