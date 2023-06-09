import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import UserDropdown from "./UserDropdown"

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
              <UserDropdown />
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