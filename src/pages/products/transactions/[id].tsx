import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api';

const TransactionDetailView = () => {

  return (
    <div></div>
  )
}

const TransactionDetails = () => {
  const router = useRouter();
  const { id } = router.query

  const { data, isLoading, isError } = api.user.transaction.getUserOrderDetail.useQuery({
    id: id as string
  })

  return (
    <div>
      <div>Transactions Details</div>


    </div>
  )
}

export default TransactionDetails