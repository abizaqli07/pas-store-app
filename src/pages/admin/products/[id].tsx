import { Product } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react'
import { HiPhoto } from 'react-icons/hi2';
import AdminLayout from '~/components/admin/AdminLayout';
import Callbacks from '~/components/common/Callbacks';
import { productUpdateInterface } from '~/utils/admin/validateProduct';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

const DetailProductView = ({ data, router }: { data: Product, router: NextRouter }) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const [imagePayment, setImagePayment] = useState<string | ArrayBuffer | null>(null);

  const trpcUtils = api.useContext();

  const insertData = api.admin.product.updateProduct.useMutation({
    onSuccess: async (data) => {
      setCallback({ visible: true, data: data })

      await trpcUtils.admin.product.getProduct.invalidate()
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

  const formik: FormikProps<productUpdateInterface> = useFormik<productUpdateInterface>({
    initialValues: {
      id: data.id,
      name: data.name,
      small_description: data.small_description,
      description: data.description,
      is_active: data.is_active,
      image: ""
    },
    onSubmit
  })

  function onSubmit(values: productUpdateInterface) {
    insertData.mutate({ ...values, image: imagePayment as string })
  }

  const handleClose = () => {
    setCallback({ visible: false, data: null })
    router.push('/admin/products').catch((e) => console.log(e))
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
          <div className=' text-xl font-medium'>Edit Product</div>
          <Link href='/admin/products' className=' base__button bg-red-500 hover:bg-red-800 text-white'>Back</Link>
        </div>

        <form className=' flex flex-col gap-4' onSubmit={formik.handleSubmit}>
          <div className=' input__wrapper'>
            <label>Name</label>
            <input
              id='name'
              type="text"
              placeholder='name'
              className=' input__field'
              required {...formik.getFieldProps('name')}
            />
          </div>
          <div className=' input__wrapper'>
            <label>Small Description</label>
            <input
              id='small_description'
              type="text"
              placeholder='small_description'
              className=' input__field'
              required {...formik.getFieldProps('small_description')}
            />
          </div>
          <div className=' input__wrapper'>
            <label>Description</label>
            <input
              id='description'
              type="text"
              placeholder='description'
              className=' input__field'
              {...formik.getFieldProps('description')}
            />
          </div>
          <div className=' input__wrapper'>
            <label>Is Active ?</label>
            <input
              id='is_active'
              type="checkbox"
              className=' checkbox__field'
              {...formik.getFieldProps('is_active')}
              checked={formik.values.is_active}
            />
          </div>

          <div className=' flex flex-col gap-4 items-center w-full'>
            {data.image && (
              <div className=' w-full h-fit p-4 border-dotted border-2 border-gray-200 rounded-lg flex justify-center items-center'><Image src={data.image} alt='image' height={100} width={100} /></div>
            )}
            <div className="col-span-full w-full">
              <label htmlFor="cover-photo" className="block font-medium leading-6">
                Edit Image ?
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
          </div>

          <div>
            <input className=' base__button bg-lime-500 hover:bg-lime-700 text-white' type="submit" value="Update" />
          </div>
        </form>
      </div>
    </div>
  )
}

const DetailProduct = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isError, isLoading } = api.admin.product.getProduct.useQuery({ id: id as string })

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
      <DetailProductView data={data.data} router={router} />
    </AdminLayout>
  )
}

export default DetailProduct