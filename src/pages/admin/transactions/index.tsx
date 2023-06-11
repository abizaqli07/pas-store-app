import { Disclosure } from '@headlessui/react'
import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import AdminLayout from '~/components/admin/AdminLayout'
import { api } from '~/utils/api'

const HistoryTransaction = () => {
  const { data, isLoading, isError } = api.admin.order.getHistoryTransaction.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>
  if (data == null || data.length == 0) return <div>No order yet</div>

  return (
    <AdminLayout>

      <div className=' flex flex-col gap-8 pb-12'>
        <div className=' text-3xl'>Transaction History</div>

        <div className=' flex flex-col gap-6'>
          {data.map((data) => (
            <div
              key={data.id}
              className=' p-6 bg-primaryLight shadow-lg flex flex-col rounded-lg gap-4'
            >
              <div>
                <div>Product Name : {data.product.name}</div>
                <div>Product Variant : {data.variant.name}</div>
              </div>

              <div>
                <div>Active Period : {data.variant.active_period} Month</div>
                <div>Price : {data.variant.price.toString()}</div>
              </div>

              <div className=' flex flex-col gap-4 justify-center items-center'>

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
                        <div>{data.premium?.email}</div>
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
                        <div className=' break-words max-w-[230px] md:max-w-[500px]'>{data.premium?.password}</div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  )
}

export default HistoryTransaction