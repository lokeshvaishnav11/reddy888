import { AxiosResponse } from 'axios'
import React, { ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { useWebsocketUser } from '../../../../context/webSocketUser'
import authService from '../../../../services/auth.service'
import mobileSubheader from '../../_layout/elements/mobile-subheader'
import './message.css'

const Message = () => {
  const { socketUser } = useWebsocketUser()
  const [settingList, setSettingList] = React.useState<
    { name: string; label: string; value: any; active: boolean }[]
  >([])
  React.useEffect(() => {
    authService.getSettingsList().then((res: AxiosResponse<any>) => {
      setSettingList(res.data.data.settings)
    })
  }, [])

  React.useEffect(() => {
    socketUser.on('loggedOut', (msg) => {
      toast.success(msg)
    })
    return () => {
      socketUser.off('logoutAll')
      socketUser.off('loggedOut')
    }
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const allSettingList: any = [...settingList]
    allSettingList[index]['value'] = e.target.value
    setSettingList(allSettingList)
  }

  const onChangeActive = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const allSettingList: any = [...settingList]
    allSettingList[index]['active'] = e.target.checked
    setSettingList(allSettingList)
  }

  const handleSettingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    authService.saveSettingList(settingList).then((res: AxiosResponse<any>) => {
      toast.success(res.data.message)
    })
  }

  return (
    <>
      <div className='messages-page'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='messages-form-container'>
                <form onSubmit={handleSettingSubmit}>
                  <div className='row'>
                    {settingList.map((setting, index) => (
                      <div key={setting.name} className='col-lg-6'>
                        <div className='form-group messages-form-group'>
                          <label className='messages-label'>
                            {setting.label} *{' '}
                            {'active' in setting && setting.name == 'userMaintenanceMessage' ? (
                              <input
                                type={'checkbox'}
                                checked={setting.active}
                                onChange={(e) => onChangeActive(e, index)}
                                className='messages-checkbox'
                              />
                            ) : (
                              ''
                            )}
                          </label>
                          <div className='form-label-group'>
                            <input
                              type='text'
                              name={setting.name}
                              id='user_name'
                              required
                              className='form-control messages-input'
                              placeholder='Admin Text'
                              value={setting.value}
                              onChange={(e) => onChange(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className='col-lg-12'>
                      <div className='messages-submit-wrapper'>
                        <button type='submit' className='btn btn-primary messages-submit-btn'>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Message
