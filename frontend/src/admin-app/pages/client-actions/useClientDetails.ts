import React from 'react'
import { useParams } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import userService from '../../../services/user.service'
import User from '../../../models/User'

export type ClientDetails = User & {
  parent?: User
  balance?: {
    balance: number
    profitLoss?: number
    exposer?: number
    casinoexposer?: number
  }
  parentBalance?: {
    balance: number
  }
}

export const useClientDetails = () => {
  const { username } = useParams()
  const [client, setClient] = React.useState<ClientDetails | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchClient = React.useCallback(() => {
    if (!username) {
      setClient(null)
      setLoading(false)
      setError('Username missing in URL')
      return
    }
    setLoading(true)
    setError(null)
    userService
      .getParentUserDetail(username)
      .then((res: AxiosResponse<any>) => {
        const user = res.data?.data?.[0]
        setClient(user ?? null)
      })
      .catch(() => {
        setClient(null)
        setError('Unable to load client details. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [username])

  React.useEffect(() => {
    fetchClient()
  }, [fetchClient])

  return { username, client, loading, error, refresh: fetchClient }
}








