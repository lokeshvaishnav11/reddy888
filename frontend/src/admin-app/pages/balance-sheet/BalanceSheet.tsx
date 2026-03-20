import React from 'react'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import './balance-sheet.css'
import UserService from '../../../services/user.service'
import userService from '../../../services/user.service'
import { AxiosResponse } from 'axios'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { useAppSelector } from '../../../redux/hooks'
import User from '../../../models/User'

const calcTotal = (arr: any[]) => arr.reduce((s, i) => s + parseFloat(String(i.chip || 0)), 0)

const BalanceSheet = () => {
 
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
   

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: 20 }}>
        <div className='container'>
          {/* {loading && <div>Loading...</div>} */}
          {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
          <div className='balance-container'>
            <div className='left-panel'>
              <table className='summary-table'>
                <thead>
                  <tr>
                    <th className='ut-col'>UT</th>
                    <th>Username</th>
                    <th style={{ textAlign: 'right' }}>Chip</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
         
                    <tr>
                      <td className='ut-col'>{}</td>
                      <td style={{ fontWeight: 700 }}>{detail?.username}</td>
                      <td style={{ textAlign: 'right', color: '#059669', fontWeight: 700 }}>{detail?.balance?.balance}</td>
                      {/* <td>
                        <button className='history-btn'>HISTORY</button>
                      </td> */}
                    </tr>
                 

                  <tr>
                    <td>#</td>
                    <td style={{ fontWeight: 700 }}>Up-Line P/L</td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: 700 }}>{detail?.parentBalance?.balance}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>#</td>
                    <td style={{ fontWeight: 700 }}>My Commission</td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: 700 }}>0</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>#</td>
                    <td style={{ fontWeight: 700 }}>My P/L</td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: 700 }}>{detail?.balance?.balance}</td>
                    <td>-</td>
                  </tr>

                  <tr className='total-row'>
                    <td colSpan={2} style={{ textAlign: 'left', paddingLeft: 16, fontWeight: 800 }}>TOTAL</td>
                    {/* <td style={{ textAlign: 'right', fontWeight: 800 }}>{leftTotal.toFixed(2)}</td> */}
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='right-panel'>
              <table className='list-table'>
                <thead>
                  <tr>
                    <th className='ut-col'>UT</th>
                    <th>Username</th>
                    <th style={{ textAlign: 'right' }}>Chip</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {userList?.items?.map((r:any, idx:any) => (
                    <tr key={idx}>
                     <td className='ut-col'>
  {r.role === 'admin'
    ? 'A'
    : r.role === 'smdl'
    ? 'S'
    : r.role === 'mdl'
    ? 'M' 
    : r.role === "dl" 
    ? 'A'
    : 'C'}
</td>

                      <td style={{ fontWeight: 700 }}>{r.username}</td>
                      <td style={{ textAlign: 'right', color: '#b91c1c', fontWeight: 700 }}>{r.balance?.balance}</td>
                      {/* <td>
                        <button className='history-btn'>HISTORY</button>
                      </td> */}
                    </tr>
                  ))}

                  <tr className='total-row'>
                    <td colSpan={2} style={{ textAlign: 'left', paddingLeft: 16, fontWeight: 800 }}>TOTAL</td>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>{totalWalletBalance}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BalanceSheet
