import { TYPE, Variant } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout';
import Callbacks from '~/components/common/Callbacks';
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

  const handleClose = () => {
    setCallback({ visible: false, data: null })
  }

  return (
    <div>
      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      <div className='flex flex-col gap-8 my-6'>
        <div className=' flex justify-between items-center'>
          <div className=' text-xl font-medium'>Edit Variant</div>
          <div onClick={() => router.push("/admin/variants")} className=' base__button bg-red-500 hover:bg-red-800 text-white'>Back</div>
        </div>
        <form className=' flex flex-col gap-4' onSubmit={formik.handleSubmit}>
          <div className='flex flex-col input__wrapper'>
            <label>Name</label>
            <input
              id='name'
              type="text"
              placeholder='name'
              required
              className=' input__field'
              {...formik.getFieldProps('name')}
            />
          </div>
          <div className='flex flex-col input__wrapper'>
            <label>Active Period in MONTH</label>
            <input
              id='active_period'
              type="number"
              required
              className=' input__field'
              {...formik.getFieldProps('active_period')}
            />
          </div>
          <div className='flex flex-col input__wrapper'>
            <label>Type</label>
            <select
              required
              id="type"
              className=' input__field'
            >
              <option value={TYPE.SHARED} selected={formik.values.type == "SHARED" ? true : false}>Shared</option>
              <option value={TYPE.DEDICATED} selected={formik.values.type == "DEDICATED" ? true : false}>Dedicated</option>
            </select>
          </div>
          <div className='flex flex-col input__wrapper'>
            <label>Price</label>
            <input
              id='price'
              type="number"
              required
              className=' input__field'
              {...formik.getFieldProps('price')}
            />
          </div>

          <div>
            <input className=' base__button bg-lime-500 hover:bg-lime-700 text-white' type="submit" value="Update" />
          </div>
        </form>
      </div>
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
    <AdminLayout>
      <DetailVariantView data={data.data} router={router} />
    </AdminLayout>
  )
}

export default DetailVariant