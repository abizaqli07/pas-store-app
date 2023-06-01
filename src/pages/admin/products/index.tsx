import { useState } from 'react'
import { Product } from "@prisma/client";
import { NextRouter, useRouter } from "next/router"
import AdminLayout from "~/components/admin/AdminLayout"
import { api } from "~/utils/api";
import { callbackData } from '~/utils/types';

const ProductView = ({ data, router }: { data: Product[], router: NextRouter }) => {
  const [confirm, setConfirm] = useState({ visible: false, id: "" })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const deleteProduct = api.admin.product.deleteProduct.useMutation({
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
        {data.map((product) => (
          <div key={product.id}>
            <div>Nama : {product.name}</div>
            <div>Description : {product.small_description}</div>
            <div>Status : {product.is_active ? "Active" : "Hidden"}</div>
            <div className=" flex gap-4">
              <div className="  bg-lime-500 w-fit cursor-pointer" onClick={() => router.push(`${router.pathname}/${product.id}`)}>View</div>
              <div className=" bg-red-500 w-fit cursor-pointer" onClick={() => handleConfirm(product.id)}>Delete</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const Products = () => {
  const router = useRouter();

  const { data, isError, isLoading } = api.admin.product.getAllProduct.useQuery();

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
          <div>Input New Product :</div>
          <div className=' bg-lime-200 w-fit cursor-pointer' onClick={() => router.push(`${router.pathname}/create`)}>Input</div>
        </div>

        <ProductView data={data?.data} router={router} />

      </div>
    </AdminLayout>
  )
}

export default Products