import { Product, Variant } from "@prisma/client";
import { type NextPage } from "next";
import { motion, AnimatePresence, wrap } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import UserLayout from "~/components/user/UserLayout";
import { api } from "~/utils/api";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"

interface ProductViewProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

const images = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jfif",
]

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ProductView = ({ products, isLoading, isError }: ProductViewProps) => {
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>

  return (
    <div className=" flex flex-wrap justify-center items-center gap-8 mx-auto">
      {products.map((data) => (
        <div
          className="w-full sm:max-w-xs md:max-w-[350px] p-4 flex flex-col"
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
                className="base__button bg-primary hover:bg-primaryHover text-white font-semibold hover:scale-105">
                Detail & Pembelian
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const { data, isLoading, isError } = api.user.product.getAllProduct.useQuery()

  return (
    <>
      <Head>
        <title>Akun Kita</title>
        <meta name="description" content="Platform subscribe akun premium" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserLayout>
        <section className=" w-full h-screen bg-gray-100 flex gap-0 flex-col-reverse md:flex-row">
          <div className=" w-screen h-[50vh] md:w-[50vw] md:h-screen bg-black flex justify-center items-center md:items-end md:pb-24 md:pl-8">
            <div className=" text-white text-center flex flex-col gap-12 p-8 md:text-left md:gap-8 lg:gap-6">
              <div className=" text-5xl font-medium md:text-4xl lg:text-7xl">Find Your Absolute <span className=" text-primary font-bold">JOY</span></div>
              <div className=" font-light pt-4 border-t-[1px] border-primary w-fit">Find all your desires and imagination with just a few clicks,<br /> Various premium fun to fill your day</div>
            </div>
          </div>
          <div className=" w-screen h-[50vh] md:w-[50vw] md:h-screen relative">
            <Image src="/images/hero1.jpg" alt="Hero" fill className=" object-cover" />
          </div>
        </section>

        <div className="container mx-auto">

          <section className=" relative h-[50vh] w-[60vw] flex justify-center items-center mx-auto md:mt-24 lg:mt-44 rounded-3xl overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                className=" absolute w-[60vw] aspect-[5/3] object-cover"
                key={page}
                src={images[imageIndex]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              />
            </AnimatePresence>
            <div className="next" onClick={() => paginate(1)}>
              <BiRightArrow />
            </div>
            <div className="prev" onClick={() => paginate(-1)}>
              <BiLeftArrow />
            </div>
          </section>

          <section className="bg-white border-b py-4 mx-auto md:mt-16 lg:mt-32">
            <div className="container mx-auto flex flex-wrap pt-4 pb-5">
              <h2 className="w-full my-2 text-3xl font-semibold leading-tight text-center text-gray-800">
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
      </UserLayout >
    </>
  );
};

export default Home;
