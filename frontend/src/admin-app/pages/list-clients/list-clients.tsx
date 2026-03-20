import React, { ChangeEvent, FormEvent, MouseEvent } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import userService from '../../../services/user.service'
import { AxiosResponse } from 'axios'
import User, { RoleName, RoleType } from '../../../models/User'
import UserService from '../../../services/user.service'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CustomLink } from '../../../pages/_layout/elements/custom-link'
import { useWebsocketUser } from '../../../context/webSocketUser'
import Pdf from 'react-to-pdf'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { debounce } from 'lodash'
import betService from '../../../services/bet.service'
import ReactPaginate from 'react-paginate'
import './list-clients.css'

const ListClients = () => {
  const ref: any = React.createRef()
  const userState = useAppSelector(selectUserData)
  const [page, setPage] = React.useState(1)

  const [users, setUserList] = React.useState<{ items: User[]; totalPages?: number }>()
  const [usersTotal, setUserListTotal] = React.useState<any>({
    totalcr: 0,
    totalbalance: 0,
    clientpl: 0,
    exposer: 0,
    totalExposer: 0,
    avl: 0,
  })
  const { socketUser } = useWebsocketUser()
  const { username } = useParams()
  const [searchParams] = useSearchParams()
  const [selectAll, setSelectAll] = React.useState(false)
  const [activeDeactive, setActiveDeactive] = React.useState(true)
  const [sortBy, setSortBy] = React.useState('')
  const [showReportsMenu, setShowReportsMenu] = React.useState<number | null>(null)
  const [userbook, setUserBook] = React.useState(false)
  const [userBookData, setUserBookData] = React.useState<any>(null)

  const [searchObj, setSearchObj] = React.useState<any>({
    type: '',
    username: '',
    status: '',
    search: '',
  })

  const newtype = useParams().type;

  const roles = React.useMemo(() => {
    const { user } = userState
    const allOptions = Object.keys(RoleType)
    const startIndex = allOptions.indexOf(user.role!)
    return allOptions.slice(startIndex + 1).filter((role) => role !== 'admin')
  }, [userState])

  React.useEffect(() => {
    setSearchObj({ ...searchObj, username: username! })
  }, [username])

  React.useEffect(() => {
    const search = searchParams.get('search') ? searchParams.get('search') : ''
    getList({ username: username!, search: search!, type: '' })
    setPage(1)
  }, [username, searchParams.get('search')])

  React.useEffect(() => {
    clientlistdata(users)
  }, [users])

  const handlePageClick = (event: any) => {
    //
    setPage(event.selected + 1)
    getList({ ...searchObj, page: event.selected + 1 })
  }



  const getList = (obj: {
    username: string
    type: string
    search: string
    status?: string
    page?: number
  }) => {
    if (!obj.page) obj.page = 1
    userService.getUserList(obj).then((res: AxiosResponse<any>) => {
      setSearchObj(obj)
      console.log(res.data.data)
      setUserList(res.data.data)
      clientlistdata(res.data.data.items)
    })
  }

  /***** UPDATE USER AND BAT STATUS ****/

  const updateStatus = (itemIndex: number, value: any, type: string) => {
    const updateListOfItems = users && users.items.length > 0 ? [...users.items] : []
    const item = updateListOfItems[itemIndex]
    type === 'user' ? (item.isLogin = value) : (item.betLock = value)
    setUserList({ ...users, items: updateListOfItems })
    const formData = {
      isUserActive: item.isLogin ? item.isLogin : false,
      isUserBetActive: item.betLock ? item.betLock : false,
      username: item.username,
      single: true,
    }

    UserService.updateUserAndBetStatus(formData)
      .then(() => {
        toast.success('Status Updated Successfully')
      })
      .catch((e) => {
        const error = e.response.data.message
        toast.error(error)
      })
  }

  /******** UPDATE LIST DATA ********/

  const updateListUser = (user: User) => {
    // if (user.balance) {
    //   console.log(user)
    //   const updateListOfItems = [...users]
    //   const index = updateListOfItems.findIndex((u) => u.username === user.username)
    //   updateListOfItems[index].balance = user.balance
    //   //updateListOfItems[index].profitLoss = user.amount
    //   clientlistdata(updateListOfItems)
    //   setUserList(updateListOfItems)
    // }
    getList({ ...searchObj, search: 'false' })
  }
  const logOutAllUsers = () => {
    socketUser.emit('logoutAll')
  }
  const exportExcel = () => {
    // export pdf
    const usersData = users?.items.map((user) => {
      const { username, creditRefrences, balance, isLogin, betLock, exposerLimit, role } = user
      return {
        Username: username,
        'Credit Refrences': creditRefrences,
        Balance: balance?.balance.toFixed(2),
        'Client Pnl': getclientpl(user),
        Exposer: balance?.exposer?.toFixed(2),
        'Available Balance': ((balance?.balance || 0) - (balance?.exposer || 0)).toFixed(2),
        'Is Login': isLogin,
        'Bet Lock': betLock,
        'Exposer Limit': exposerLimit,
        Percentage: 0,
        Role: RoleName[role!],
      }
    })
    exportToExcel(usersData)
  }

  const setuserresponse = () => {
    if (!userbook) {
      userService.getUserBook().then((res: AxiosResponse<any>) => {
        setUserBook(true)
        setUserBookData(res.data.data)
      })
    } else {
      setUserBook(false)
    }
  }

  const getclientpl = (row: any) => {
    const clientpl = row.balance?.profitLoss || 0
    // if (row) {
    //   clientpl = (parseFloat(row?.creditRefrences) - parseFloat(row?.balance?.balance)).toFixed(2)
    // }
    return clientpl
  }

  const exportToExcel = (data: any) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Convert the data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Convert the Excel buffer to a Blob
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Save the Blob as a file
    saveAs(blob, `users-${moment().format('MMMM-Do-YYYY-h:mm:ss-a')}.xlsx`)
  }

  const clientlistdata = (userd: any) => {
    let objTotal: any = {
      totalcr: 0,
      totalbalance: 0,
      clientpl: 0,
      exposer: 0,
      totalExposer: 0,
      avl: 0,
    }
    if (userd) {
      userd.items
        ?.filter((user: User) => user.isLogin === activeDeactive)
        ?.map((user: User, index: number) => {
          const balance: any = mainBalance(user)
          const casinoexposer: any =
            user && user.balance && user.balance.casinoexposer ? user.balance.casinoexposer : 0
          const exposer: any =
            user && user.balance && user.balance.exposer
              ? user.balance.exposer + +casinoexposer
              : 0 + +casinoexposer
          const mainbalance: any =
            user && user.balance && user.balance.balance ? user.balance.balance : 0
          const totalcr =
            objTotal.totalcr + +(user && user.creditRefrences ? user.creditRefrences : 0)
          const totalbalance: number = objTotal.totalbalance + +balance
          const clientpl: number = objTotal.clientpl + +getclientpl(user)
          const totalExposer: number = objTotal.totalExposer + +exposer
          const avl: number = objTotal.avl + +(mainbalance - exposer)

          objTotal = {
            ...objTotal,
            ...{ totalbalance, totalcr, clientpl, exposer, totalExposer, avl },
          }
        })
    }
    setUserListTotal(objTotal)
  }


  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //setSearchClient('')
    getList({ ...searchObj, search: 'true' })
  }

  const getcurrentpartnership = (users: any) => {
    const userp = users?.partnership || {}
    const ownration = userp[4] ? userp[4].ownRatio : '0'
    return ownration
  }

  const isAdmin = React.useCallback(
    (user: User) => {
      if (userState.user.role !== RoleType.admin && userState.user.role !== RoleType.sadmin) {
        return user?.parentStr?.[user?.parentStr?.length - 1] === userState.user._id
      }
      return true
    },
    [userState],
  )

  const mainBalance = (row: any) => {
    const creditRef = row?.creditRefrences || 0
    const balss = row?.balance?.balance || 0

    const clientpl = row.balance?.profitLoss || 0
    // return (parseFloat(creditRef) + +parseFloat(clientpl))?.toFixed(2)
    return parseFloat(balss).toFixed(2)

  }
  /* Checkbox functionality */
  const handleSelectItem = (user: User) => {
    if (users && users.items.length > 0) {
      const updatedUsers = users.items.map((u) =>
        u === user ? { ...u, selected: !u.selected } : u,
      )

      setUserList({ ...users, items: updatedUsers })
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll) // Toggle the state of "Select All" checkbox
    if (users) {
      const updatedHistory = users.items.map((user: User) => ({
        ...user,
        selected: !selectAll,
      }))
      setUserList({ ...users, items: updatedHistory })
    }
  }

  const lock = (e: MouseEvent<HTMLAnchorElement>, lock: boolean, type: string) => {
    e.preventDefault()

    const select = users?.items.reduce((selected: boolean, item: User) => {
      if (item.selected) {
        selected = true
      }
      return selected
    }, false)
    if (selectAll || select) {
      const selectedItems: any = users?.items
        .filter((item: User) => item.selected)
        .map((item: User) => item._id)
      if (selectedItems.length > 0 && users) {
        betService.usersLockClientList({ ids: selectedItems, lock, type }).then((res) => {
          if (res.data.data.success) {
            const updatedUsers = users.items.map((u) => ({
              ...u,
              selected: !u.selected,
              [type === 'betLock' ? 'betLock' : 'isLogin']: lock,
            }))
            setUserList({ ...users, items: updatedUsers })
            setSelectAll(false)
            toast.success(res.data.message)
          }
        })
      }
    } else {
      toast.error('Please select one item')
    }
  }

  const onSearch = (e: string) => {
    if (e) getList({ username: e, search: 'true', type: '' })
    else if (username) getList({ username: username, search: 'false', type: '' })
    else getList({ username: '', search: 'false', type: '' })
  }

  const typesOfClients = (e: MouseEvent<HTMLAnchorElement>, status: string) => {
    e.preventDefault()
    setActiveDeactive(status === 'true')
    getList({ username: username!, search: 'false', type: '', status })
  }

  const debouncedChangeHandler = React.useCallback(debounce(onSearch, 500), [username])
  const finalExposer = (userB: any) => {
    const ex = userB?.exposer?.toString() || '0'
    const cex = userB?.casinoexposer?.toString() || '0'
    console.log(ex)
    const finalE = parseFloat(ex) + +parseFloat(cex)
    return finalE.toFixed(2)
  }

  // Sorting function
  const getSortedUsers = () => {
    if (!users?.items) return []
    
    const filteredUsers = users.items.filter((user: User) => {
      const shouldFilterByType =
                          newtype && newtype.trim() !== "";
                        if (shouldFilterByType && user.role !== newtype) {
                          return null;
                        }
      if (activeDeactive !== user.isLogin && user.role !== RoleType.admin) return false
      return true
    })

    if (!sortBy) return filteredUsers

    const sorted = [...filteredUsers].sort((a, b) => {
      switch (sortBy) {
        case 'pl_asc':
          return (a.balance?.profitLoss || 0) - (b.balance?.profitLoss || 0)
        case 'pl_desc':
          return (b.balance?.profitLoss || 0) - (a.balance?.profitLoss || 0)
        case 'exp_asc':
          const expA = (a.balance?.exposer || 0) + (a.balance?.casinoexposer || 0)
          const expB = (b.balance?.exposer || 0) + (b.balance?.casinoexposer || 0)
          return expA - expB
        case 'exp_desc':
          const expA2 = (a.balance?.exposer || 0) + (a.balance?.casinoexposer || 0)
          const expB2 = (b.balance?.exposer || 0) + (b.balance?.casinoexposer || 0)
          return expB2 - expA2
        default:
          return 0
      }
    })

    return sorted
  }

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0 });


  return (
    <>
      <div className='list-clients-container'>
        <div className='container-fluid'>


        <div className='master-balance'>
            <div
              className='text-center '
              onClick={() => {
                setuserresponse()
              }}
            >
              <span className='far fa-arrow-alt-circle-down' id='user-balance' />
              <span className='far fa-arrow-alt-circle-up' />
            </div>
            {userbook && (
              <div className='master-balance-detail m-t-20' id='master-balance-detail'>
                <div className='master-balance'>
                  <div className='master-balance-detail m-t-20' id='master-balance-detail'>
                    <ul className='row'>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left  p-0'>
                          Upper Level Credit Referance:
                        </label>
                        <span className='text-right col-md-4  p-0'>
                          {userBookData.uplevelcr?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>Down level Occupy Balance:</label>
                        <span className='text-right col-md-4  p-0'>
                          {userBookData.downlineob?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0 '>
                          Down Level Credit Referance:
                        </label>
                        <span className='text-right col-md-4  p-0'>
                          {userBookData.downcr?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>Total Master Balance</label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.totalmasterb?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>Upper Level:</label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.upperlvell?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>Down Level Profit/Loss :</label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.downpl?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>Available Balance:</label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.availableB?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>
                          Available Balance With Profit/Loss:
                        </label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.avpl?.toFixed(2)}
                        </span>
                      </li>
                      <li className='col-md-4'>
                        <label className='col-md-8 text-left p-0'>My Profit/Loss:</label>
                        <span className='text-right col-md-4 p-0'>
                          {userBookData.mypl?.toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>



          {/* Top Controls */}
          <div className='clients-top-controls d-none'>
            <div className='clients-top-left'>
              {(userState.user.role == RoleType.admin ||
                userState.user.role == RoleType.sadmin) && (
                <button onClick={logOutAllUsers} className='btn-logout-all'>
                  Logout All Users
                </button>
              )}
              <button onClick={exportExcel} className='btn-excel'>
                Excel
              </button>
              <Pdf
                targetRef={ref}
                filename={`users-${moment().format('MMMM-Do-YYYY-h:mm:ss-a')}.pdf`}
              >
                {({ toPdf }: any) => (
                  <button className='btn-pdf' onClick={toPdf}>
                    PDF
                  </button>
                )}
              </Pdf>
            </div>
            <div className='clients-top-right'>
              {username ? (
                <CustomLink to={`/add-user/${username}`} className='btn-add-account'>
                  Add Account
                </CustomLink>
              ) : (
                <CustomLink to={`/add-user`} className='btn-add-account'>
                  Add Account
                </CustomLink>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className='clients-tabs mt-4'>
            <button
              className={activeDeactive ? 'active' : ''}
              onClick={(e) => typesOfClients(e as any, 'true')}
            >
              Active
            </button>
            <button
              className={!activeDeactive ? 'active' : ''}
              onClick={(e) => typesOfClients(e as any, 'false')}
            >
              Deactive
            </button>
          </div>

          {/* Search and Sort Header */}
          <div className='clients-header-bar'>
            <div className='clients-search-box'>
              <i className='fas fa-search search-icon'></i>
              <input
                type='text'
                placeholder='Search Username'
                onChange={(e) => debouncedChangeHandler(e.target.value)}
              />
            </div>
            <div className='clients-sort-dropdown'>
              <select value={sortBy} onChange={handleSortChange}>
                <option value=''>Sorting</option>
                <option value='pl_asc'>PL ASC</option>
                <option value='pl_desc'>PL DESC</option>
                <option value='exp_asc'>Exposer ASC</option>
                <option value='exp_desc'>Exposer DESC</option>
              </select>
            </div>
            <button className='clients-search-btn' onClick={() => getList({ ...searchObj, search: 'true' })}>
              SEARCH
            </button>
          </div>

          {/* Table */}
          <div className='clients-table-wrapper'>
            <table className='clients-table' style={{overflowX:"scroll" , overflowY:"scroll" }} ref={ref}>
              <thead>
                <tr>
                  <th>USERNAME</th>
                  <th>BALANCE</th>
                  <th>P/L</th>
                  <th>EXP</th>
                  <th>CLIENT SHARE</th>
                  <th>UP-LINE</th>
                  <th>STATUS</th>
                  <th>BET</th>
                  <th>OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {getSortedUsers().map((user: User, index: number) => (
                  <tr key={user._id}>
                    {/* Username with Badge */}
                    <td>
                      <div className='username-badge'>
                        <span className='badge-icon'>C</span>
                        {user.role !== RoleType.user ? (
                          <CustomLink to={`/list-clients/${user.username}`} style={{ color: 'white', textDecoration: 'none' }}>
                            {user.username}
                          </CustomLink>
                        ) : (
                          <span>{user.username}</span>
                        )}
                      </div>
                    </td>

                    {/* Balance */}
                    <td>{mainBalance(user)}</td>

                    {/* P/L */}
                    <td style={{ color: (user?.balance?.profitLoss || 0) >= 0 ? '#48bb78' : '#e53e3e', fontWeight: 600 }}>
                      {user?.balance?.profitLoss?.toFixed(2) || '0.00'}
                    </td>

                    {/* Exposure */}
                    <td>{finalExposer(user?.balance)}</td>

                    {/* Client Share */}
                    <td>{getcurrentpartnership(user)}.00</td>

                    {/* Up-Line */}
                    <td>{userState?.user?.role === RoleType.admin ? 'BTVIP1' : userState?.user?.username}</td>

                    {/* Status - Lock Icon */}
                    <td>
                      <div
                        className={`status-lock ${user?.isLogin ? 'unlocked' : 'locked'}`}
                        onClick={() => updateStatus(index, !user?.isLogin, 'user')}
                        title={user?.isLogin ? 'Active' : 'Inactive'}
                      >
                        <i className={`fas ${user?.isLogin ? 'fa-unlock' : 'fa-lock'}`}></i>
                      </div>
                    </td>

                    {/* Bet - Lock Icon */}
                    <td>
                      <div
                        className={`status-lock ${user?.betLock ? 'unlocked' : 'locked'}`}
                        onClick={() => updateStatus(index, !user?.betLock, 'bet')}
                        title={user?.betLock ? 'Unlocked' : 'Locked'}
                      >
                        <i className={`fas ${user?.betLock ? 'fa-unlock' : 'fa-lock'}`}></i>
                      </div>
                    </td>

                    {/* Options - Action Buttons */}
                    <td>
                      <div className='action-buttons'>
                        {isAdmin(user) && user.role !== RoleType.admin && (
                          <CustomLink to={`/add-user/${user.username}`}>
                            <button
                              className='action-btn btn-cr'
                              title='Credit Reference - Edit User'
                            >
                              CR
                            </button>
                          </CustomLink>
                        )}
                        <CustomLink to={`/bank-deposit/${user.username}`}>
                          <button className='action-btn btn-deposit' title='Bank Deposit'>
                            BANK DEPOSIT
                          </button>
                        </CustomLink>

                        <CustomLink    to={`/accountstatement/${user?._id}`}>
                          <button className='action-btn btn-deposit' title='Bank Deposit'>
                            ACCOUNT STATEMENT
                          </button>
                        </CustomLink>
                        <CustomLink to={`/bank-withdraw/${user.username}`}>
                          <button className='action-btn btn-withdraw' title='Bank Withdraw'>
                            BANK WITHDRAW
                          </button>
                        </CustomLink>
                        <CustomLink to={`/account-statement/${user.username}`}>
                          <button className='action-btn btn-statement' title='Change Password'>
                            CHANGE PASSWORD
                          </button>
                        </CustomLink>
                        <CustomLink to={`/pending-bets/${user.username}`}>
                          <button className='action-btn btn-pending' title='Status'>
                            STATUS
                          </button>
                        </CustomLink>
                        {isAdmin(user) && (
                          <div style={{ position: 'relative' }}>
                            <button
                              className='reports-menu-btn'
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownPos({
                                  top : rect.top - 120,
                                  left: rect.left -20,
                                });
                                setShowReportsMenu(showReportsMenu === index ? null : index);
                              }}
                              title='More Options'
                            >
                              ⋮
                            </button>
                            {showReportsMenu === index && (
                              <div className='reports-dropdown' style={{
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                              }}>
                                <CustomLink to={`/exposure-limit/${user.username}/exposure`} onClick={() => setShowReportsMenu(null)}>
                                  Exposure Limit
                                </CustomLink>
                                <CustomLink to={`/general-settings/${user.username}`} onClick={() => setShowReportsMenu(null)}>
                                  General Settings
                                </CustomLink>
                                <CustomLink to={`/transaction-password/${user.username}`} onClick={() => setShowReportsMenu(null)}>
                                  Transaction Password
                                </CustomLink>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <ReactPaginate
            breakLabel='...'
            nextLabel='>>'
            forcePage={page - 1}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={users?.totalPages || 0}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousLabel={'<<'}
            breakClassName={'break-me'}
          />

        </div>
      </div>
    </>
  )
}
export default ListClients
