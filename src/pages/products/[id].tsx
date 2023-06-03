import { Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router'
import { useState } from 'react'
import { api } from '~/utils/api';

interface DetailProductProps {
  product: (Product & {
    Variant: Variant[];
  }) | null;
  isLoading: boolean;
  isError: boolean;

}

const UserDetailProductView = ({ product, isLoading, isError }: DetailProductProps) => {
  if (isLoading) return <div>Loading...</div>
  if (isError || product == null) return <div>Error...</div>

  const [variantTab, setVariantTab] = useState(product.Variant[0]?.id)

  return (
    <div className=' flex flex-col gap-8'>
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
      >Order</button>
    </div>
  )
}

const UserDetailProduct = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError } = api.user.product.getProduct.useQuery({ id: id as string })

  return (
    <div>
      <div></div>
      <div>
        {data != undefined && (<UserDetailProductView product={data.data} isLoading={isLoading} isError={isError} />)}
      </div>
    </div>
  )
}

export default UserDetailProduct