import React from 'react'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import './profile.css'
import userService from '../../../services/user.service'
import { AxiosResponse } from 'axios'
import { useAppSelector } from '../../../redux/hooks'
import User from '../../../models/User'
import { selectUserData } from '../../../redux/actions/login/loginSlice'

import UserService from '../../../services/user.service'

const Profile = () => {
  // Placeholder user data
  const userState = useAppSelector<{ user: User }>(selectUserData)
  


  const [newbalance, setNewbalance] = React.useState<any>();
 
   const [shared, setShared] = React.useState();
   const [detail, setDetail] = React.useState<any>({});

   const username: any = userState?.user?.username; 
     const [selectedUser, setSelectedUser] = React.useState<any>(null);
     React.useEffect(() => {
       if (username) {
         UserService.getUserDetail(username).then((res: AxiosResponse<any>) => {
           setSelectedUser(res.data.data)
         })
       }
     }, [username])
 
 
   React.useEffect(() => {
     // const userState = useAppSelector<{ user: User }>(selectUserData);
     const username: any = userState?.user?.username;
 
     console.log(username, "testagentmaster");
     UserService.getParentUserDetail(username).then(
       (res: AxiosResponse<any>) => {
         console.log(res, "check balance for parent");
         const thatb = res?.data?.data[0];
         setDetail(thatb);
         setNewbalance(thatb?.balance?.balance);
         setShared(thatb?.share);
       }
     );
   }, [userState]);


   const [searchObj, setSearchObj] = React.useState({
     username: "",
     type: "",
     search: "",
     status: "",
     page: 1,
   });
 
   // const [userList, setUserList] = React.useState([]);
   const [userList, setUserList] = React.useState<any>({});
 
   const getList = (obj: {
     username: string;
     type: string;
     search: string;
     status?: string;
     page?: number;
   }) => {
     const fullObj = {
       username: userState?.user?.username,
       type: obj.type,
       search: obj.search,
       status: obj.status ?? "", // fallback to empty string
       page: obj.page ?? 1, // fallback to 1
     };
 
     userService.getUserList(fullObj).then((res: AxiosResponse<any>) => {
       setSearchObj(fullObj); // ✅ Now matches the expected state shape
       console.log(res?.data?.data, "lista i want to render");
       setUserList(res?.data?.data);
     });
   };
 
   React.useEffect(() => {
     getList(searchObj); // Trigger on mount or when searchObj changes
   }, [userState]);


   const totalWalletBalance = userList?.items?.reduce(
     (sum: number, user: any) => sum + (user.balance?.balance || 0),
     0
   )
   

  const [passwords, setPasswords] = React.useState({ oldPass: '', newPass: '', retype: '' })

  const handleChange = (e: any) => setPasswords({ ...passwords, [e.target.name]: e.target.value })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    // TODO: call change password API
    alert('Password update requested (placeholder)')
  }

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: 20 }}>
        <div className='container-fluid report-page'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='profile-card'>
                <h3 className='profile-title'>User Details</h3>
                <div className='profile-list'>
                  <div className='profile-row'><i className='fa fa-smile-o icon'/> <span>Name : {detail?.username}</span></div>
                  <div className='profile-row'><i className='fa fa-user icon'/> <span>Username : {detail?.username}</span></div>
                  <div className='profile-row'><i className='fa fa-credit-card icon'/> <span>Free Chip : {detail?.balance?.balance}</span></div>
                  <div className='profile-row'><i className='fa fa-dollar icon'/> <span>P/L : {detail.balance?.balance.toFixed(2)}</span></div>
                  <div className='profile-row'><i className='fa fa-line-chart icon'/> <span>Expose : {0}</span></div>
                  <div className='profile-row'><i className='fa fa-users icon'/> <span>Cricket Client Share :
                     {selectedUser?.partnership?.[4]?.ownRatio}
                     </span>
                  </div>
                  {/* <div className='profile-row'><i className='fa fa-users icon'/> <span>Football Client Share : {user.footballShare.toFixed(2)}</span></div> */}
                  <div className='profile-row'><i className='fa fa-users icon'/> <span>Tennis Client Share :  {selectedUser?.partnership?.[2]?.ownRatio}</span></div>
                  {/* <div className='profile-row'><i className='fa fa-users icon'/> <span>Horse Client Share : {user.horseShare.toFixed(2)}</span></div>
                  <div className='profile-row'><i className='fa fa-users icon'/> <span>Greyhound Client Share : {user.greyhoundShare.toFixed(2)}</span></div> */}
                  <div className='profile-row'><i className='fa fa-users icon'/> <span>iCasino Client Share :  {selectedUser?.partnership?.[1]?.ownRatio}</span></div>
                </div>
              </div>

              <div className='profile-card change-password-card'>
                <h3 className='profile-title'>CHANGE PASSWORD</h3>
                <form className='change-password-form' onSubmit={handleUpdate}>
                  <div className='form-row'>
                    <label>Old Password</label>
                    <input name='oldPass' type='password' placeholder='Old Password' value={passwords.oldPass} onChange={handleChange} />
                  </div>
                  <div className='form-row'>
                    <label>New Password</label>
                    <input name='newPass' type='password' placeholder='New Password' value={passwords.newPass} onChange={handleChange} />
                  </div>
                  <div className='form-row'>
                    <label>Re-Type Password</label>
                    <input name='retype' type='password' placeholder='Re-Type Password' value={passwords.retype} onChange={handleChange} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button className='update-btn' type='submit'>UPDATE</button>
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

export default Profile
