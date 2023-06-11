import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { FaFacebookSquare } from "react-icons/fa"
import { FiInstagram } from "react-icons/fi"
import { MdEmail } from "react-icons/md"
import UserDropdown from "./UserDropdown"
import { useWindowScrollPositions } from "../common/GetScrollPosition"

const TextAnimate = {
  offscreen: {
    y: -200,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 1
    }
  }
}

type Props = {
  children: ReactNode
}

const UserLayout = ({ children }: Props) => {
  const { scrollX, scrollY } = useWindowScrollPositions()
  const session = useSession();
  const router = useRouter();

  return (
    <div className=" w-full h-fit">
      <div className={`fixed top-0 z-10 w-full shadow-xl ${scrollY > 0 ? "bg-zinc-50" : "bg-transparent"} transition-all duration-300 ease-in-out`}>
        <div className=" container p-4 mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              className="bg-zinc-50 px-2 py-1 rounded-sm"
              src="/images/logo.png"
              alt=""
              height={90}
              width={90}
            />
          </Link>
          <div>
            {session.data == null ? (
              <button onClick={() => void signIn()} className=" base__button bg-primary hover:bg-primaryHover text-white">Login</button>
            ) : (
              <UserDropdown />
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-hidden">
        {children}
      </div>

      <footer className="bg-zinc-50 border-t-2 shadow-2xl text-black flex justify-center mt-24">
        <div className="flex items-center container p-3 flex-col sm:flex-row gap-12 justify-center text-center sm:text-left">

          <div className="flex-1 p-3 px-20">
            <h2 className="pb-1 font-semibold ">Akunkita.id__</h2>
            <p className=" text-sm">|Akunkita.id adalah website untuk penjualan akun - akun premium yang tentunya
              aman, murah dan terpercaya. Jika ada kendala silahkan hubungi kami.</p>
          </div>

          <div className="flex-1">
            <h2 className="pb-1 font-semibold ">Hubungi Kami :</h2>
            <div className="flex gap-4 mt-3 relative text-3xl items-center">
              <FiInstagram className=" hover:text-primary cursor-pointer" />
              <FaFacebookSquare className=" hover:text-primary cursor-pointer" />
              <MdEmail className=" hover:text-primary cursor-pointer text-4xl" />
            </div>
          </div>

        </div>
      </footer>

      <div className="bg-amber-500 w-full">
        <div className="text-gray-50 p-2 flex justify-center font-light">
          &#169; Akunkita.id__. All right reserved
        </div>
      </div>
    </div>
  )
}

export default UserLayout