import { AnyAaaaRecord } from 'dns'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Balance } from '../models/Balance'
import { Match } from '../models/Match'
import { IUser, User } from '../models/User'
import { ApiController } from './ApiController'
import { FancyController } from './FancyController'
import { CasCasino } from '../models/CasCasino'
import UserSocket from '../sockets/user-socket'
import { CasinoBet } from '../models/CasinoBet'
const defaultRatio: any = {
  ownRatio: 100,
  allRatio: [
    {
      parent: Types.ObjectId('63382d9bfbb3a573110c1ba5'),
      ratio: 100,
    },
  ],
}
const allowedPartners = [
  "CASINO_PARTNER_1",
];
export class CasCallbackController extends ApiController {
  getbalance = async (req: Request, res: Response) => {
    try {
      const { userId, PartnerId } = req.body

      console.log(req.body, "req.body balance");
    
      // if (!allowedPartners.includes(PartnerId)) {
      //   return res.status(500).json({
      //     balance: 0,
      //     status: 'OP_FAILURE',
      //     bet_status: 'N'
      //   });
      // }
      const balance = await Balance.findOne({ userId: Types.ObjectId(userId) })
      if (balance) {
        return res.status(200).json({
          bet_status: "Y",
          balance: (balance?.balance - balance?.exposer),
          status: 'OP_SUCCESS',
        })
      } else {
        return res.status(500).json({
          bet_status: 'N',
          balance: 0,
          status: 'OP_FAILURE',
        })
      }
    } catch (e: any) {
      return res.status(500).json({
        bet_status: 'N',
        balance: 0,
        status: 'OP_FAILURE',
      })
    }
  }


  getBetrequest = async (req: Request, res: Response) => {
    console.log(req.body, "req.body betrequest")
    try {
      const { userId, token, PartnerId, transactionId, debitAmount, gameId, roundId, reqId } =
        req.body
      //  if (!allowedPartners.includes(PartnerId)) {
      //   return res.status(500).json({
      //     balance: 0,
      //     status: 'OP_FAILURE',
      //     bet_status: 'N'
      //   });
      // }
      if (!gameId || !roundId || isNaN(debitAmount) || !transactionId || !userId || !reqId) {
        return res.status(500).json({
          balance: 0,
          status: 'OP_INVALID_PARAMS',
        })
      }
      if (debitAmount < 0) {
        return res.status(500).json({
          balance: 0,
          status: 'OP_ERROR_NEGATIVE_DEBIT_AMOUNT',
        })
      }
      const fancyController = new FancyController()
      let balance: any = await Balance.findOne({ userId: Types.ObjectId(userId) })
      const user: any = await User.findOne({ _id: Types.ObjectId(userId) })
      if (balance && user._id) {
        const currentBalance = balance?.balance - balance?.exposer
        if (currentBalance < debitAmount) {
          return res.status(500).json({
            balance: 0,
            status: 'OP_INSUFFICIENT_FUNDS',
          })
        }
        const findGame: any = await CasCasino.findOne({ game_identifier: gameId })
        const checkBetExist = await CasinoBet.findOne({ providerTransactionId: transactionId })
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0') // Get hours (00-23)
        const minutes = String(now.getMinutes()).padStart(2, '0') // Get minutes (00-59)
        const seconds = String(now.getSeconds()).padStart(2, '0') // Get seconds (00-59)

        const timeString = `${hours}${minutes}${seconds}`
        if (!checkBetExist) {
          const parentinfo: any = await User.findOne({ _id: user?.parentId })
          const partnership: any =
            parentinfo != null && parentinfo.partnership != undefined
              ? parentinfo.partnership[4]
              : defaultRatio

          const obj = {
            userId: Types.ObjectId(userId),
            amount: debitAmount,
            gameCode: gameId,
            currency: 'HKD',
            round: roundId,
            providerCode: gameId,
            providerTransactionId: transactionId,
            status: 'completed',
            rolledBack: 'N',
            gameId: gameId,
            matchId: gameId,
            marketId: parseInt(`${gameId}${timeString}`),
            description: 'bet',
            requestUuid: reqId,
            transactionUuid: reqId,
            userName: user.username,
            parentStr: user.parentStr,
            ratioStr: partnership,
            gameName: findGame?.game_name || gameId,
          }
          const bet = new CasinoBet(obj)
          const sbet: any = await bet.save()
          if (sbet) {

            let userIdList: any = []
            const parentIdList: any = []
            const narrationN = `ICASINO-${findGame?.game_name || gameId} [${roundId}]`

            await fancyController.addprofitlosstouser({
              userId: Types.ObjectId(userId),
              bet_id: sbet._id,
              profit_loss: -debitAmount,
              matchId: gameId,
              narration: narrationN,
              sportsType: gameId,
              selectionId: parseInt(`${gameId}${timeString}`),
              sportId: 5001,
            })
            userIdList.push(Types.ObjectId(userId))
            partnership.allRatio.map((ItemParentStr: any) => {
              userIdList.push(Types.ObjectId(ItemParentStr.parent))
              parentIdList.push(ItemParentStr.parent)
            })
            const unique = [...new Set(userIdList)]
            if (unique.length > 0) {
              await fancyController.updateUserAccountStatementCasino(unique, parentIdList)
            }
          }
          balance = await Balance.findOne({ userId: Types.ObjectId(userId) })
          return res.status(200).json({
            balance: balance?.balance - balance?.exposer,
            status: 'OP_SUCCESS',
          })
        } else {
          if (checkBetExist) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_DUPLICATE_TRANSACTION',
            })
          } else {
            return res.status(500).json({
              balance: 0,
              status: 'OP_FAILURE_BET_EXIST',
            })
          }
        }
      } else {
        return res.status(500).json({
          balance: 0,
          status: 'OP_FAILURE',
        })
      }
    } catch (e: any) {
      return res.status(500).json({
        balance: 0,
        status: 'OP_FAILURE',
      })
    }
  }



  getCreditRequest = async (req: Request, res: Response) => {
    try {
      const { userId, token, PartnerId, transactionId, creditAmount, gameId, roundId, reqId } =
        req.body
      // if (!allowedPartners.includes(PartnerId)) {
      //     return res.status(500).json({
      //       balance: 0,
      //       status: 'OP_FAILURE',
      //       bet_status: 'N'
      //     });
      //   }
      if (!gameId || !roundId || isNaN(creditAmount) || !transactionId || !userId || !reqId) {
        return res.status(500).json({
          balance: 0,
          status: 'OP_INVALID_PARAMS',
        })
      }
      const fancyController = new FancyController()
      let balance: any = await Balance.findOne({ userId: Types.ObjectId(userId) })
      const user: any = await User.findOne({ _id: Types.ObjectId(userId) })
      if (balance && user._id) {
        const currentBalance = balance?.balance - balance?.exposer
        const findGame: any = await CasCasino.findOne({ game_identifier: gameId })
        const checkWinExist = await CasinoBet.findOne({
          requestUuid: reqId,
          description: 'win',
        })
        const checkRollback = await CasinoBet.findOne({
          providerTransactionId: transactionId,
          description: 'win',
          rolledBack: 'Y',
        })
        const checkBetExist = await CasinoBet.findOne({ providerTransactionId: transactionId })
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0') // Get hours (00-23)
        const minutes = String(now.getMinutes()).padStart(2, '0') // Get minutes (00-59)
        const seconds = String(now.getSeconds()).padStart(2, '0') // Get seconds (00-59)

        const timeString = `${hours}${minutes}${seconds}`
        if (checkBetExist && !checkWinExist && !checkRollback) {
          const parentinfo: any = await User.findOne({ _id: user?.parentId })
          const partnership: any =
            parentinfo != null && parentinfo.partnership != undefined
              ? parentinfo.partnership[4]
              : defaultRatio

          const obj = {
            userId: Types.ObjectId(userId),
            amount: creditAmount,
            gameCode: gameId,
            currency: 'HKD',
            round: roundId,
            providerCode: gameId,
            providerTransactionId: transactionId,
            status: 'completed',
            rolledBack: 'N',
            gameId: gameId,
            matchId: gameId,
            marketId: parseInt(`${gameId}${timeString}`),
            description: 'win',
            requestUuid: reqId,
            transactionUuid: reqId,
            userName: user.username,
            parentStr: user.parentStr,
            ratioStr: partnership,
            gameName: findGame?.game_name || gameId,
          }
          const bet = new CasinoBet(obj)
          const sbet: any = await bet.save()
          if (sbet) {
            let userIdList: any = []
            const parentIdList: any = []
            const narrationN = `ICASINO-${findGame?.game_name || gameId} [${roundId}]`

            await fancyController.addprofitlosstouser({
              userId: Types.ObjectId(userId),
              bet_id: sbet._id,
              profit_loss: creditAmount,
              matchId: gameId,
              narration: narrationN,
              sportsType: gameId,
              selectionId: parseInt(`${gameId}${timeString}`),
              sportId: 5001,
            })
            userIdList.push(Types.ObjectId(userId))
            partnership.allRatio.map((ItemParentStr: any) => {
              userIdList.push(Types.ObjectId(ItemParentStr.parent))
              parentIdList.push(ItemParentStr.parent)
            })
            const unique = [...new Set(userIdList)]
            if (unique.length > 0) {
              await fancyController.updateUserAccountStatementCasino(unique, parentIdList)
            }
          }
          balance = await Balance.findOne({ userId: Types.ObjectId(userId) })
          return res.status(200).json({
            balance: balance?.balance - balance?.exposer,
            status: 'OP_SUCCESS',
          })
        } else {


          if ((!checkWinExist && checkRollback) || (checkWinExist && checkRollback)) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_ERROR_TRANSACTION_INVALID',
            })
          }
          if (checkWinExist) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_DUPLICATE_TRANSACTION',
            })
          } else if (!checkBetExist) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_TRANSACTION_NOT_FOUND',
            })
          } else {
            return res.status(500).json({
              balance: 0,
              status: 'OP_FAILURE_BET_EXIST',
            })
          }
        }
      } else {
        return res.status(500).json({
          balance: 0,
          status: 'OP_FAILURE',
        })
      }
    } catch (e: any) {
      return res.status(500).json({
        balance: 0,
        status: 'OP_FAILURE',
      })
    }
  }


  getrollback = async (req: Request, res: Response) => {
    try {
      const { userId, token, PartnerId, transactionId, rollbackAmount, gameId, roundId, reqId } =
        req.body
    //  if (!allowedPartners.includes(PartnerId)) {
    //     return res.status(500).json({
    //       balance: 0,
    //       status: 'OP_FAILURE',
    //       bet_status: 'N'
    //     });
    //   }
      if (!gameId || !roundId || !rollbackAmount || !transactionId || !userId || !reqId) {
        return res.status(500).json({
          balance: 0,
          status: 'OP_INVALID_PARAMS',
        })
      }
      const fancyController = new FancyController()
      let balance: any = await Balance.findOne({ userId: Types.ObjectId(userId) })
      const user: any = await User.findOne({ _id: Types.ObjectId(userId) })
      if (balance && user._id) {
        const currentBalance = balance?.balance - balance?.exposer
        const findGame: any = await CasCasino.findOne({ game_identifier: gameId })
        const checkWinExist = await CasinoBet.findOne({
          providerTransactionId: transactionId,
          description: 'win',
        })
        const checkRollback = await CasinoBet.findOne({
          providerTransactionId: transactionId,
          description: 'win',
          rolledBack: 'Y',
        })
        const checkBetExist = await CasinoBet.findOne({ providerTransactionId: transactionId })
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0') // Get hours (00-23)
        const minutes = String(now.getMinutes()).padStart(2, '0') // Get minutes (00-59)
        const seconds = String(now.getSeconds()).padStart(2, '0') // Get seconds (00-59)

        const timeString = `${hours}${minutes}${seconds}`

        if (checkBetExist && !checkWinExist && !checkRollback) {
          const parentinfo: any = await User.findOne({ _id: user?.parentId })
          const partnership: any =
            parentinfo != null && parentinfo.partnership != undefined
              ? parentinfo.partnership[4]
              : defaultRatio

          const obj = {
            userId: Types.ObjectId(userId),
            amount: rollbackAmount,
            gameCode: gameId,
            currency: 'HKD',
            round: roundId,
            providerCode: gameId,
            providerTransactionId: transactionId,
            status: 'completed',
            matchId: gameId,
            rolledBack: 'Y',
            gameId: gameId,
            marketId: parseInt(`${gameId}${timeString}`),
            description: 'win',
            requestUuid: reqId,
            transactionUuid: reqId,
            userName: user.username,
            parentStr: user.parentStr,
            ratioStr: partnership,
            gameName: findGame?.game_name || gameId,
          }
          const bet = new CasinoBet(obj)
          const sbet: any = await bet.save()
          if (sbet) {
            let userIdList: any = []
            const parentIdList: any = []
            const narrationN = `ICASINO-${findGame?.game_name || gameId} [${roundId}]`
            await fancyController.addprofitlosstouser({
              userId: Types.ObjectId(userId),
              bet_id: sbet._id,
              profit_loss: rollbackAmount,
              matchId: gameId,
              narration: narrationN,
              sportsType: gameId,
              selectionId: parseInt(`${gameId}${timeString}`),
              sportId: 5001,
            })
            userIdList.push(Types.ObjectId(userId))
            partnership.allRatio.map((ItemParentStr: any) => {
              userIdList.push(Types.ObjectId(ItemParentStr.parent))
              parentIdList.push(ItemParentStr.parent)
            })
            const unique = [...new Set(userIdList)]
            if (unique.length > 0) {
              await fancyController.updateUserAccountStatementCasino(unique, parentIdList)
            }
          }
          balance = await Balance.findOne({ userId: Types.ObjectId(userId) })
          return res.status(200).json({
            balance: balance?.balance - balance?.exposer,
            status: 'OP_SUCCESS',
          })
        } else {
          if (!checkBetExist) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_TRANSACTION_NOT_FOUND',
            })
          } else if (checkRollback) {
            return res.status(500).json({
              balance: 0,
              status: 'OP_DUPLICATE_TRANSACTION',
            })
          } else {
            return res.status(500).json({
              balance: 0,
              status: 'OP_FAILURE_BET_EXIST',
            })
          }
        }
      } else {
        return res.status(500).json({
          balance: 0,
          status: 'OP_FAILURE',
        })
      }
    } catch (e: any) {
      return res.status(500).json({
        balance: 0,
        status: 'OP_FAILURE',
      })
    }
  }
}