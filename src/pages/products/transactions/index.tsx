import { Order, Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react'
import { api } from '~/utils/api'

interface transactionProps {
  transaction: (Order & {
    product: Product;
    variant: Variant;
  })[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const UserTransactionView = ({ transaction, isLoading, isError }: transactionProps) => {
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-8'>
      {transaction.filter((data) => { return data.status === "ORDERED" }).map((data) => (
        <div className=' flex flex-col gap-4 bg-gray-200'>
          <div>
            <div>{data.product.name}</div>
            <div>{data.variant.name}</div>
          </div>

          <div>
            <div>{data.variant.active_period} Month</div>
            <div>{data.variant.price.toString()}</div>
          </div>

          <div>
            <div>Packet ordered, plese complete the payment</div>
            <div
              className=' bg-lime-500 cursor-pointer w-fit'
              onClick={() => router.push(`${router.pathname}/${data.id}`)}
            >View Details</div>
            <div
              className=' bg-red-500 cursor-pointer w-fit'
            >Cancel Order</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Transaction = () => {
  const { data, isLoading, isError } = api.user.transaction.getUserOrder.useQuery();

  return (
    <div>
      <div>User Transactions List</div>

      <UserTransactionView transaction={data} isLoading={isLoading} isError={isError} />

    </div>
  )
}

export default Transaction