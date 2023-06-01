import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const variantRouter = createTRPCRouter({
  // getProduct: protectedProcedure
  //   .input(z.object({
  //     id: z.string().cuid()
  //   }))
  //   .query(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.product.findFirst({
  //       where: {
  //         id: input.id
  //       }
  //     })

  //     return {
  //       data
  //     }
  //   }),
  getAllProduct: protectedProcedure
    .query(async ({ ctx }) => {
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
  // updateProduct: protectedProcedure
  //   .input(z.object({
  //     id: z.string().cuid(),
  //     name: z.string(),
  //     small_description: z.string(),
  //     description: z.string(),
  //     is_active: z.boolean(),
  //   }))
  //   .mutation(async ({ input, ctx }) => {
  //     try {
  //       const edit = await ctx.prisma.product.update({
  //         where: {
  //           id: input.id
  //         },
  //         data: {
  //           name: input.name,
  //           small_description: input.small_description,
  //           description: input.description,
  //           is_active: input.is_active
  //         }
  //       })
  //     } catch (e) {
  //       return {
  //         success: false,
  //         message: "Failed updating product, Some error occured",
  //         error: e
  //       }
  //     }

  //     return {
  //       success: true,
  //       message: "Product succesfully updated",
  //       error: null
  //     }
  //   }),
  // deleteProduct: protectedProcedure
  //   .input(z.object({
  //     id: z.string().cuid()
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const del = await ctx.prisma.product.delete({
  //         where: {
  //           id: input.id
  //         }
  //       })
  //     } catch (e) {
  //       return {
  //         success: false,
  //         message: "Failed deleting product, Some error occured",
  //         error: e
  //       }
  //     }

  //     return {
  //       success: true,
  //       message: "Product succesfully deleted",
  //       error: null
  //     }
  //   })
});
