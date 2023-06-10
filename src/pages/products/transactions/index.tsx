import { Order, Premium, Product, Variant } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import UserLayout from '~/components/user/UserLayout';
import { api } from '~/utils/api'

interface transactionProps {
  transaction: (Order & {
    product: Product;
    variant: Variant;
    premium: Premium | null;
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
      {transaction.map((data) => (
        <div key={data.id} className=' p-6 bg-primaryLight shadow-lg flex flex-col rounded-lg gap-4'>
          <div>
            <div>Product Name : {data.product.name}</div>
            <div>Product Variant : {data.variant.name}</div>
          </div>

          <div>
            <div>Active Period : {data.variant.active_period} Month</div>
            <div>Price : {data.variant.price.toString()}</div>
          </div>

          <div>
            {data.image == null ? (
              <div className=' bg-red-300 px-4 py-2 rounded-lg flex gap-2 items-center w-fit'><BsExclamationTriangle />Packet ordered, Please complete the payment</div>
            ) : (
              <div>
                {data.premium == null ? (
                  <div className=' bg-red-300 px-4 py-2 rounded-lg flex gap-2 items-center w-fit'><BsExclamationTriangle />Wait admin send your account</div>
                ) : (
                  <div className=' bg-lime-300 px-4 py-2 rounded-lg flex gap-2 items-center w-fit'><BsCheckCircle />Your accunt has been sended</div>
                )}
              </div>
            )}
          </div>

          <div className=' flex gap-4 items-center'>
            <Link
              href={`${router.pathname}/${data.id}`}
              className=' base__button border-2 border-lime-500 hover:bg-lime-500 hover:text-white'
            >View Details</Link>
            <div
              className=' base__button border-2 border-red-500 hover:bg-red-500 hover:text-white'
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
    <UserLayout>
      <div className=' mt-24 container mx-auto flex flex-col gap-8'>
        <div className=' text-2xl font-semibold'>User Transactions List</div>

        <UserTransactionView transaction={data} isLoading={isLoading} isError={isError} />

      </div>
    </UserLayout>
  )
}

export default Transaction