import React, { useState } from 'react'
import { FormikProps, useFormik } from 'formik'
import { productInterface } from '~/utils/admin/validateProduct'
import { api } from '~/utils/api'
import { callbackData } from '~/utils/types'
import { useRouter } from 'next/router'
import AdminLayout from '~/components/admin/AdminLayout'
import { HiPhoto } from 'react-icons/hi2'
import Callbacks from '~/components/common/Callbacks'
import Link from 'next/link'

const CreateProduct = () => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const [imagePayment, setImagePayment] = useState<string | ArrayBuffer | null>(null);
  const router = useRouter();

  const insertData = api.admin.product.createProduct.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  function convertToBase(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files;

    const reader = new FileReader();
    if (file != null && file.length > 0) {
      reader.readAsDataURL(file[0] as Blob);
      reader.onload = () => {
        setImagePayment(reader.result)
      }
    }
  }

  const formik: FormikProps<productInterface> = useFormik<productInterface>({
    initialValues: {
      name: "",
      small_description: "",
      description: "",
      is_active: false,
      image: null
    },
    onSubmit
  })

  function onSubmit(values: productInterface) {
    insertData.mutate({ ...values, image: imagePayment as string | null })
  }

  const handleClose = () => {
    setCallback({ visible: false, data: null })
    router.push('/admin/products').catch((e) => console.log(e))
  }

  return (
    <AdminLayout>
      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      <div className=' flex flex-col gap-8'>
          <div className=' flex justify-between items-center'>
            <div className=' text-xl font-medium'>Input Product</div>
            <Link href='/admin/products' className=' base__button bg-red-500 hover:bg-red-800 text-white'>Back</Link>
          </div>

        <form className=' flex flex-col gap-6' onSubmit={formik.handleSubmit}>
          <div className='input__wrapper'>
            <label>Name</label>
            <input
              id='name'
              type="text"
              placeholder='name'
              className=' input__field'
              required {...formik.getFieldProps('name')}
            />
          </div>
          <div className='input__wrapper'>
            <label>Small Description</label>
            <input
              id='small_description'
              type="text"
              placeholder='small_description'
              className=' input__field'
              required {...formik.getFieldProps('small_description')}
            />
          </div>
          <div className='input__wrapper'>
            <label>Description</label>
            <input
              id='description'
              type="text"
              placeholder='description'
              className=' input__field'
              required {...formik.getFieldProps('description')}
            />
          </div>
          <div className='input__wrapper'>
            <label>Is Active ?</label>
            <input
              id='is_active'
              type="checkbox"
              className='checkbox__field'
              {...formik.getFieldProps('is_active')}
            />
          </div>

          <div className="col-span-full">
            <label htmlFor="cover-photo" className="block font-medium leading-6">
              Cover photo
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <HiPhoto className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="image" name="image" type="file" className="sr-only" accept='image/' onChange={convertToBase} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <input className=' base__button bg-lime-500 hover:bg-lime-700 text-white' type="submit" value="Create" />
          </div>
        </form>
      </div>

    </AdminLayout>
  )
}

export default CreateProduct