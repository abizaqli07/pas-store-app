import { Product, Variant } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Callbacks from '~/components/common/Callbacks';
import OrderModal from '~/components/common/OrderModal';
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

  const session = useSession();
  const router = useRouter();

  const orderProduct = api.user.transaction.orderProduct.useMutation({
    onSuccess: async (data) => {
      if (data.success) {
        await router.push(`/products/transactions/${data.error as string}`)
      } else {
        setCallback({ visible: true, data: data })
      }
    }
  })

  const handleConfirm = () => {
    setConfirm({ visible: true });
  }

  const handleOrder = () => {
    setConfirm({ visible: false })
    if (productId != undefined && variantTab != undefined) {
      orderProduct.mutate({
        productId: productId as string,
        variantId: variantTab
      })
    }
  }

  const handleClose = () => {
    setConfirm({ visible: false })
    setCallback({ visible: false, data: null })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (product == null) return <div>Data Not Found</div>

  return (
    <div className=' pt-28 pb-12'>

      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      {confirm.visible && (
        <OrderModal
          action={handleOrder}
          close={handleClose}
        />
      )}

      <div className="max-w-md border-2 mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-6xl">
        <div className="md:flex">
          <div className="md:shrink-0 flex-1 relative">
            {product.image != null ? (
              <Image className="w-full h-full object-fit" src={product.image} alt="" fill />
            ) : (
              <Image className="w-full h-full object-fit" src="/images/Viuviu.png" alt="" fill />
            )}
          </div>
          <div className="p-8 flex-1 gap-8 flex flex-col">
            <div>
              <h2 className="text-3xl font-bold pb-4">{product.name}</h2>
              <div>{product.description}</div>
            </div>

            <div className=' flex gap-4'>
              {product.Variant.length == 0 ? (
                <div>This product doesnt have variant, you cant order yet.</div>
              ) : (
                <div className=' flex flex-col gap-2'>
                  <div>Variant :</div>
                  <div className=' flex flex-wrap gap-2'>
                    {product.Variant.map((data) => (
                      <div
                        className={`base__button ${data.id == variantTab
                          ? "bg-primary"
                          : "border-2 border-primary hover:bg-primary"
                          }`}
                        key={data.id}
                        onClick={() => setVariantTab(data.id)}
                      >{data.name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {product.Variant.filter((fil) => {
                return fil.id == variantTab;
              }).map((variant) => (
                <div
                  key={variant.id}
                  className=' flex flex-col gap-2 font-medium'
                >
                  <div>Name : {variant.name}</div>
                  <div>Type : {variant.type == "SHARED" ? "Shared" : "Dedicated"}</div>
                  <div>Price : {variant.price.toString()}</div>
                  <div>Active period : {variant.active_period} Month</div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center pb-7">
              {session.status === 'unauthenticated' ? (
                <div className=' px-4 py-2 bg-gray-200 rounded-lg'>
                  You have to login before ordering account
                </div>
              ) : (
                <button
                  className="px-32 bg-amber-400 py-3 hover:bg-amber-500 rounded-xl text-xl disabled:bg-gray-300"
                  onClick={() => handleConfirm()}
                  disabled={product.Variant.length == 0 ? true : false}
                >Order</button>
              )}
            </div>

            <div className="bg-slate-300 rounded-3xl p-7 me-4">
              <h1>Catatan :</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
          </div>
        </div>
      </div>
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
    <div className=' container mx-auto py-12'>
      <div className=' w-full flex justify-between items-center'>
        <div className=' text-3xl font-semibold'>Order Account</div>
        <Link href='/' className=' base__button bg-red-500 hover:bg-red-700 text-white'>Back</Link>
      </div>

      <div>
        <UserDetailProductView productId={id} product={data.data} isLoading={isLoading} isError={isError} />
      </div>

      <div className="container mx-auto">
        <h1 className="flex justify-center text-xl pb-4">Deskripsi</h1>
        <div className="flex justify-center gap-10">
          <div className="">
            <h2>
              Keunggulan/Benefit Youtube Premium :
            </h2>
            <ul className="list-disc ps-12">
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sint nulla deserunt distinctio!</li>
              <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae.</li>
              <li>Lorem, ipsum dolor sit amet consectetur adipisicing.</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center border bg-slate-50 rounded-3xl p-4 m-5 w-full">
          <p>NOTE : Jangan tergiur harga murah/lifetime, karena Youtube tidak ada langganan lifetime. Sudah dipastikan itu
            app ilegal.</p>
        </div>
      </div>

      <footer className="bg-zinc-50 border-t-2 shadow-2xl text-black flex justify-center">
        <div className="flex items-center container p-3">
          <div className="flex-1 p-5 px-20 items-center justify-center">
            <h2 className="pb-1 font-extrabold font-serif">Akunkita.id__</h2>
            <p className="font-serif text-xs">|Akunkita.id adalah website untuk penjualan akun - akun premium yang tentunya
              aman, murah dan terpercaya. Jika ada kendala silahkan hubungi kami. |</p>
          </div>
          <div className="flex-1">
            <h2 className="pb-1 font-extrabold font-serif">Hubungi Kami :</h2>
            <div className="flex gap-4 mt-3">
              <div></div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-amber-500 w-full">
        <div className="text-gray-50 p-4 flex justify-center">
          © 2023 Copyright:
          <a className="text-white font-bold">Akunkita.id__</a>
        </div>
      </div>
    </div>
  )
}

export default UserDetailProduct