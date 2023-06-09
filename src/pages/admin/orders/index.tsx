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
  if (transaction == undefined || transaction.length == 0) return <div>No order yet</div>


  return (
    <div className=' flex flex-col gap-6'>
      {transaction.map((data) => (
        <div
          key={data.id}
          className=' p-6 bg-primaryLight shadow-lg flex flex-col rounded-lg gap-4'
        >
          <div>
            <div>Product Name : {data.product.name}</div>
            <div>Product Variant : {data.variant.name}</div>
          </div>

          <div>
            <div>Active Period : {data.variant.active_period} Month</div>
            <div>Price : {data.variant.price.toString()}</div>
          </div>

          <div>
            <div
              className=' base__button border-2 border-lime-500 hover:bg-lime-500 hover:text-white'
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
        <div className=' text-3xl'>Products List</div>

        <OrderView transaction={data} isLoading={isLoading} isError={isError} />

      </div>
    </AdminLayout>
  )
}

export default Orders