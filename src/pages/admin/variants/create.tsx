import { Product, TYPE } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
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

  async function onSubmit(values: variantInterface) {
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
          <label>Product</label>
          <select id="productId" required {...formik.getFieldProps('productId')}>
            <option disabled selected value=""> -- Choose Variant -- </option>
            {product.map((data) => (
              <option key={data.id} value={data.id}>{data.name}</option>
            ))}
          </select>
        </div>

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
            <option selected disabled value="no-value">-- Choose Type --</option>
            <option value={TYPE.SHARED}>Shared</option>
            <option value={TYPE.DEDICATED}>Dedicated</option>
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
          <input className=' bg-lime-500 cursor-pointer' type="submit" value="Create" />
        </div>
      </form>
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
    <CreateVariantView product={product.data.data} />
  )
}

export default CreateVariant