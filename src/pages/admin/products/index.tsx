import { useState } from 'react'
import { Product } from "@prisma/client";
import { NextRouter, useRouter } from "next/router"
import AdminLayout from "~/components/admin/AdminLayout"
import { api } from "~/utils/api";
import { callbackData } from '~/utils/types';
import Modals from '~/components/common/Modals';
import Callbacks from '~/components/common/Callbacks';
import Link from 'next/link';

const ProductView = ({ data, router }: { data: Product[], router: NextRouter }) => {
  const [confirm, setConfirm] = useState({ visible: false, id: "" })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const deleteProduct = api.admin.product.deleteProduct.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
      setConfirm({ visible: false, id: "" })
    }
  })

  const handleConfirm = (id: string) => {
    setConfirm({ visible: true, id: id });
  }

  const handleDelete = () => {
    deleteProduct.mutate({ id: confirm.id })
  }

  const handleClose = () => {
    setConfirm({ visible: false, id: "" })
    setCallback({ visible: false, data: null })
  }

  return (
    <>
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

      <div className=" flex flex-col gap-6">
        {data.map((product) => (
          <div
            key={product.id}
            className=' p-6 bg-primaryLight shadow-lg flex flex-col rounded-lg gap-4'
          >
            <div>Nama : {product.name}</div>
            <div>Description : {product.small_description}</div>
            <div>Status : {product.is_active ? "Active" : "Hidden"}</div>
            <div className=" flex gap-4 items-center">
              <Link href={`${router.pathname}/${product.id}`} className="  base__button border-2 border-lime-500 hover:bg-lime-500 hover:text-white">View</Link>
              <div className=" base__button border-2 border-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleConfirm(product.id)}>Delete</div>
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
        <div className=' w-full flex justify-between p-6 rounded-xl items-center'>
          <div className=' text-3xl'>Products List</div>
          <Link href={`${router.pathname}/create`} className=' base__button bg-primary hover:bg-primaryHover text-white'>Input</Link>
        </div>

        <ProductView data={data?.data} router={router} />

      </div>
    </AdminLayout>
  )
}

export default Products