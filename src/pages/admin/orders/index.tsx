import { Order, Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react'
import AdminLayout from '~/components/admin/AdminLayout';
import { api } from '~/utils/api'

interface transactionProps {
  transaction: (Order & {
    product: Product;
    variant: Variant;
  })[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const OrderView = ({ transaction, isLoading, isError }: transactionProps) => {
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined || transaction.length == 0 ) return <div>No order yet</div>


  return (
    <div className=' flex flex-col gap-8'>
      {transaction.map((data) => (
        <div key={data.id} className=' flex flex-col gap-4 bg-gray-200'>
          <div>
            <div>{data.product.name}</div>
            <div>{data.variant.name}</div>
          </div>

          <div>
            <div>{data.variant.active_period} Month</div>
            <div>{data.variant.price.toString()}</div>
          </div>

          <div>
            <div
              className=' bg-lime-500 cursor-pointer w-fit'
              onClick={() => router.push(`${router.pathname}/${data.id}`)}
            >View Details</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Orders = () => {
  const { data, isLoading, isError } = api.admin.order.getAllOrder.useQuery();

  return (
    <AdminLayout>

      <div className=' flex flex-col gap-8'>
        <div className=' w-full bg-slate-500 flex flex-col gap-4 p-6 rounded-xl'>
          <div>User Order List :</div>
        </div>

        <OrderView transaction={data} isLoading={isLoading} isError={isError} />

      </div>
    </AdminLayout>
  )
}

export default Orders