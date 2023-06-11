import { Order, Premium, Product, Variant } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import Callbacks from '~/components/common/Callbacks';
import Modals from '~/components/common/Modals';
import UserLayout from '~/components/user/UserLayout';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

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
  const [confirm, setConfirm] = useState({ visible: false, id: "" })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const trpcUtils = api.useContext();

  const deleteProduct = api.user.transaction.cancelOrder.useMutation({
    onSuccess: async (data) => {
      setCallback({ visible: true, data: data });
      setConfirm({ visible: false, id: "" });

      await trpcUtils.user.transaction.getUserOrder.invalidate()
    }
  })

  const handleConfirm = (id: string) => {
    setConfirm({ visible: true, id: id });
  }

  const handleDelete = () => {
    deleteProduct.mutate({ transactionId: confirm.id })
  }

  const handleClose = () => {
    setConfirm({ visible: false, id: "" })
    setCallback({ visible: false, data: null })
  }
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-8'>
      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      {confirm.visible && (
        <Modals
          action={handleDelete}
          close={handleClose}
        />
      )}

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
              onClick={() => handleConfirm(data.id)}
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

        <div className=' w-full flex justify-between items-center'>
          <div className=' text-2xl font-semibold'>User Transactions List</div>
          <Link href='/' className=' base__button bg-red-500 hover:bg-red-700 text-white'>Back</Link>
        </div>

        <UserTransactionView transaction={data} isLoading={isLoading} isError={isError} />

      </div>
    </UserLayout>
  )
}

export default Transaction