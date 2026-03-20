import React, { useState } from 'react'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import User from '../../../models/User'
import UserService from '../../../services/user.service'
import { toast } from 'react-toastify'
import './UpdateWhatsapp.css'

const UpdateWhatsapp = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const [whatsappNumber, setWhatsappNumber] = React.useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault() // prevent page reload

    // Optional: Validate WhatsApp number length or format
    if (!whatsappNumber.match(/^\d{10,15}$/)) {
      toast.error('Please enter a valid WhatsApp number')
      return
    }

    const updatedUser = { ...userState.user, whatsapp: whatsappNumber }

    UserService.updateUserWhatsapp(updatedUser)
      .then(() => {
        toast.success('WhatsApp number updated successfully')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Failed to update WhatsApp nu.mber')
      })
  }

  return (
    <div className="update-whatsapp-page">
      <div className='whatsapp-card'>
        <h3 className='whatsapp-heading'>Update WhatsApp Number</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className='whatsapp-label'>WhatsApp Number <span className='required'>*</span></label>
            <input
              type="text"
              className="whatsapp-input"
              placeholder="Enter 10-15 digit WhatsApp number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="whatsapp-update-btn">UPDATE</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateWhatsapp
