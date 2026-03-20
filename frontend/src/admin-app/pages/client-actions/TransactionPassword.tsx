import React from 'react'
import { toast } from 'react-toastify'
import userService from '../../../services/user.service'
import SubmitButton from '../../../components/SubmitButton'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useClientDetails } from './useClientDetails'
import './client-action.css'

const TransactionPassword = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!client || !password) return
    setSubmitting(true)
    userService
      .resetTxnPassword({ userId: client._id, transactionPassword: password })
      .then((res) => {
        toast.success(res.data.message || 'Transaction password reset successfully')
        setPassword('')
      })
      .finally(() => setSubmitting(false))
  }

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
          <h2>Transaction Password</h2>
          <p>Reset the transaction password for {client.username}</p>
        </div>

        <form className='client-action-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>New Transaction Password</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter new transaction password'
            />
          </div>

          <div className='client-action-footer'>
            <button type='button' className='btn btn-outline-secondary' onClick={() => navigate.back()}>
              Cancel
            </button>
            <SubmitButton type='submit' className='btn btn-primary' disabled={submitting || !password}>
              <i className='fas fa-check mr-2' /> Reset Password
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionPassword

