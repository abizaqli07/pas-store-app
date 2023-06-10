import { Product, TYPE } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout';
import Callbacks from '~/components/common/Callbacks';
import { variantInterface } from '~/utils/admin/validateVariant';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

const CreateVariantView = ({ product }: { product: Product[] }) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const router = useRouter();

  const insertData = api.admin.variant.createVariant.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const formik: FormikProps<variantInterface> = useFormik<variantInterface>({
    initialValues: {
      productId: "",
      name: "",
      active_period: 0,
      type: TYPE.SHARED,
      price: BigInt(0),
    },
    onSubmit
  })

  function onSubmit(values: variantInterface) {
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

      <div className=' flex flex-col gap-8'>
        <div className=' flex justify-between items-center'>
          <div className=' text-xl font-medium'>Input Variant</div>
          <Link href='/admin/variants' className=' base__button bg-red-500 hover:bg-red-800 text-white'>Back</Link>
        </div>

        <form className=' flex flex-col gap-4' onSubmit={formik.handleSubmit}>

          <div className='flex flex-col input__wrapper'>
            <label>Product</label>
            <select
              id="productId"
              className=' input__field'
              required {...formik.getFieldProps('productId')}
            >
              <option disabled selected value=""> -- Choose Variant -- </option>
              {product.map((data) => (
                <option key={data.id} value={data.id}>{data.name}</option>
              ))}
            </select>
          </div>

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
              <option selected disabled value="no-value">-- Choose Type --</option>
              <option value={TYPE.SHARED}>Shared</option>
              <option value={TYPE.DEDICATED}>Dedicated</option>
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
            <input className=' base__button bg-lime-500 hover:bg-lime-700 text-white' type="submit" value="Create" />
          </div>
        </form>
      </div>
    </div>
  )
}

const CreateVariant = () => {
  const product = api.admin.product.getAllProduct.useQuery();

  if (product.isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (product.isError || product.data.data == undefined) {
    return (
      <div>Some error occured</div>
    )
  }

  return (
    <AdminLayout>
      <CreateVariantView product={product.data.data} />
    </AdminLayout>
  )
}

export default CreateVariant