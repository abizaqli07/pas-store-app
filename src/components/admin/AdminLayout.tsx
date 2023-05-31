import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { ReactNode, useState } from 'react'

type Props = {
  children: ReactNode
}

const AdminLayout = ({ children }: Props) => {
  const [sidebar, setSidebar] = useState(false)

  return (
    <div className=" w-full h-fit">
      {/* Navigation Bar */}
      <div className=" fixed top-0 z-10 w-full py-8 bg-gray-300">
        <div className=" container mx-auto flex justify-between">
          <div className=' cursor-pointer' onClick={() => setSidebar(true)}>=</div>
          <div>Admin Dashboard</div>
          <div>
            <div className=" flex gap-2">
              <div><button className=" bg-lime-500" onClick={() => void signOut()}>Log Out</button></div>
              <div className=" px-4 py-2 bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sidebar */}
      <div className={` w-full min-h-screen absolute z-20 bg-lime-100 flex justify-center items-center top-0 ${sidebar ? "" : "-left-[100%]"}`}>
        <div onClick={() => setSidebar(false)} className=' absolute top-4 right-4 cursor-pointer'>X</div>
        <div className=' w-full h-full flex flex-col gap-5 items-center'>
          <Link href={"/admin"}>Home</Link>
          <Link href={"/admin/products"}>Product</Link>
          <Link href={"/admin/variants"}>Variants</Link>
          <Link href={"/admin/orders"}>Orders</Link>
          <Link href={"/admin/transactions"}>Transaction</Link>
        </div>
      </div>

      {/* Childs Component */}
      <div className=' mt-24'>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout