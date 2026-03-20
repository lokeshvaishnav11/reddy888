import moment from 'moment'
import React, { MouseEvent } from 'react'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import { dateFormat } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import userService from '../../../services/user.service'
import CustomAutoComplete from '../../components/CustomAutoComplete'
import { AccoutStatement } from '../../../models/AccountStatement'
import betService from '../../../services/bet.service'
import { AxiosResponse } from 'axios'
import ReactModal from 'react-modal'
import BetListComponent from '../UnsetteleBetHistory/bet-list.component'
import { useAppSelector } from '../../../redux/hooks'
import { selectLoader } from '../../../redux/actions/common/commonSlice'
import './AccountStatement.css'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import { useParams } from 'react-router-dom'

const AccountStatementAdminSingle = () => {
    const loadingState = useAppSelector(selectLoader);

    const myuser = useParams().name;
  
    const [accountStmt, setAccountStmt] = React.useState<any>({});
    const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([]);
  
    const [tabledata, setTabledata] = React.useState<any>([]);
  
    const [closeBalance, setCloseBalance] = React.useState(0);
    const [currentItems, setCurrentItems] = React.useState<any>([]);
    const [itemOffset, setItemOffset] = React.useState<any>(0);
    const [itemsPerPage] = React.useState<any>(50);
    const [pageCount, setPageCount] = React.useState<any>(0);
  
    const [isOpen, setIsOpen] = React.useState(false);
    const [betHistory, setBetHistory] = React.useState<any>({});
    const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>(
      {} as AccoutStatement
    );
    const [openBalance, setOpenBalance] = React.useState(0);
  
    const [filterdata, setfilterdata] = React.useState<any>({
      startDate: "",
      endDate: "",
      reportType: "All",
      userId: "",
    });
    const [page, setPage] = React.useState(1);
    const [pageBet, setPageBet] = React.useState(1);
  
    React.useEffect(() => {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, parseAccountStmt]);
  
    React.useEffect(() => {
      betService.lenadena().then((res: AxiosResponse<any>) => {
        setTabledata(res.data.data);
        console.log(res, "res for lena dena jai hind !");
      });
    }, []);
  
    type TableItem = {
      Username: string;
      money: number; // The money value for Casino/Sports
      // Add other properties if needed
    };
  
    const handlePageClick = (event: any) => {
      const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length;
      setItemOffset(newOffset);
      setPage(event.selected);
    };
  
    const dataformat = (response: any, closingbalance: any) => {
      const aryNewFormat: any = [];
  
      response &&
        response.map((stmt: any, index: number) => {
          closingbalance = closingbalance + stmt.amount;
          aryNewFormat.push({
            _id: stmt._id,
            // eslint-disable-next-line camelcase
            sr_no: index + 1,
            date: moment(stmt.createdAt).format(dateFormat),
            credit: stmt.amount,
            debit: stmt.amount,
            closing: closingbalance.toFixed(2),
            narration: stmt.narration,
            type: stmt.type,
            stmt: stmt,
          });
        });
      return aryNewFormat;
    };
  
    React.useEffect(() => {
      const filterObj = filterdata;
      filterObj.startDate = moment().subtract(70, "days").format("YYYY-MM-DD");
      filterObj.endDate = moment().format("YYYY-MM-DD");
      setfilterdata(filterObj);
    }, []);
  
    const getAccountStmt = (page: number) => {
      accountService
        .getAccountList(page, filterdata)
        .then((res) => {
          if (res?.data?.data) setAccountStmt(res?.data?.data?.items || []);
          if (res?.data?.data?.items && page == 0)
            setOpenBalance(res?.data?.data?.openingBalance || 0);
          setparseAccountStmt(
            dataformat(
              res?.data?.data?.items || [],
              res?.data?.data?.openingBalance || 0
            )
          );
          setPage(page);
        })
        .catch((e) => {
          console.log(e);
          // const error = e.response.data.message
          toast.error("error");
        });
    };
  
    const handleformchange = (event: any) => {
      const filterObj = filterdata;
      filterObj[event.target.name] = event.target.value;
      setfilterdata(filterObj);
    };
  
    const submitAccountStatement = () => {
      getAccountStmt(1);
    };
  
    const handleSubmitform = (event: any) => {
      event.preventDefault();
      submitAccountStatement();
    };
  
    const onSuggestionsFetchRequested = ({ value }: any) => {
      return userService.getUserListSuggestion({ username: value });
    };
  
    // React.useEffect(()=>{
    //   submitAccountStatement();
    // },[myuser])
  
    React.useEffect(() => {
      if (myuser) {
        setfilterdata({ ...filterdata, userId: myuser });
      }
    }, [myuser]);
  
    React.useEffect(() => {
      if (filterdata.userId) {
        submitAccountStatement(); // only after userId is set
      }
    }, [filterdata.userId]);
  
    // const onSelectUser = () => {
  
    //   // console.log(user._id,"user id")
  
    //   setfilterdata({ ...filterdata, userId: myuser });
    // };
  
    const handlePageClickBets = (event: any) => {
      getBetsData(selectedStmt, event.selected + 1);
    };
  
    React.useEffect(() => {
      if (isOpen) getBetsData(selectedStmt, pageBet);
    }, [selectedStmt, pageBet, isOpen]);
  
    const getBetsData = (stmt: AccoutStatement, pageNumber: number) => {
      const betIds: any = stmt?.allBets?.map(({ betId }: any) => betId);
  
      if (betIds && betIds.length > 0) {
        betService
          .getBetListByIds(betIds, pageNumber)
          .then((res: AxiosResponse) => {
            setIsOpen(true);
            setBetHistory(res.data.data);
            setPageBet(pageNumber);
          });
      }
    };
  
    const getBets = (
      e: MouseEvent<HTMLTableCellElement>,
      stmt: AccoutStatement
    ) => {
      e.preventDefault();
      setBetHistory({});
      setSelectedStmt(stmt);
      setPageBet(1);
      setIsOpen(true);
    };
  
    const getAcHtml = () => {
      let closingbalance: number = page == 1 ? openBalance : closeBalance;
      const achtml =
        currentItems &&
        currentItems.map((stmt: any, index: number) => {
          closingbalance = closingbalance + stmt.amount;
          return (
            <tr key={`${stmt._id}${index}`}>
              {/* <td>{stmt.sr_no}</td> */}
              <td className="wnwrap">{stmt.date}</td>
              <td className="green wnwrap">
                {stmt.credit >= 0 && stmt.credit.toFixed(2)}
              </td>
              <td className="red wnwrap">
                {stmt.credit < 0 && stmt.credit.toFixed(2)}
              </td>
              <td className="green wnwrap">{stmt.closing}</td>
              {/* <td>{stmt.stmt.txnBy}</td> */}
              <td
                onClick={(e: MouseEvent<HTMLTableCellElement>) =>
                  getBets(e, stmt.stmt)
                }
              >
                <span className={stmt.type == "pnl" ? "label-buttonccc" : ""}>
                  {stmt.narration}
                </span>
              </td>
            </tr>
          );
        });
      return achtml;
    };
  
    const calculateTotal = (casino: number, sports: number) => {
      return casino + sports;
    };

  return (
    <>
      <MarqueeAnnouncement />
      <p>Acc. Stmt.</p>
      <div style={{ paddingTop: '20px' }}>
        <div className='container-fluid account-statement-page'>
          <div className='row'>
          <div className='col-md-12'>
            <div className='account-statement-filters'>
              <form onSubmit={handleSubmitform}>
                <div className='account-statement-filters-row'>
                  <div className='account-statement-filter-group'>
                    <label>Sport</label>
                    <select name='sport' onChange={handleformchange}>
                      <option value='All'>All</option>
                    </select>
                  </div>
                  <div className='account-statement-filter-group'>
                    <label>Type</label>
                    <select name='reportType' onChange={handleformchange}>
                      <option value='ALL'>All</option>
                      <option value='chip'>Deposit/Withdraw</option>
                      <option value='game'>Game Report</option>
                    </select>
                  </div>
                  <div className='account-statement-filter-group'>
                    <label>Start Date</label>
                    <input
                      name='startDate'
                      type='date'
                      autoComplete='off'
                      onChange={handleformchange}
                      defaultValue={filterdata.startDate}
                    />
                  </div>
                  <div className='account-statement-filter-group'>
                    <label>End Date</label>
                    <input
                      name='endDate'
                      type='date'
                      autoComplete='off'
                      defaultValue={filterdata.endDate}
                      onChange={handleformchange}
                    />
                  </div>
                  <button type='submit' className='account-statement-search-btn'>
                    Search
                  </button>
                </div>
              </form>
            </div>
            
            <div className='account-statement-table-wrapper'>
              <table className='account-statement-table'>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>DATE</th>
                    <th>DESC</th>
                    <th>COMM IN</th>
                    <th>COMM OUT</th>
                    <th>AMOUNT</th>
                    <th>TOTAL</th>
                    <th>D/C</th>
                    <th>BALANCE</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {parseAccountStmt.length <= 0 && (
                    <tr>
                      <td colSpan={10} className='account-statement-empty'>
                        Please select date
                      </td>
                    </tr>
                  )}
                  {parseAccountStmt.length > 0 && page == 0 && (
                    <tr key={parseAccountStmt[0]._id}>
                      <td>-</td>
                      <td>{moment(parseAccountStmt[0].createdAt).format(dateFormat)}</td>
                      <td>Opening Balance</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{openBalance}</td>
                      <td>-</td>
                    </tr>
                  )}
                  {currentItems && currentItems.map((stmt: any, index: number) => (
                    <tr key={`${stmt._id}${index}`}>
                      <td>{stmt.sr_no}</td>
                      <td>{stmt.date}</td>
                      <td>{stmt.narration}</td>
                      <td>-</td>
                      <td>-</td>
                      <td className={stmt.credit >= 0 ? 'credit' : 'debit'}>
                        {stmt.credit?.toFixed(2)}
                      </td>
                      <td>-</td>
                      <td>{stmt.credit >= 0 ? 'C' : 'D'}</td>
                      <td>{stmt.closing}</td>
                      <td>
                        <span 
                          className={stmt.type == 'pnl' ? 'remark-link' : ''}
                          onClick={(e: any) => stmt.type == 'pnl' && getBets(e, stmt.stmt)}
                        >
                          {stmt.type == 'pnl' ? 'View' : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ReactPaginate
              breakLabel='...'
              nextLabel='>>'
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousLabel={'<<'}
              breakClassName={'break-me'}
            />
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={isOpen}
        onAfterClose={() => setIsOpen(false)}
        onRequestClose={(e: any) => {
          setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'col-md-12'}
        ariaHideApp={false}
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <h5>Bets</h5>
            <button onClick={() => setIsOpen(false)} className='close float-right'>
              <i className='fa fa-times-circle'></i>
            </button>
          </div>
          <div className='modal-body'>
            {!loadingState && (
              <BetListComponent
                bethistory={betHistory}
                handlePageClick={handlePageClickBets}
                page={page}
                isTrash={false}
              />
            )}
          </div>
        </div>
      </ReactModal>
      </div>
    </>
  )
}
export default AccountStatementAdminSingle
