import { useState } from 'react'
import { Product, Variant } from "@prisma/client";
import { NextRouter, useRouter } from "next/router"
import AdminLayout from "~/components/admin/AdminLayout"
import { api } from "~/utils/api";
import { callbackData } from '~/utils/types';

const VariantView = ({ data, router }: { data: (Product & { Variant: Variant[] })[], router: NextRouter }) => {
  const [confirm, setConfirm] = useState({ visible: false, id: "" })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const deleteProduct = api.admin.variant.deleteVariant.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const handleConfirm = (id: string) => {
    setConfirm({ visible: true, id: id });
  }

  const handleDelete = async () => {
    deleteProduct.mutate({ id: confirm.id })
  }

  return (
    <>
      {callback.visible && (
        <div className=' popup'>
          <div>{callback.data?.message}</div>
          <div>{callback.data?.error ? callback.data.error : ""}</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700 w-fit' onClick={() => router.reload()}>Close</div>
          </div>
        </div>
      )}

      {confirm.visible && (
        <div className=' popup'>
          <div>Anda ingin menghapus?</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700' onClick={() => setConfirm({ visible: false, id: "" })}>Cancel</div>
            <div className='button__danger' onClick={() => handleDelete()}>Confirm</div>
          </div>
        </div>
      )}

      <div className=" flex flex-col gap-4">
        {data.map((data) => (
          <div key={data.id} className=' px-2 py-2 bg-gray-200 flex flex-col gap-4'>
            <div>Product : {data.name}</div>
            <div>Description : {data.small_description}</div>
            <div>Variant :</div>
            <div className=' flex flex-col gap-4'>
              {data.Variant.map((variant) => (
                <div key={variant.id} className=' p-2 flex flex-col gap-2 bg-gray-300'>
                  <div>Name : {variant.name}</div>
                  <div>Price : {variant.price.toString()}</div>
                  <div>Type : {variant.type}</div>
                  <div>Active Period : {variant.active_period} Month</div>
                  <div className=" flex gap-4">
                    <div className="  bg-lime-500 w-fit cursor-pointer" onClick={() => router.push(`${router.pathname}/${variant.id}`)}>View</div>
                    <div className=" bg-red-500 w-fit cursor-pointer" onClick={() => handleConfirm(variant.id)}>Delete</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const Variants = () => {
  const router = useRouter();

  const { data, isError, isLoading } = api.admin.variant.getAllVariant.useQuery();

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (isError || data.data == undefined) {
    return (
      <div>Some error occured</div>
    )
  }

  return (
    <AdminLayout>

      <div className=' flex flex-col gap-8'>
        <div className=' w-full bg-slate-500 flex flex-col gap-4 p-6 rounded-xl'>
          <div>Input New Variant :</div>
          <div className=' bg-lime-200 w-fit cursor-pointer' onClick={() => router.push(`${router.pathname}/create`)}>Input</div>
        </div>

        <VariantView data={data?.data} router={router} />

      </div>
    </AdminLayout>
  )
}

export default Variants