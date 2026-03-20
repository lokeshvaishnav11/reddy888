import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import userService from '../../../services/user.service'
import SubmitButton from '../../../components/SubmitButton'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useClientDetails } from './useClientDetails'
import './client-action.css'

type StatusForm = {
  isUserActive: boolean
  isUserBetActive: boolean
  transactionPassword: string
}

const ClientStatus = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        transactionPassword: Yup.string().required('Transaction Password is required'),
      }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StatusForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isUserActive: false,
      isUserBetActive: false,
      transactionPassword: '',
    },
  })

  React.useEffect(() => {
    if (client) {
      setValue('isUserActive', !!client.isLogin)
      setValue('isUserBetActive', !!client.betLock)
    }
  }, [client, setValue])

  const onSubmit = handleSubmit((data) => {
    if (!client) return
    const payload = { ...data, username: client.username }

    userService.updateUserAndBetStatus(payload).then(() => {
      toast.success('Status updated successfully')
      reset({ ...data, transactionPassword: '' })
    })
  })

  if (loading) {
    return (
      <div className='client-action-page'>
        <div className='loading-state'>Loading client details...</div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className='client-action-page'>
        <div className='empty-state'>
          Unable to load requested client.
          <span>{error || 'Please go back and try again.'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='client-action-page'>
      <div className='client-action-card'>
        <div className='client-action-back'>
          <button className='btn btn-secondary' onClick={() => navigate.back()}>
            <i className='fas fa-arrow-left' /> Back
          </button>
        </div>
        <div className='client-action-heading'>
          <h2>Status Control</h2>
          <p>Enable or disable login/betting for {client.username}</p>
        </div>

        <form className='client-action-form' onSubmit={onSubmit}>
          <div className='client-action-hint'>
            Toggle the switches below to lock/unlock the client account or their betting ability.
          </div>

          <div className='form-group'>
            <label>User Access</label>
            <div className='d-flex align-items-center gap-3'>
              <label className='mr-3 mb-0 d-flex align-items-center'>
                <input type='checkbox' {...register('isUserActive')} className='mr-2' />
                <span>{client.isLogin ? 'Active' : 'Inactive'}</span>
              </label>
              <span className={`badge ${client.isLogin ? 'badge-success' : 'badge-danger'}`}>
                {client.isLogin ? 'User can login' : 'Login locked'}
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label>Bet Access</label>
            <div className='d-flex align-items-center gap-3'>
              <label className='mr-3 mb-0 d-flex align-items-center'>
                <input type='checkbox' {...register('isUserBetActive')} className='mr-2' />
                <span>{client.betLock ? 'Allowed' : 'Locked'}</span>
              </label>
              <span className={`badge ${client.betLock ? 'badge-success' : 'badge-danger'}`}>
                {client.betLock ? 'Bets allowed' : 'Bets locked'}
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label>Transaction Password</label>
            <input
              type='password'
              className='form-control'
              {...register('transactionPassword')}
              placeholder='Enter transaction password'
            />
            {errors?.transactionPassword && (
              <span className='error'>{errors.transactionPassword.message}</span>
            )}
          </div>

          <div className='client-action-footer'>
            <button type='button' className='btn btn-outline-secondary' onClick={() => navigate.back()}>
              Cancel
            </button>
            <SubmitButton type='submit' className='btn btn-primary'>
              <i className='fas fa-check mr-2' /> Save Changes
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientStatus

