import React, { useState } from 'react'
import { FormikProps, useFormik } from 'formik'
import { productInterface } from '~/utils/admin/validateProduct'
import { api } from '~/utils/api'
import { callbackData } from '~/utils/types'
import { useRouter } from 'next/router'

type Props = {}

const CreateProduct = (props: Props) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const router = useRouter();

  const insertData = api.admin.product.createProduct.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  const formik: FormikProps<productInterface> = useFormik<productInterface>({
    initialValues: {
      name: "",
      small_description: "",
      description: "",
      is_active: false
    },
    onSubmit
  })

  async function onSubmit(values: productInterface) {
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

      <div onClick={() => router.push("/admin/products")} className=' bg-red-500 cursor-pointer w-fit'>Back</div>
      <form className=' flex flex-col gap-4' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col'>
          <label>Name</label>
          <input
            id='name'
            type="text"
            placeholder='name'
            required {...formik.getFieldProps('name')}
          />
        </div>
        <div className='flex flex-col'>
          <label>Small Description</label>
          <input
            id='small_description'
            type="text"
            placeholder='small_description'
            required {...formik.getFieldProps('small_description')}
          />
        </div>
        <div className='flex flex-col'>
          <label>Description</label>
          <input
            id='description'
            type="text"
            placeholder='description'
            {...formik.getFieldProps('description')}
          />
        </div>
        <div className='flex flex-col'>
          <label>Is Active ?</label>
          <input
            id='is_active'
            type="checkbox"
            {...formik.getFieldProps('is_active')}
          />
        </div>

        <div>
          <input className=' bg-lime-500 cursor-pointer' type="submit" value="Create" />
        </div>
      </form>
    </div>
  )
}

export default CreateProduct