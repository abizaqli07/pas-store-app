import { Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router'
import { useState } from 'react'
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

interface DetailProductProps {
  product: (Product & {
    Variant: Variant[];
  });
  isLoading: boolean;
  isError: boolean;
  productId: string | string[] | undefined;

}

const UserDetailProductView = ({ productId, product, isLoading, isError }: DetailProductProps) => {
  const [variantTab, setVariantTab] = useState(product.Variant[0]?.id)
  const [confirm, setConfirm] = useState({ visible: false })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const router = useRouter()

  const orderProduct = api.user.transaction.orderProduct.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const handleConfirm = () => {
    setConfirm({ visible: true });
  }

  const handleOrder = async () => {
    setConfirm({ visible: false })
    if(productId != undefined && variantTab != undefined){
      orderProduct.mutate({
        productId: productId as string,
        variantId: variantTab
      })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (product == null) return <div>Data Not Found</div>

  return (
    <div className=' flex flex-col gap-8'>
      {callback.visible && (
        <div className=' popup'>
          <div>{callback.data?.message}</div>
          <div>{callback.data?.error ? callback.data.error : ""}</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700 w-fit' onClick={() => router.push('/products/transactions/')}>Close</div>
          </div>
        </div>
      )}

      {confirm.visible && (
        <div className=' popup'>
          <div>You want to order this package?</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700' onClick={() => setConfirm({ visible: false })}>Cancel</div>
            <div className='button__danger' onClick={() => handleOrder()}>Confirm</div>
          </div>
        </div>
      )}

      <div>
        <div>{product.name}</div>
        <div>{product.description}</div>
      </div>

      <div className=' flex gap-4'>
        {product.Variant.map((data) => (
          <div
            className={`px-4 py-2 cursor-pointer ${data.id == variantTab
              ? "bg-lime-400"
              : "border-2 border-lime-400"
              }`}
            key={data.id}
            onClick={() => setVariantTab(data.id)}
          >{data.name}</div>
        ))}
      </div>


      <div>
        {product.Variant.filter((fil) => {
          return fil.id == variantTab;
        }).map((variant) => (
          <div key={variant.id}>
            <div>{variant.name}</div>
            <div>{variant.type == "SHARED" ? "Shared" : "Dedicated"}</div>
            <div>{variant.price.toString()}</div>
            <div>{variant.active_period} Month</div>
          </div>
        ))}
      </div>

      <button
        className=' px-4 py-2 bg-lime-400'
        onClick={() => handleConfirm()}
      >Order</button>
    </div>
  )
}

const UserDetailProduct = () => {
  const router = useRouter();
  const { id } = router.query;


  const { data, isLoading, isError } = api.user.product.getProduct.useQuery({ id: id as string })

  if (data == undefined || data.data == null) {
    return (
      <div>Data not found</div>
    )
  }

  return (
    <div>
      <div></div>
      <div>
        <UserDetailProductView productId={id} product={data.data} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  )
}

export default UserDetailProduct