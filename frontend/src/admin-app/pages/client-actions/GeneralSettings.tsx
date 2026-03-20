import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppSelector } from '../../../redux/hooks'
import { selectSportList } from '../../../redux/actions/sports/sportSlice'
import userService from '../../../services/user.service'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import SubmitButton from '../../../components/SubmitButton'
import { RoleType } from '../../../models/User'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useClientDetails } from './useClientDetails'
import './client-action.css'

type GeneralSettingsForm = {
  userId: string
  userSetting: Record<string, { minBet?: number; maxBet?: number; delay?: number } | null>
  transactionPassword: string
}

const GeneralSettings = () => {
  const navigate = useNavigateCustom()
  const { client, loading, error } = useClientDetails()
  const sportListState = useAppSelector<{ sports: any[] }>(selectSportList)

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
    getValues,
    formState: { errors },
  } = useForm<GeneralSettingsForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userId: '',
      userSetting: {},
      transactionPassword: '',
    },
  })

  React.useEffect(() => {
    if (!client) return
    const userSettings = client.userSetting
    const parentSettings = client.parent?.userSetting
    const settings = userSettings || parentSettings

    setValue('userId', client._id || '')

    if (settings && Object.keys(settings).length > 0) {
      Object.keys(settings).forEach((key) => {
        setValue(`userSetting.${key}.minBet`, settings[key]?.minBet ?? 0)
        setValue(`userSetting.${key}.maxBet`, settings[key]?.maxBet ?? 0)
        setValue(`userSetting.${key}.delay`, settings[key]?.delay ?? 0)
      })
    }
  }, [client, setValue])

  const onSubmit = handleSubmit((data) => {
    const userSettingObject: Record<string, any> = {}
    Object.keys(data.userSetting || {}).forEach((key) => {
      const config = data.userSetting[key]
      if (config) {
        userSettingObject[key] = config
      }
    })

    const payload = {
      userId: data.userId,
      userSetting: userSettingObject,
      transactionPassword: data.transactionPassword,
    }

    userService.saveGeneralSetting(payload).then((res: AxiosResponse) => {
      toast.success(res.data.message || 'General settings saved')
      reset({
        ...getValues(),
        transactionPassword: '',
      })
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

  const allowedSports = sportListState.sports?.filter(
    ({ sportId }) => sportId === 1 || sportId === 2 || sportId === 4,
  )

  return (
    <div className='client-action-page'>
      <div className='client-action-card'>
        <div className='client-action-back'>
          <button className='btn btn-secondary' onClick={() => navigate.back()}>
            <i className='fas fa-arrow-left' /> Back
          </button>
        </div>
        <div className='client-action-heading'>
          <h2>General Settings</h2>
          <p>Update betting limits for {client.username}</p>
        </div>

        <form className='client-action-form' onSubmit={onSubmit}>
          <div className='client-action-table'>
            <table>
              <thead>
                <tr>
                  <th />
                  {allowedSports?.map((sport) => (
                    <th key={sport._id}>{sport.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Min Bet</td>
                  {allowedSports?.map((sport) => (
                    <td key={`min-${sport._id}`}>
                      <input
                        type='number'
                        min={0}
                        {...register(`userSetting.${sport.sportId}.minBet` as const)}
                        max={
                          client.role !== RoleType.admin
                            ? client.parent?.userSetting?.[sport.sportId]?.minBet
                            : undefined
                        }
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Max Bet</td>
                  {allowedSports?.map((sport) => (
                    <td key={`max-${sport._id}`}>
                      <input
                        type='number'
                        min={0}
                        {...register(`userSetting.${sport.sportId}.maxBet` as const)}
                        max={
                          client.role !== RoleType.admin
                            ? client.parent?.userSetting?.[sport.sportId]?.maxBet
                            : undefined
                        }
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Delay</td>
                  {allowedSports?.map((sport) => (
                    <td key={`delay-${sport._id}`}>
                      <input
                        type='number'
                        min={0}
                        {...register(`userSetting.${sport.sportId}.delay` as const)}
                        max={
                          client.role !== RoleType.admin
                            ? client.parent?.userSetting?.[sport.sportId]?.delay
                            : undefined
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
              <i className='fas fa-check mr-2' /> Save Settings
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeneralSettings

