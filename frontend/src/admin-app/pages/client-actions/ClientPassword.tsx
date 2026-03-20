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

type PasswordForm = {
  password: string
  confirmPassword: string
  transactionPassword: string
}

const ClientPassword = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        password: Yup.string()
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[A-Za-z0-9]{8,32}$/,
            'Must include number, uppercase and lowercase letters',
          ),
        confirmPassword: Yup.string()
          .required('Confirm password is required')
          .oneOf([Yup.ref('password')], 'Passwords must match'),
        transactionPassword: Yup.string().required('Transaction Password is required'),
      }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = handleSubmit((data) => {
    if (!client) return
    const payload = { ...data, username: client.username }

    userService.updatePassword(payload).then(() => {
      toast.success('Password updated successfully')
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
          <h2>Change Password</h2>
          <p>Update login credentials for {client.username}</p>
        </div>
        <form className='client-action-form' onSubmit={onSubmit}>
          <div className='form-group'>
            <label>New Password</label>
            <input
              type='password'
              className='form-control'
              {...register('password')}
              placeholder='Enter new password'
              maxLength={20}
            />
            {errors?.password && <span className='error'>{errors.password.message}</span>}
          </div>

          <div className='form-group'>
            <label>Confirm Password</label>
            <input
              type='password'
              className='form-control'
              {...register('confirmPassword')}
              placeholder='Confirm password'
              maxLength={20}
            />
            {errors?.confirmPassword && (
              <span className='error'>{errors.confirmPassword.message}</span>
            )}
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
              <i className='fas fa-check mr-2' /> Update Password
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientPassword

