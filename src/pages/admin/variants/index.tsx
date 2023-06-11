import { Product, Variant } from "@prisma/client";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useState } from 'react';
import AdminLayout from "~/components/admin/AdminLayout";
import Callbacks from '~/components/common/Callbacks';
import Modals from '~/components/common/Modals';
import { api } from "~/utils/api";
import { callbackData } from '~/utils/types';

const VariantView = ({ data, router }: { data: (Product & { Variant: Variant[] })[], router: NextRouter }) => {
  const [confirm, setConfirm] = useState({ visible: false, id: "" })
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })

  const trpcUtils = api.useContext();

  const deleteProduct = api.admin.variant.deleteVariant.useMutation({
    onSuccess: async (data) => {
      setCallback({ visible: true, data: data })

      await trpcUtils.admin.variant.getAllVariant.invalidate()
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
        {data.map((data) => (
          <div
            key={data.id}
            className=' p-6 bg-white shadow-lg flex flex-col rounded-lg gap-4'
          >
            <div>Product : {data.name}</div>
            <div>Description : {data.small_description}</div>
            <div>Variant :</div>
            <div className=' flex flex-col gap-4'>
              {data.Variant.map((variant) => (
                <div key={variant.id} className=' p-3 flex flex-col gap-2 bg-primaryLight rounded-lg shadow-md'>
                  <div>Name : {variant.name}</div>
                  <div>Price : {variant.price.toString()}</div>
                  <div>Type : {variant.type}</div>
                  <div>Active Period : {variant.active_period} Month</div>
                  <div className=" flex gap-4">
                    <Link href={`${router.pathname}/${variant.id}`} className="  base__button  border-2 border-lime-500 hover:bg-lime-500 hover:text-white">View</Link>
                    <div className=" base__button border-2 border-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleConfirm(variant.id)}>Delete</div>
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
        <div className=' w-full flex justify-between p-6 rounded-xl items-center'>
          <div className=' text-3xl'>Variant List</div>
          <Link href={`${router.pathname}/create`} className=' base__button bg-primary hover:bg-primaryHover text-white'>Input</Link>
        </div>

        <VariantView data={data?.data} router={router} />

      </div>
    </AdminLayout>
  )
}

export default Variants