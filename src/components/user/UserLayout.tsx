import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const UserLayout = ({ children }: Props) => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className=" w-full h-fit">
      <div className=" fixed top-0 z-10 w-full bg-zinc-50 shadow-xl">
        <div className=" container p-4 mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src="/images/logo-removebg-preview.png"
              alt="" 
              height={90}
              width={90}
            />
          </Link>
          <div>
            {session.data == null ? (
              <button onClick={() => void signIn()}>Login</button>
            ) : (
              <div className=" flex gap-2">
                <div className=" bg-blue-500 cursor-pointer" onClick={() => router.push('/products/transactions')}>Transactions</div>
                <div><button className=" bg-lime-500" onClick={() => void signOut()}>Log Out</button></div>
                <div className=" px-4 py-2 bg-red-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default UserLayout