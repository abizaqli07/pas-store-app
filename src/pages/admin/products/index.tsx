import { Product } from "@prisma/client";
import { useRouter } from "next/router"
import AdminLayout from "~/components/admin/AdminLayout"
import { api } from "~/utils/api";

const ProductView = ({ data } : { data: Product[] | undefined }) => {
  return (
    <>
      {data != undefined ? (
        <div>
          {data.map((product) => (
            <div>
              <div>Nama : {product.name}</div>
              <div>Description : {product.description}</div>
              <div>Status : {product.is_active ? "Active" : "Hidden"}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>Some error Occured</div>
      )}
    </>
  )
}

const Products = () => {
  const router = useRouter();

  const { data, isError, isLoading } = api.admin.product.getProduct.useQuery();

  return (
    <AdminLayout>

      <div className=' flex flex-col gap-8'>
        <div className=' w-full bg-slate-500 flex flex-col gap-4 p-6 rounded-xl'>
          <div>Input New Product :</div>
          <div className=' bg-lime-200 w-fit cursor-pointer' onClick={() => router.push(`${router.pathname}/create`)}>Input</div>
        </div>

        <ProductView data={data?.data}/>

      </div>
    </AdminLayout>
  )
}

export default Products