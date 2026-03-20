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

type ExposureForm = {
  amount: string
  transactionPassword: string
}

const ExposureLimit = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        amount: Yup.number()
          .required('New limit is required')
          .transform((value) => (isNaN(value) ? 0 : +value))
          .min(0, 'Limit must be positive'),
        transactionPassword: Yup.string().required('Transaction Password is required'),
      }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExposureForm>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = handleSubmit((data) => {
    if (!client) return
    const payload = {
      ...data,
      username: client.username,
      walletUpdateType: 'EXP',
    }

    userService.updateUserExposureAndCreditLimit(payload).then(() => {
      toast.success('Exposure limit updated successfully')
      reset()
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
          <h2>Exposure Limit</h2>
          <p>Adjust the exposure ceiling for {client.username}</p>
        </div>

        <div className='client-action-hint'>
          Current Exposure Limit: <strong>{client.exposerLimit ?? 0}</strong>
        </div>

        <form className='client-action-form' onSubmit={onSubmit}>
          <div className='form-group'>
            <label>New Exposure Limit</label>
            <input
              type='number'
              min={0}
              className='form-control'
              {...register('amount')}
              placeholder='Enter new exposure limit'
            />
            {errors?.amount && <span className='error'>{errors.amount.message}</span>}
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

          <div className='client-action-footer '>
            <button type='button' className='btn btn-outline-secondary' onClick={() => navigate.back()}>
              Cancel
            </button>
            <SubmitButton type='submit' className='btn btn-primary'>
              <i className='fas fa-check mr-2' /> Update Limit
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExposureLimit

