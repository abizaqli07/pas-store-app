import { Disclosure } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { Order, Premium, Product, Variant } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { HiPhoto } from 'react-icons/hi2';
import UserLayout from '~/components/user/UserLayout';
import { api } from '~/utils/api';
import { callbackData } from '~/utils/types';
import Image from 'next/image';
import Callbacks from '~/components/common/Callbacks';

interface transactionProps {
  transactionId: string | string[] | undefined;
  transaction: (Order & {
    product: Product;
    variant: Variant;
    premium: Premium | null;
  }) | null | undefined;
  isLoading: boolean;
  isError: boolean;
}

const UserTransactionDetailView = ({ transactionId, transaction, isLoading, isError }: transactionProps) => {
  const [callback, setCallback] = useState<callbackData>({ visible: false, data: null })
  const [imagePayment, setImagePayment] = useState<string | ArrayBuffer | null>();
  const router = useRouter();

  const imageOrder = api.user.transaction.uploadPayment.useMutation({
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

  function handleUpload() {
    imageOrder.mutate({
      transactionId: transactionId as string,
      image: imagePayment as string
    })
  }

  const handleClose = () => {
    setCallback({ visible: false, data: null })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (transaction == undefined || transaction == null) return <div>No Transaction yet</div>


  return (
    <div className=' flex flex-col gap-8'>
      {callback.visible && (
        <Callbacks
          close={handleClose}
          data={callback}
        />
      )}

      <div className="w-full pt-32">
        <div className="max-w-4xl border-2 mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-5xl">
          <div className="md:flex">
            <div className="md:shrink-0">
              {transaction.product.image != null ? (
                <img className="h-48 w-full object-fit max-md:object-cover md:h-full md:w-96" src={transaction.product.image}
                  alt="Modern building architecture" />
              ) : (
                <img className="h-48 w-full object-fit max-md:object-cover md:h-full md:w-96" src="/images/Viuviu.png"
                  alt="Modern building architecture" />
              )}
            </div>

            <div className="p-8 mx-auto w-full">
              <div className="w-full ps-5 rounded-e-3xl">
                <div className="md:flex md:items-center mb-2">
                  <div className="md:w-1/3">
                    <label className="block font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-full-name">
                      Account :
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <p className="p-2 rounded-2xl border-2 flex justify-center px-16" >
                      {transaction.product.name}
                    </p>
                  </div>
                </div>
                <div className="md:flex md:items-center mb-2">
                  <div className="md:w-1/3">
                    <label className="block font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-full-name">
                      Price :
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <p className="p-2 rounded-2xl border-2 flex justify-center px-16" >
                      {transaction.variant.price.toString()}
                    </p>
                  </div>
                </div>
                <div className="md:flex md:items-center mb-2">
                  <div className="md:w-1/3">
                    <label className="block font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-full-name">
                      Active Period :
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <p className="p-2 rounded-2xl border-2 flex justify-center px-16" >
                      {transaction.variant.active_period} Month
                    </p>
                  </div>
                </div>
                <div className="md:flex md:items-center mb-2">
                  <div className="md:w-1/3">
                    <label className="block font-bold md:text-left mb-1 md:mb-0 pr-4"
                      htmlFor="inline-full-name">
                      Type :
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <p className="p-2 rounded-2xl border-2 flex justify-center px-16" >
                      {transaction.variant.type == "SHARED" ? "Shared" : "Dedicated"}
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-center py-5' x-data="{ reportsOpen: false }">
                  <div className=' container w-full px-5 py-2 mx-auto bg-white border-2 rounded-lg shadow-xl'>
                    <div className='max-w-md mx-auto space-y-6'>
                      <h1 className="flex justify-center">
                        Pembayaran
                      </h1>

                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary/10 px-4 py-2 text-left text-sm font-medium hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                              <span>Press to payment</span>
                              <FiChevronDown
                                className={`${open ? 'rotate-90 transform' : ''
                                  } h-5 w-5 transition-all duration-200 ease-in-out`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                              <div className='relative w-full aspect-[3/5]'>
                                <Image src='/images/qris.jpg' alt='Qris' fill />
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>

                    </div>
                  </div>
                </div>

                <div className="p-3">
                  {transaction.image == null ? (
                    <div className="col-span-full">
                      <label htmlFor="cover-photo" className="block font-medium leading-6">
                        <button
                          disabled={imagePayment == null ? true : false}
                          className="base__button bg-primary hover:bg-primaryHover disabled:bg-gray-200 disabled:cursor-default"
                          onClick={() => handleUpload()}
                        >Send Proof of Payment</button>
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
                      <p className="pt-3">
                        Note : Akun akan dikirim setelah bukti pembayaran sudah terpenuhi
                      </p>
                    </div>
                  ) : (
                    <div>
                      {transaction.premium == null ? (
                        <div className=' bg-red-300 px-4 py-2 rounded-lg flex gap-2 items-center w-fit'><BsExclamationTriangle />Wait admin send your account</div>
                      ) : (
                        <div>
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary/10 px-4 py-2 text-left text-sm font-medium hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                                  <span>Press to view email</span>
                                  <FiChevronDown
                                    className={`${open ? 'rotate-90 transform' : ''
                                      } h-5 w-5 transition-all duration-200 ease-in-out`}
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                  <div>{transaction.premium?.email}</div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary/10 px-4 py-2 text-left text-sm font-medium hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                                  <span>Press to view password</span>
                                  <FiChevronDown
                                    className={`${open ? 'rotate-90 transform' : ''
                                      } h-5 w-5 transition-all duration-200 ease-in-out`}
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                  <div className=' break-words max-w-[230px] md:max-w-[500px]'>{transaction.premium?.password}</div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

const TransactionDetails = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isLoading, isError } = api.user.transaction.getUserOrderDetail.useQuery({
    id: id as string
  })

  return (
    <UserLayout>
      <div className=' mt-24 container mx-auto flex flex-col gap-8 pb-12'>
        <div className=' text-2xl font-semibold'>Transactions Details</div>

        <UserTransactionDetailView transactionId={id} transaction={data} isLoading={isLoading} isError={isError} />
      </div>

    </UserLayout>
  )
}

export default TransactionDetails