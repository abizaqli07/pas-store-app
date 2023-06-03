import { TYPE, Variant } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react'
import { variantUpdateInterface } from '~/utils/admin/validateVariant';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

const DetailVariantView = ({ data, router }: { data: Variant, router: NextRouter }) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })


  const insertData = api.admin.variant.updateVariant.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const formik: FormikProps<variantUpdateInterface> = useFormik<variantUpdateInterface>({
    initialValues: {
      id: data.id,
      name: data.name,
      active_period: data.active_period,
      type: TYPE.SHARED,
      price: Number(data.price) as any,
    },
    onSubmit
  })

  async function onSubmit(values: variantUpdateInterface) {
    insertData.mutate(values)
  }

  return (
    <div>
      {callback.visible && (
        <div className='popup'>
          <div>{callback.data?.message}</div>
          <div>{callback.data?.error ? "Error Occured" : ""}</div>
          <div className=' flex gap-3'>
            <div className='base__button bg-gray-500 hover:bg-gray-700 w-fit' onClick={() => setCallback({ visible: false, data: null })}>Close</div>
          </div>
        </div>
      )}

      <div onClick={() => router.push("/admin/variants")} className=' bg-red-500 cursor-pointer w-fit'>Back</div>
      <form className=' flex flex-col gap-4' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col'>
          <label>Name</label>
          <input
            id='name'
            type="text"
            placeholder='name'
            required
            {...formik.getFieldProps('name')}
          />
        </div>
        <div className='flex flex-col'>
          <label>Active Period in MONTH</label>
          <input
            id='active_period'
            type="number"
            required
            {...formik.getFieldProps('active_period')}
          />
        </div>
        <div className='flex flex-col'>
          <label>Type</label>
          <select required id="type">
            <option value={TYPE.SHARED} selected={formik.values.type == "SHARED" ? true : false}>Shared</option>
            <option value={TYPE.DEDICATED} selected={formik.values.type == "DEDICATED" ? true : false}>Dedicated</option>
          </select>
        </div>
        <div className='flex flex-col'>
          <label>Price</label>
          <input
            id='price'
            type="number"
            required
            {...formik.getFieldProps('price')}
          />
        </div>

        <div>
          <input className=' bg-lime-500 cursor-pointer' type="submit" value="Update" />
        </div>
      </form>
    </div>
  )
}

const DetailVariant = () => {
  const router = useRouter();
  let { id } = router.query

  const { data, isError, isLoading } = api.admin.variant.getVariant.useQuery({ id: id as string })

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (isError || data.data == null) {
    return (
      <div>Some error occured</div>
    )
  }

  return (
    <div>
      <DetailVariantView data={data.data} router={router} />
    </div>
  )
}

export default DetailVariant