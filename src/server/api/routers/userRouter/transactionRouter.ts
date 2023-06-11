import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  orderProduct: protectedProcedure
    .input(z.object({
      productId: z.string().cuid(),
      variantId: z.string().cuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const order = await ctx.prisma.order.create({
          data: {
            userId: userId,
            productId: input.productId,
            variantId: input.variantId
          }
        })

        return {
          success: true,
          message: "Product successfully ordered",
          error: order.id,
        }

      } catch (error) {
        return {
          success: false,
          message: "Failed ordering product, some error occured",
          error: error,
        }
      }

    }),
  getUserOrder: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const data = await ctx.prisma.order.findMany({
        include: {
          product: true,
          variant: true,
          premium: true,
        },
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return data
    }),
  getUserOrderDetail: protectedProcedure
    .input(z.object({
      id: z.string().cuid()
    }))
    .query(async ({ input, ctx }) => {

      const data = await ctx.prisma.order.findFirst({
        where: {
          id: input.id
        },
        include: {
          product: true,
          variant: true,
          premium: true,
        }
      })

      return data
    }),
  uploadPayment: protectedProcedure
    .input(z.object({
      transactionId: z.string().cuid(),
      image: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.prisma.order.update({
          where: {
            id: input.transactionId
          },
          data: {
            image: input.image
          }
        })

      } catch (error) {
        return {
          success: false,
          message: "Failed uploading proof of payment, some error occured",
          error: error,
        }
      }

      return {
        success: true,
        message: "Proof of payment successfully uploaded",
        error: null,
      }
    }),
  cancelOrder: protectedProcedure
    .input(z.object({
      transactionId: z.string().cuid()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const del = await ctx.prisma.order.delete({
          where: {
            id: input.transactionId
          }
        })
      } catch (e) {
        return {
          success: false,
          message: "Failed deleting order, Some error occured",
          error: e
        }
      }

      return {
        success: true,
        message: "Order succesfully deleted",
        error: null
      }
    })
});