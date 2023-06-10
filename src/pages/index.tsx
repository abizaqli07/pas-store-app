import { Product, Variant } from "@prisma/client";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import UserLayout from "~/components/user/UserLayout";
import { api } from "~/utils/api";

interface ProductViewProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

const ProductView = ({ products, isLoading, isError }: ProductViewProps) => {

  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>

  return (
    <>
      {products.map((data) => (
        <div
          className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink"
          key={data.id}
        >
          <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow">
            <Link href={`/products/${data.id}`} className=" aspect-[3/2] flex justify-center flex-wrap no-underline hover:no-underline relative">
              {data.image != null ? (
                <Image src={data.image} alt="" fill />
              ) : (
                <Image src="/images/Viuviu.png" alt="" fill />
              )}

            </Link>
            <div className="w-full font-bold text-center text-xl text-gray-800 pt-5 px-6">
              {data.name}
            </div>
          </div>
          <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
            <div className="flex items-center justify-center">
              <Link
                href={`/products/${data.id}`}
                className="mx-auto bg-amber-500 lg:mx-0 hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                Detail & Pembelian
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

const Home: NextPage = () => {
  const { data, isLoading, isError } = api.user.product.getAllProduct.useQuery()

  return (
    <>
      <Head>
        <title>Akun Kita</title>
        <meta name="description" content="Platform subscribe akun premium" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserLayout>

        <div className="container pt-6 mx-auto">
          <section className="bg-white border-b py-4 mx-auto">
            <div className="container mx-auto flex flex-wrap pt-4 pb-5">
              <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
                Pilihan Akun
              </h2>
              <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
              </div>

              {data != undefined && (
                <ProductView products={data.data} isLoading={isLoading} isError={isError} />
              )}

            </div>
          </section>
        </div>

        <footer className="bg-zinc-50 border-t-2 shadow-2xl text-black flex justify-center">
          <div className="flex items-center container p-3">
            <div className="flex-1 p-5 px-20">
              <h2 className="pb-1 font-extrabold font-serif">Akunkita.id__</h2>
              <p className="font-serif text-xs">|Akunkita.id adalah website untuk penjualan akun - akun premium yang tentunya
                aman, murah dan terpercaya. Jika ada kendala silahkan hubungi kami. |</p>
            </div>
            <div className="flex-1">
              <h2 className="pb-1 font-extrabold font-serif">Hubungi Kami :</h2>
              <div className="flex gap-4 mt-3 relative">
                <div></div>
              </div>
            </div>
          </div>
        </footer>

        <div className="bg-amber-500 w-full">
          <div className="text-gray-50 p-4 flex justify-center">
            © 2023 Copyright:
            <a className="text-white font-bold">Akunkita.id__</a>
          </div>
        </div>
      </UserLayout >
    </>
  );
};

export default Home;
