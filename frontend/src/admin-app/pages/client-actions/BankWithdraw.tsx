import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import SubmitButton from '../../../components/SubmitButton'
import userService from '../../../services/user.service'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useClientDetails } from './useClientDetails'
import './client-action.css'

type WithdrawForm = {
  amount: string
  narration: string
  transactionPassword: string
}

const BankWithdraw = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error, refresh } = useClientDetails()

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        narration: Yup.string().required('Remark is required').trim(),
        transactionPassword: Yup.string().required('Transaction Password is required'),
        amount: Yup.number()
          .required('Amount is required')
          .transform((value) => (isNaN(value) ? 0 : +value))
          .min(1, 'Amount is required')
          .max(
            client?.balance?.balance || 0,
            `Max ${(client?.balance?.balance || 0).toFixed(2)} limit`,
          ),
      }),
    [client],
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<WithdrawForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: '',
      narration: '',
      transactionPassword: '',
    },
  })

  const amountValue = Number(watch('amount') || 0)
  const parentBalance = client?.parentBalance?.balance ?? 0
  const userBalance = client?.balance?.balance ?? 0

  const onSubmit = handleSubmit((data) => {
    if (!client) return
    const payload = {
      ...data,
      userId: client._id,
      parentUserId: client.role === 'admin' ? client._id : client.parentId,
      balanceUpdateType: 'W',
    }

    userService.updateDepositBalance(payload).then(() => {
      toast.success('Balance withdrawn successfully')
      reset()
      refresh()
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
          <h2>Bank Withdraw</h2>
          <p>Return chips from {client.username} to {client.parent?.username || 'parent'}</p>
        </div>

        <div className='client-balance-board'>
          <div className='client-balance-card'>
            <h4>Parent Balance</h4>
            <div className='client-name'>{client.parent?.username || 'Parent'}</div>
            <div className='client-balance-values'>
              <span>{parentBalance.toFixed(2)}</span>
              <span className='arrow'>→</span>
              <span>{(parentBalance + amountValue).toFixed(2)}</span>
            </div>
          </div>
          <div className='client-balance-card'>
            <h4>Client Balance</h4>
            <div className='client-name'>{client.username}</div>
            <div className='client-balance-values'>
              <span>{userBalance.toFixed(2)}</span>
              <span className='arrow'>→</span>
              <span>{(userBalance - amountValue).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form className='client-action-form' onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Amount</label>
            <input
              type='number'
              step='0.01'
              min={0}
              className='form-control'
              {...register('amount')}
              placeholder='Enter withdraw amount'
            />
            {errors?.amount && <span className='error'>{errors.amount.message}</span>}
          </div>

          <div className='form-group'>
            <label>Remark</label>
            <textarea
              className='form-control'
              rows={3}
              {...register('narration')}
              placeholder='Describe the transaction reason'
            />
            {errors?.narration && <span className='error'>{errors.narration.message}</span>}
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
              <i className='fas fa-check mr-2' /> Submit
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BankWithdraw

