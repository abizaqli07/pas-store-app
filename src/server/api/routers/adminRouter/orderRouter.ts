import { z } from "zod";
import { hash } from "bcryptjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getAllOrder: protectedProcedure
    .query(async ({ ctx }) => {

      const data = await ctx.prisma.order.findMany({
        include: {
          product: true,
          variant: true,
        },
        where: {
          status: "ORDERED"
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return data
    }),
  getOrderDetail: protectedProcedure
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
          premium: true
        }
      })

      return data
    }),
  sendAccount: protectedProcedure
    .input(z.object({
      email: z.string(),
      password: z.string(),
      transactionId: z.string().cuid()
    }))
    .mutation(async ({ ctx, input }) => {
      const encrypted = await hash(input.password, 12);
      try {
        const insert = await ctx.prisma.premium.create({
          data: {
            email: input.email,
            password: encrypted,
            orderId: input.transactionId
          }
        })

        const order = await ctx.prisma.order.update({
          where: {
            id: input.transactionId
          },
          data: {
            status: "COMPLETED"
          }
        })
      } catch (error) {
        return {
          success: false,
          message: "Failed sending account, some error occured",
          error: error,
        }
      }

      return {
        success: true,
        message: "Account successfully sended",
        error: null,
      }
    }),
  getHistoryTransaction: protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.order.findMany({
        include: {
          product: true,
          variant: true,
          premium: true
        },
        where: {
          status: "COMPLETED"
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return data
    })

});
