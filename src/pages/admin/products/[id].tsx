import { Product } from '@prisma/client';
import { FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react'
import { productUpdateInterface } from '~/utils/admin/validateProduct';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';

const DetailProductView = ({ data, router }: { data: Product, router: NextRouter }) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const [imagePayment, setImagePayment] = useState<string | ArrayBuffer | null>();


  const insertData = api.admin.product.updateProduct.useMutation({
    onSuccess(data) {
      setCallback({ visible: true, data: data })
    }
  })

  function convertToBase(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    var file = e.target.files;

    var reader = new FileReader();
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

  async function onSubmit(values: productUpdateInterface) {
    insertData.mutate({...values, image: imagePayment as string})
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
            checked={formik.values.is_active}
          />
        </div>
        <div>
          {data.image && (
            <div><Image src={data.image} alt='image' height={100} width={100}/></div>
          )}
          <label>Image</label>
          <input type="file" accept='image/' onChange={convertToBase} />
        </div>

        <div>
          <input className=' bg-lime-500 cursor-pointer' type="submit" value="Update" />
        </div>
      </form>
    </div>
  )
}

const DetailProduct = () => {
  const router = useRouter();
  let { id } = router.query

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
    <div>
      <DetailProductView data={data.data} router={router} />
    </div>
  )
}

export default DetailProduct