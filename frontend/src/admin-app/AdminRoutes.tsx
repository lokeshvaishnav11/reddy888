import React from 'react'
import { useAppSelector } from '../redux/hooks'
import User, { RoleType } from '../models/User'
import { selectUserData } from '../redux/actions/login/loginSlice'
import Login2 from '../pages/login/login2'
import UpdateWhatsapp from './pages/settings/UpdateWhatsapp'
import Settlement from './pages/settlement-report/Settlement'
// import ClientLedger from './pages/settings/ClientLedger'
const AdminHome = React.lazy(() => import('../admin-app/pages/admin-home/AdminHome'))
const ActiveMarkets = React.lazy(() => import('../admin-app/pages/active-matches/active-markets'))
const ActiveMatches = React.lazy(() => import('../admin-app/pages/active-matches/active-matches'))
const GetAllFancy = React.lazy(() => import('../admin-app/pages/active-matches/get-all-fancy'))
const MatchesPage = React.lazy(() => import('../admin-app/pages/add-matches/matches'))
const SeriesPage = React.lazy(() => import('../admin-app/pages/add-matches/series'))
const SportsPage = React.lazy(() => import('../admin-app/pages/add-matches/sports'))
const SportsPageBlock = React.lazy(() => import('../admin-app/pages/add-matches/sportsblock'))

const AddUser = React.lazy(() => import('../admin-app/pages/add-user/add-user'))
const ListClients = React.lazy(() => import('../admin-app/pages/list-clients/list-clients'))
const MainAdmin = React.lazy(() => import('../admin-app/pages/_layout/MainAdmin'))
const Message = React.lazy(() => import('../admin-app/pages/settings/message'))
const Paymethod = React.lazy(() => import('../admin-app/pages/settings/paymethod'))

const CombinedDashboard = React.lazy(() => import("../admin-app/pages/AccountStatement/CombinedDashboard"))



const Notice = React.lazy(() => import("../admin-app/pages/settings/Notices"));

const AdminDashboard = React.lazy(
  () => import('../admin-app/pages/admin-dashboard/admin-dashboard'),
)
const MarketAnalysis = React.lazy(
  () => import('../admin-app/pages/market-analysis/MarketAnalysis'),
)
const AccountStatementAdmin = React.lazy(
  () => import('../admin-app/pages/AccountStatement/AccountStatementAdmin'),
)

const AccountStatementAdminSingle = React.lazy(
  () => import('../admin-app/pages/AccountStatement/AccountStatementAdminSingle'),
)



const AccountStatementOld = React.lazy(
  () => import('../admin-app/pages/AccountStatement/AccountStatementOld'),
)
const DepositStatementAdmin = React.lazy(
  () => import('../admin-app/pages/transaction-statement/DepositStatementAdmin'),
)
const WithdrawStatementAdmin = React.lazy(
  () => import('../admin-app/pages/transaction-statement/WithdrawStatementAdmin'))
const ProfitLossAdmin = React.lazy(() => import('../admin-app/pages/PlReport/ProfitLossAdmin'))
const TopClients = React.lazy(() => import('../admin-app/pages/top-clients/TopClients'))
const TopClientsNew = React.lazy(() => import('../admin-app/pages/top-clients/TopClientsNew'))
const SportReport = React.lazy(() => import('../admin-app/pages/sport-report/SportReport'))
const SportReportNew = React.lazy(() => import('../admin-app/pages/sport-report/SportReportNew'))
const WeeklyReport = React.lazy(() => import('../admin-app/pages/weekly-report/WeeklyReport'))
const SettlementReport = React.lazy(() => import('../admin-app/pages/settlement-report/SettlementReport'))
const ChipSummary = React.lazy(() => import('../admin-app/pages/chip-summary/ChipSummary'))
const BalanceSheet = React.lazy(() => import('../admin-app/pages/balance-sheet/BalanceSheet'))
const ExportPage = React.lazy(() => import('../admin-app/pages/export/Export'))
const Profile = React.lazy(() => import('../admin-app/pages/profile/Profile'))
const UnsetteleBetHistoryAdmin = React.lazy(
  () => import('../admin-app/pages/UnsetteleBetHistory/UnsetteleBetHistoryAdmin'),
)
const Odds = React.lazy(() => import('../pages/odds/odds'))
const ChangePassword = React.lazy(() => import('../pages/ChangePassword/ChangePassword'))
const AuthLayout = React.lazy(() => import('../pages/_layout/AuthLayout'))
const Login = React.lazy(() => import('./pages/login/login'))
const CasinoWrapper = React.lazy(() => import('../pages/CasinoList/CasinoWrapper'))
const CasinoList = React.lazy(() => import('./pages/casino-list/casino-list'))
const GameReportAdmin = React.lazy(() => import('./pages/GameReports/GameReportAdmin'))
const ClientDetails = React.lazy(() => import('./pages/client-actions/ClientDetails'))
const BankDeposit = React.lazy(() => import('./pages/client-actions/BankDeposit'))
const BankWithdraw = React.lazy(() => import('./pages/client-actions/BankWithdraw'))
const ClientPassword = React.lazy(() => import('./pages/client-actions/ClientPassword'))
const ClientStatus = React.lazy(() => import('./pages/client-actions/ClientStatus'))
const ExposureLimit = React.lazy(() => import('./pages/client-actions/ExposureLimit'))
const GeneralSettings = React.lazy(() => import('./pages/client-actions/GeneralSettings'))
const TransactionPassword = React.lazy(() => import('./pages/client-actions/TransactionPassword'))


const AdminRoutes = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)

  return [
    {
      path: '/admin',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <Login /> },
        // { path: 'login', element: <Login2/> },
        {
          path: '/admin',
          element: <MainAdmin />,
          children: [
            { index: true, element: <AdminHome /> },
            { path: 'home', element: <AdminHome /> },
            { path: 'home/match/:sportId', element: <AdminHome /> },
            { path: 'home/match/:sportId/:status?', element: <AdminHome /> },
            { path: 'dashbaord', element: <AdminDashboard /> },
            { path: 'market-analysis', element: <MarketAnalysis /> },
            { path: 'odds/:matchId', element: <Odds /> },
            ...['list-clients', 'list-clients/:username' ,    "list-clients/:username/:type",].map((path) => ({
              key: 'list-client',
              path: path,
              element: <ListClients />,
            })),
            ...['add-user', 'add-user/:username' ,   "add-user/:username/:type",].map((path) => ({
              key: 'add-user',
              path: path,
              element: <AddUser />,
            })),
            ...(userState.user.role === RoleType.admin || userState.user.role === RoleType.sadmin
              ? [
                { path: 'sports-list/:url?', element: <SportsPage /> },
                { path: 'sports-list-block/:url?', element: <SportsPageBlock /> },

                { path: 'series/:sportId', element: <SeriesPage /> },
                { path: 'matches/:sportId', element: <MatchesPage /> },
                { path: 'active-matches/:sportId/:matchType?', element: <ActiveMatches /> },
                { path: 'active-markets/:matchId', element: <ActiveMarkets /> },
                { path: 'active-fancies/:matchId', element: <GetAllFancy /> },
                { path: 'messages', element: <Message /> },
              ]
              : []),
            { path: 'change-password', element: <ChangePassword /> },
            { path: 'accountstatement', element: <AccountStatementAdmin /> },
            {
              path: "accountstatement/:name",
              element: <AccountStatementAdminSingle />,
            },
            { path: 'accountstatement-old', element: <AccountStatementOld /> },

            { path: 'combined-dashboard', element: <CombinedDashboard /> },

            { path: "notice", element: <Notice /> },

            

            { path: 'profitloss', element: <ProfitLossAdmin /> },
            { path: 'top-clients', element: <TopClients /> },
            { path: 'top-clients-new', element: <TopClientsNew /> },
            { path: 'sport-report', element: <SportReport /> },
            { path: 'sport-report-new', element: <SportReportNew /> },
            { path: 'weekly-report', element: <WeeklyReport /> },
            { path: 'settlement-report', element: <SettlementReport /> },
            { path: 'settlement', element: <Settlement /> },

            { path: 'chip-summary', element: <ChipSummary /> },
            { path: 'balance-sheet', element: <BalanceSheet /> },
            { path: 'export', element: <ExportPage /> },
            { path: 'profile', element: <Profile /> },
            { path: 'unsettledbet', element: <UnsetteleBetHistoryAdmin /> },
            { path: 'unsettledbet/:type', element: <UnsetteleBetHistoryAdmin /> },
            { path: 'casino/:gameCode', element: <CasinoWrapper /> },
            { path: 'casino-list', element: <CasinoList /> },
            { path: 'game-reports', element: <GameReportAdmin /> },
            { path: 'depositstatement', element: <DepositStatementAdmin /> },
            { path: 'withdrawstatement', element: <WithdrawStatementAdmin /> },
            { path: 'payment-method', element: <Paymethod /> },
            { path: 'update-whatsapp', element: <UpdateWhatsapp /> },
            { path: 'bank-deposit/:username', element: <BankDeposit /> },
            { path: 'bank-withdraw/:username', element: <BankWithdraw /> },
            { path: 'account-statement/:username', element: <ClientPassword /> },
            { path: 'pending-bets/:username', element: <ClientStatus /> },
            { path: 'exposure-limit/:username/:type?', element: <ExposureLimit /> },
            { path: 'general-settings/:username', element: <GeneralSettings /> },
            { path: 'transaction-password/:username', element: <TransactionPassword /> },
            { path: 'client-details/:username', element: <ClientDetails /> },

            // { path: "client-ledger", element: <ClientLedger/>}


          ],
        },
      ],
    },
  ]
}

export default AdminRoutes
