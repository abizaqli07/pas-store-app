import { Order, Premium, Product, Variant } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useState } from 'react'
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

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined || transaction == null) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-12'>
      {callback.visible && (
        <div className='popup'>
          <div>{callback.data?.message}</div>
          <div>{callback.data?.error ? "Error Occured" : ""}</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700 w-fit' onClick={() => setCallback({ visible: false, data: null })}>Close</div>
          </div>
        </div>
      )}

      <div className=' flex flex-col gap-4 bg-gray-200'>
        <div>
          <div>{transaction.product.name}</div>
          <div>{transaction.variant.name}</div>
        </div>

        <div>
          <div>{transaction.variant.active_period} Month</div>
          <div>{transaction.variant.price.toString()}</div>
          <div>{transaction.variant.type == "SHARED" ? "Shared" : "Dedicated"}</div>
        </div>

        <div>
          <div>Proof of payment</div>
          {transaction.image == null ? (
            <div>Please wait user sending proof of payment</div>
          ) : (
            <Image src={transaction.image} alt='proof of payment' width={100} height={100}/>
          )}
        </div>

        <div className=' flex flex-col gap-4'>
          <div>Send Account</div>

          {transaction.premium == null ? (
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div className='flex flex-col'>
                  <label>Username/Email</label>
                  <input
                    id='email'
                    type="text"
                    placeholder='name'
                    required {...formik.getFieldProps('email')}
                  />
                </div>
                <div className='flex flex-col'>
                  <label>Password</label>
                  <input
                    id='password'
                    type="text"
                    placeholder='small_description'
                    required {...formik.getFieldProps('password')}
                  />
                </div>
                <div>
                  <input className=' bg-lime-500 cursor-pointer' type="submit" value="Send" />
                </div>
              </form>
            </div>
          ) : (
            <div>Account has been sent</div>
          )}
        </div>
      </div>
    </div>
  )
}

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isLoading, isError } = api.admin.order.getOrderDetail.useQuery({
    id: id as string
  })

  return (
    <div>
      <div>Transactions Details</div>

      <OrderDetailView transactionId={id} transaction={data} isLoading={isLoading} isError={isError} />

    </div>
  )
}

export default OrderDetails