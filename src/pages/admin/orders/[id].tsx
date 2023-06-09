import { Order, Premium, Product, Variant } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import AdminLayout from '~/components/admin/AdminLayout';
import Callbacks from '~/components/common/Callbacks';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

interface transactionProps {
  transactionId: string | string[] | undefined;
  transaction: (Order & {
    product: Product;
    variant: Variant;
    premium: Premium | null;
  }) | null | undefined;
  isLoading: boolean;
  isError: boolean;
}

const OrderDetailView = ({ transactionId, transaction, isLoading, isError }: transactionProps) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const router = useRouter();

  const insertData = api.admin.order.sendAccount.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const formik: FormikProps<userAccountInterface> = useFormik<userAccountInterface>({
    initialValues: {
      email: "",
      password: "",
      transactionId: transactionId as string
    },
    onSubmit
  })

  async function onSubmit(values: userAccountInterface) {
    insertData.mutate(values)
  }

  const handleClose = () => {
    setCallback({ visible: false, data: null })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined || transaction == null) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-12'>
      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      <div className=' flex flex-col gap-8 shadow-xl p-6 rounded-lg'>

        <div className=' p-4 border-2 border-dotted border-primary rounded-lg flex flex-col gap-6'>
          <div className=' text-xl font-medium'>Orders Detail</div>
          <div className=' flex flex-col gap-3'>
            <div>Product Name : {transaction.product.name}</div>
            <div>Product Variant : {transaction.variant.name}</div>
            <div>Active Period : {transaction.variant.active_period} Month</div>
            <div>Price : {transaction.variant.price.toString()}</div>
            <div>Product Type : {transaction.variant.type == "SHARED" ? "Shared" : "Dedicated"}</div>
          </div>
        </div>

        <div className=' flex flex-col gap-12 justify-center items-center text-center p-4 border-2 border-primary rounded-lg'>
          <div className=' flex flex-col gap-4'>
            <div className=' font-semibold'>Proof of Payment</div>
            {transaction.image == null ? (
              <div className=' bg-red-300 px-4 py-2 rounded-lg flex gap-2 items-center'><BsExclamationTriangle /> Please wait user sending proof of payment</div>
            ) : (
              <div className=' relative w-full aspect-[4/6]'>
                <Image src={transaction.image} alt='proof of payment' fill />
              </div>
            )}
          </div>

          <div className=' flex flex-col gap-4'>
            <div className=' font-semibold'>Send Account</div>

            {transaction.premium == null ? (
              <>
                {transaction.image == null ? (
                  <div className=' bg-red-300 px-4 py-2 rounded-lg flex gap-2 items-center'><BsExclamationTriangle /> This action cannot be done before user sending proof of payment</div>
                ) : (
                  <div className=' w-full'>
                    <form onSubmit={formik.handleSubmit} className=' w-full flex flex-col gap-4'>
                      <div className='flex flex-col input__wrapper'>
                        <label>Username/Email</label>
                        <input
                          id='email'
                          type="text"
                          placeholder='name'
                          className=' input__field '
                          required {...formik.getFieldProps('email')}
                        />
                      </div>
                      <div className='flex flex-col input__wrapper'>
                        <label>Password</label>
                        <input
                          id='password'
                          type="text"
                          placeholder='small_description'
                          className=' input__field '
                          required {...formik.getFieldProps('password')}
                        />
                      </div>
                      <div>
                        <input className=' base__button bg-lime-500 hover:bg-lime-700 text-white' type="submit" value="Send" />
                      </div>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className=' bg-lime-300 px-4 py-2 rounded-lg flex gap-2 items-center'><BsCheckCircle /> Account has been sended</div>
            )}
          </div>
        </div>

      </div >
    </div >
  )
}

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isLoading, isError } = api.admin.order.getOrderDetail.useQuery({
    id: id as string
  })

  return (
    <AdminLayout>
      <div className=' flex flex-col gap-8 my-6'>
        <div className=' flex justify-between items-center'>
          <div className=' text-xl font-medium'>Transaction Details</div>
          <div onClick={() => router.push("/admin/orders")} className=' base__button bg-red-500 hover:bg-red-800 text-white'>Back</div>
        </div>

        <OrderDetailView transactionId={id} transaction={data} isLoading={isLoading} isError={isError} />
      </div>
    </AdminLayout>
  )
}

export default OrderDetails