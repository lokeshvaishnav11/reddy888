import React from 'react'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useClientDetails } from './useClientDetails'
import './client-action.css'

const ClientDetails = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()

  const detailRows = [
    { label: 'Name', value: client?.fullname || client?.username || '—' },
    { label: 'Username', value: client?.username || '—' },
    { label: 'Referral code', value: client?.referralCode || client?.referral || '—' },
    {
      label: 'Free Chip',
      value: client?.balance?.freeChip !== undefined
        ? Number(client.balance.freeChip).toFixed(2)
        : '0.00',
    },
    {
      label: 'Credit Limit',
      value: client?.creditRefrences !== undefined ? Number(client.creditRefrences).toFixed(2) : '0.00',
    },
    {
      label: 'P/L',
      value: client?.balance?.profitLoss !== undefined
        ? Number(client.balance.profitLoss).toFixed(2)
        : '0.00',
    },
    {
      label: 'Expose',
      value: client?.balance?.exposer !== undefined
        ? Number(client.balance.exposer).toFixed(2)
        : '0.00',
    },
  ]

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
          <h2>Client Details</h2>
          <p>Review profile and partnership information for {client.username}</p>
        </div>
        <div className='client-details-card'>
          <div className='client-details-title'>User Details</div>
          {detailRows.map((row) => (
            <div className='client-details-row' key={row.label}>
              <span className='client-details-label'>
                <i className='fas fa-info-circle' />
                {row.label}
              </span>
              <span className='client-details-value'>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClientDetails

