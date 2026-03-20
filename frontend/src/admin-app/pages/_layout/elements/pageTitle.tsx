import React from 'react'
import { useLocation } from 'react-router-dom'

const PageTitle = () => {
  const location = useLocation()

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname
    
    if (path.includes('combined-dashboard') || path === '/admin' || path === '/admin/') {
      return 'DASHBOARD'
    } else if (path.includes('list-clients')) {
      return 'LIST OF CLIENTS'
    } else if (path.includes('market-analysis')) {
      return 'MARKET ANALYSIS'
    } else if (path.includes('account-statement') || path.includes('accountstatement')) {
      return 'ACCOUNT STATEMENT'
    } else if (path.includes('unsettledbet')) {
      return 'CURRENT BETS'
    } else if (path.includes('game-reports')) {
      return 'GAME REPORTS'
    } else if (path.includes('profitloss')) {
      return 'PROFIT AND LOSS'
    } else if (path.includes('depositstatement')) {
      return 'DEPOSIT STATEMENT'
    } else if (path.includes('withdrawstatement')) {
      return 'WITHDRAW STATEMENT'
    } else if (path.includes('casino')) {
      return 'LIVE CASINO'
    } else if (path.includes('sports-list')) {
      return 'SPORTS SETTINGS'
    } else if (path.includes('messages')) {
      return 'MESSAGES'
    } else if (path.includes('payment-method')) {
      return 'PAYMENT METHOD'
    } else if (path.includes('update-whatsapp')) {
      return 'UPDATE WHATSAPP'
    } else if (path.includes('add-user')) {
      return 'ADD USER'
    } else if (path.includes('change-password')) {
      return 'CHANGE PASSWORD'
    } else if (path.includes('bank-deposit')) {
      return 'BANK DEPOSIT'
    } else if (path.includes('bank-withdraw')) {
      return 'BANK WITHDRAW'
    } else if (path.includes('pending-bets')) {
      return 'PENDING BETS'
    } else if (path.includes('exposure-limit')) {
      return 'EXPOSURE LIMIT'
    } else if (path.includes('general-settings')) {
      return 'GENERAL SETTINGS'
    } else if (path.includes('transaction-password')) {
      return 'TRANSACTION PASSWORD'
    } else if (path.includes('client-details')) {
      return 'CLIENT DETAILS'
    }
    // Added mappings for newly created admin pages
    else if (path.includes('accountstatement-old') || path.includes('account-statement-old')) {
      return 'OLD A/C STATEMENTS'
    } else if (path.includes('top-clients') && !path.includes('top-clients-new')) {
      return 'TOP CLIENTS'
    } else if (path.includes('top-clients-new')) {
      return 'TOP CLIENTS NEW'
    } else if (path.includes('sport-report') && !path.includes('sport-report-new')) {
      return 'SPORT REPORT'
    } else if (path.includes('sport-report-new')) {
      return 'SPORT REPORT NEW'
    } else if (path.includes('weekly-report')) {
      return 'WEEKLY REPORT'
    } else if (path.includes('settlement-report')) {
      return 'SETTLEMENT REPORT'
    } else if (path.includes('chip-summary')) {
      return 'CHIP SUMMARY'
    } else if (path.includes('balance-sheet')) {
      return 'BALANCE SHEET'
    } else if (path.includes('export')) {
      return 'EXPORT'
    } else if (path.includes('profile')) {
      return 'PROFILE'
    }
    else if (path.includes('settlement')) {
      return 'SETTLMENT'
    }
    
    return 'DASHBOARD'
  }

  return (
    <div className='page-title-section'>
      <h1 className='page-title-text'>{getPageTitle()}</h1>
    </div>
  )
}

export default PageTitle
