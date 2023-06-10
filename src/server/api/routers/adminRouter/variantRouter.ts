import { TYPE } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const variantRouter = createTRPCRouter({
  getVariant: protectedProcedure
    .input(z.object({
      id: z.string().cuid()
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.variant.findFirst({
        where: {
          id: input.id
        }
      })

      return {
        data
      }
    }),
  getAllVariant: protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        include: {
          Variant: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return {
        data
      }
    }),
  createVariant: protectedProcedure
    .input(z.object({
      productId: z.string().cuid(),
      name: z.string(),
      active_period: z.number(),
      type: z.nativeEnum(TYPE),
      price: z.bigint()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const insert = await ctx.prisma.variant.create({
          data: {
            productId: input.productId,
            name: input.name,
            active_period: input.active_period,
            type: input.type,
            price: BigInt(input.price)
          }
        })
      } catch (error) {
        return {
          success: false,
          message: "Failed creating variant, some error occured",
          error: error,
        }
      }

      return {
        success: true,
        message: "Variant successfully created",
        error: null,
      }
    }),
  updateVariant: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      name: z.string(),
      active_period: z.number(),
      type: z.nativeEnum(TYPE),
      price: z.bigint()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const edit = await ctx.prisma.variant.update({
          where: {
            id: input.id
          },
          data: {
            name: input.name,
            active_period: input.active_period,
            price: BigInt(input.price),
            type: input.type
          }
        })
      } catch (e) {
        return {
          success: false,
          message: "Failed updating product, Some error occured",
          error: e
        }
      }

      return {
        success: true,
        message: "Product succesfully updated",
        error: null
      }
    }),
  deleteVariant: protectedProcedure
    .input(z.object({
      id: z.string().cuid()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const del = await ctx.prisma.variant.delete({
          where: {
            id: input.id
          }
        })
      } catch (e) {
        return {
          success: false,
          message: "Failed deleting product, Some error occured",
          error: e
        }
      }

      return {
        success: true,
        message: "Product succesfully deleted",
        error: null
      }
    })
});
