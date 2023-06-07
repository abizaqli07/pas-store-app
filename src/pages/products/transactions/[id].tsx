import { Order, Premium, Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
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

const UserTransactionDetailView = ({ transactionId, transaction, isLoading, isError }: transactionProps) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const [imagePayment, setImagePayment] = useState<string | ArrayBuffer | null>();
  const router = useRouter();

  const imageOrder = api.user.transaction.uploadPayment.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  function convertToBase(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    var file = e.target.files;

    var reader = new FileReader();
    if (file != null && file.length > 0) {
      reader.readAsDataURL(file[0] as Blob);
      reader.onload = () => {
        setImagePayment(reader.result)
      }
    }
  }

  async function handleUpload() {
    imageOrder.mutate({
      transactionId: transactionId as string,
      image: imagePayment as string
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined || transaction == null) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-8'>
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
          <div>Packet ordered, plese complete the payment</div>

          {transaction.image == null ? (
            <div>
              <div>Upload Proof of Payment</div>
              <div>
                <input type="file" accept='image/' onChange={convertToBase} />
                <div
                  onClick={() => handleUpload()}
                  className=' bg-lime-500 w-fit cursor-pointer'
                >Upload Image</div>

              </div>
            </div>
          ) : (
            <div>
              {transaction.premium == null ? (
                <div>Wait for admin sending your account</div>
              ) : (
                <div>
                  <div>Username/Email : {transaction.premium.email}</div>
                  <div>Username/Email : {transaction.premium.password}</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const TransactionDetails = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isLoading, isError } = api.user.transaction.getUserOrderDetail.useQuery({
    id: id as string
  })

  return (
    <div>
      <div>Transactions Details</div>

      <UserTransactionDetailView transactionId={id} transaction={data} isLoading={isLoading} isError={isError} />

    </div>
  )
}

export default TransactionDetails