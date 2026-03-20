import React from 'react'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import './chip-summary.css'
import { useAppSelector } from '../../../redux/hooks'
import User from '../../../models/User'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { AxiosResponse } from 'axios'

import UserService from '../../../services/user.service'
import userService from '../../../services/user.service'


const ChipSummary = () => {
  // Placeholder data to match screenshot


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
        <div className='container-fluid report-page'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card chip-card'>
                <div className='card-header chip-card-header'>
                  <h3>CHIP SMRY</h3>
                </div>
                <div className='card-body chip-card-body'>
                  <table className='chip-table'>
                    <tbody>
                      <tr><td>User : {detail?.username}</td></tr>
                      <tr><td>Current Balance : {detail?.balance?.balance}</td></tr>
                      <tr><td>Down-Line Credit Remaining :  {detail?.balance?.balance}</td></tr>
                      <tr><td>Client Total Wallet : {totalWalletBalance}</td></tr>
                      <tr><td>Up-line P L : {detail?.parentBalance?.balance}</td></tr>
                      <tr><td>Total Clients : {userList?.totalItems}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChipSummary
