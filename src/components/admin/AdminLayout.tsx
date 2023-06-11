import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import { HiMenuAlt1 } from 'react-icons/hi';
import { RxCrossCircled } from 'react-icons/rx';
import { Menu, Transition } from '@headlessui/react'
import MenuDropDown from "./MenuDropDown";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { getServerSession } from "next-auth";

type Props = {
  children: ReactNode
}

const links = [
  { name: "Home", to: "/admin", id: 1 },
  { name: "Product", to: "/admin/products", id: 2 },
  { name: "Variant", to: "/admin/variants", id: 3 },
  { name: "Order", to: "/admin/orders", id: 4 },
  { name: "Transaction", to: "/admin/transactions", id: 4 }
];

const itemVariants = {
  closed: {
    x: 400,
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: .5,
      type: "tween",
      ease: "easeInOut",
    }
  }
};

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1
    }
  }
};

const AdminLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false)
  const session = useSession();
  const router = useRouter();

  if(session.status === 'unauthenticated'){
    return (
      <div>Unauthenticated user</div>
    )
  }

  const btnMenu = " cursor-pointer inline-flex items-center p-2 text-sm text-primaryDark rounded-lg hover:bg-gray-100 hover:text-primary"
  return (
    <div className=" w-full h-fit">
      {/* Navigation Bar */}

      <div className=" fixed top-0 z-10 w-full py-4 bg-white shadow-md">
        <div className=" container mx-auto flex justify-between items-center px-2 sm:px-0">
          <div
            className={btnMenu}
            onClick={() => setOpen(true)}
          ><HiMenuAlt1 className=' text-3xl' /></div>
          <div>Admin Dashboard</div>
          <div>
            <MenuDropDown />
          </div>
        </div>
      </div>

      {/* Admin Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            className=" w-full min-h-screen fixed z-20 bg-white flex justify-center items-center top-0"
            initial={{
              x: '-100vh'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100vh',
              transition: { delay: 0.7, duration: 0.3 }
            }}
          >
            <button
              onClick={() => setOpen(false)}
              className={`${btnMenu} absolute top-8 right-8`}
            ><RxCrossCircled className=' text-3xl' /></button>
            <motion.div
              className=' w-full h-full flex flex-col gap-5 items-center'
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideVariants}
            >
              {links.map(({ id, name, to }) => (

                <motion.a
                  variants={itemVariants}
                  key={id}
                  href={to}
                  whileHover={{
                    scale: 1.1
                  }}
                  className=' text-lg hover:text-primary cursor-pointer'
                >{name}</motion.a>

              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Childs Component */}
      <div className=' mt-24 container mx-auto'>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout