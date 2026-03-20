import { Request, Response } from 'express'
import { BankAccount } from '../models/BankAccount'
import { IUserModel, User } from '../models/User'
import { ApiController } from './ApiController'
import { DepositWithdraw, IDepositWithdrawModel } from '../models/DepositWithdraw'
import { Types } from 'mongoose'
import { RoleType } from '../models/Role'
import { AccountController } from './AccountController'
import { Balance } from '../models/Balance'
import { Upi } from '../models/Upi'
import { AccoutStatement, ChipsType } from '../models/AccountStatement'
import { TxnType } from '../models/UserChip'

export class DepositWithdrawController extends ApiController {
  addBankAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const bank = await BankAccount.create({ userId: user._id, ...req.body })

      return this.success(res, { success: true, bank }, 'Bank account added successfully')
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  addUpi = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const upi = await Upi.create({ userId: user._id, ...req.body })

      return this.success(res, { success: true, upi }, 'Upi account added successfully')
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  getBankAndUpiAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const upi = await Upi.find({ userId: user._id }).exec()
      const bank = await BankAccount.find({ userId: user._id }).exec()

      return this.success(res, { upi, bank })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  deleteBankAndUpiAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      if (req.body.type === 'upi')
        await Upi.deleteOne({ _id: req.body.id, userId: user._id }).exec()
      else await BankAccount.deleteOne({ _id: req.body.id, userId: user._id }).exec()

      return this.success(res, { success: true })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  //old adddepostiwithdraw


  async getUserBalance(userId: string) {
    const ac = await AccoutStatement.aggregate([
      { $match: { userId: Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ])
    const Balance_ = ac && ac.length > 0 ? ac[0].totalAmount : 0
    return Balance_
  }

  calculatepnl = async (userId: any, type: string = 'W') => {
    // const parent = await User.findOne(
    //   {
    //     parentStr: { $elemMatch: { $eq: Types.ObjectId(userId) } },
    //     role: RoleType.user,
    //   },
    //   { _id: 1 },
    // )
    //   .distinct('_id')
    //   .lean()

    // if (user.role == RoleType.user) {
    //   parent.push(userId)
    // }
    // const pnl = await AccoutStatement.aggregate([
    //   { $match: { userId: { $in: parent }, betId: { $ne: null } } },
    //   {
    //     $group: {
    //       _id: null,
    //       totalAmount: { $sum: '$amount' },
    //     },
    //   },
    // ]);
    const bal = await Balance.findOne({ userId: userId }).select({ profitLoss: 1 })

    // const withdrawlsum = await AccoutStatement.aggregate([
    //   {
    //     $match: {
    //       userId: Types.ObjectId(userId),
    //       betId: { $eq: null },
    //       txnId: { $eq: null },
    //       txnType: TxnType.dr,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalAmount: { $sum: '$amount' },
    //     },
    //   },
    // ])
    // const withdAmt = withdrawlsum && withdrawlsum.length > 0 ? withdrawlsum[0].totalAmount : 0
    // //const pnl_ = pnl && pnl.length > 0 ? pnl[0].totalAmount + withdAmt : 0
    // const pnl_ = bal?.profitLoss ? bal?.profitLoss + withdAmt : 0
    return bal?.profitLoss ? bal?.profitLoss : 0
  }


  async getUserDepWithBalance(userId: string) {
    const ac = await AccoutStatement.aggregate([
      { $match: { userId: Types.ObjectId(userId), type: ChipsType.fc } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ])
    const Balance_ = ac && ac.length > 0 ? ac[0].totalAmount : 0
    return Balance_
  }


  addDepositWithdrawOldddd = async (req: Request, res: Response): Promise<any> => {
    try {
      let user = req.user as IUserModel
      user = await User.findOne({ _id: Types.ObjectId(user?._id)})
      const filePath = req.file ? req.file.path : null
      const { type, utrno } = req.body
      const parentUsers = [...user.parentStr!]
      const checkWithdraw = await DepositWithdraw.findOne({ userId: user._id, status: 'pending', type: type })
      if (checkWithdraw) throw Error(`You have already created ${type} request!`)

      const getBalWithExp: any = await Balance.findOne({ userId: user._id })
      if (getBalWithExp.balance - getBalWithExp.exposer < req.body.amount && type == "withdraw") {
        throw Error('Insufficient amount to withdrawal, Due to pending exposure or less amount')
      }

      await DepositWithdraw.create({
        userId: user._id,
        parentId: parentUsers?.pop(),
        parentStr: user.parentStr,
        username: user.username,
        ...req.body,
        imageUrl: filePath,
        orderId: Date.now(),
        utrno:utrno
      })

      return this.success(
        res,
        { success: true },
        `${req.body.type === 'deposit' ? 'Deposit' : 'Withdraw'} amount added successfully`,
      )
    } catch (e: any) {
      return this.fail(res, e.message)
    }
  }



  addDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      let user = req.user as IUserModel
      user = await User.findOne({ _id: Types.ObjectId(user?._id)})
      const filePath = req.file ? req.file.path : null
      const { type, utrno ,amount ,narration } = req.body
      const amt = Number(amount)
      const parentUsers = [...user.parentStr!]
      const checkWithdraw = await DepositWithdraw.findOne({ userId: user._id, status: 'pending', type: type })
      if (checkWithdraw) throw Error(`You have already created ${type} request!`)

      const getBalWithExp: any = await Balance.findOne({ userId: user._id })
      if (getBalWithExp.balance - getBalWithExp.exposer < req.body.amount && type == "withdraw") {
        throw Error('Insufficient amount to withdrawal, Due to pending exposure or less amount')
      }



      if (type === 'withdraw') {
        // STEP 1: Deduct immediately
        const prevBal = await this.getUserBalance(user._id.toString())
        const closeBal = prevBal - amt
  
        // Add accounting entry
        const accStmt = new AccoutStatement({
          userId: user._id,
          narration: narration || 'Withdrawal request (on hold)',
          amount: -amt,
          type: ChipsType.fc,
          txnType: TxnType.dr,
          openBal: prevBal,
          closeBal: closeBal,
          txnBy: user.username,
        })
        await accStmt.save()
  
        // Update Balance
        const pnl = await this.calculatepnl(user._id, 'W')
        const mainBal = await this.getUserDepWithBalance(user._id)
        await Balance.findOneAndUpdate(
          { userId: user._id },
          {
            balance: closeBal,
            profitLoss: pnl - amt,
            mainBalance: mainBal,
          },
          { new: true, upsert: true },
        )
      }

      // STEP 2: Create the withdraw/deposit request
    await DepositWithdraw.create({
      userId: user._id,
      parentId: parentUsers?.pop(),
      parentStr: user.parentStr,
      username: user.username,
      ...req.body,
      imageUrl: filePath,
      orderId: Date.now(),
      utrno: utrno,
      status: 'pending',
    })

      return this.success(
        res,
        { success: true },
        `${req.body.type === 'deposit' ? 'Deposit' : 'Withdraw'} amount added successfully`,
      )
    } catch (e: any) {
      return this.fail(res, e.message)
    }
  }




  getDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      let { startDate, endDate, username, reportType } = req.body
      const user = req.user as IUserModel
      let query: any = {
        userId: Types.ObjectId(user._id),
        type: req.body.type,
      }
      if (user.role !== RoleType.user) {
        delete query.userId
        query.parentStr = { $elemMatch: { $eq: Types.ObjectId(user._id) } }
      }

      if (username) query.username = username

      if (startDate) {
        query.createdAt = {
          $gte: startDate.includes('T')
            ? `${startDate.replace('T', ' ')}:00`
            : `${startDate} 00:00:00`,
        }
      }
      if (endDate) {
        query.createdAt = {
          ...query.createdAt,
          $lte: endDate.includes('T') ? `${endDate.replace('T', ' ')}:00` : `${endDate} 23:59:59`,
        }
      }

      if (reportType && reportType != 'ALL') {
        query.status = reportType
      }
      console.log('query', query)
      const data = await DepositWithdraw.find(query).exec()

      return this.success(res, data)
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  ////oldddwala
  updateDepositWithdrawoldddd = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel
      const { id, status, ...rest } = req.body
      const txn: any = await DepositWithdraw.findOne({
        _id: Types.ObjectId(id),
        status: 'pending',
      })
      if (!txn) return this.fail(res, 'Entry not found')
      txn.remark = req.body.narration
      if (status === 'approved') {
        req.body.amount = txn.amount
        req.body.parentUserId = txn.parentId
        req.body.userId = txn.userId

        const { userAccBal, pnlData } = await new AccountController().depositWithdraw(
          req,
          req?.user as IUserModel,
        )
        const successMsg = 'Transaction Approved'

        if (successMsg) {
          txn.status = status
        }
        await txn.save()

        return this.success(res, { success: true }, successMsg)
      } else {
        const successMsg = 'Transaction rejected'
        txn.status = 'rejected'
        await txn.save()

        return this.success(res, { success: true }, successMsg)
      }
      // await DepositWithdraw.findOneAndUpdate({ _id: id }, { ...rest })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }


  updateDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel
      const { id, status, ...rest  } = req.body
      const txn: any = await DepositWithdraw.findOne({
        _id: Types.ObjectId(id),
        status: 'pending',
      })
      if (!txn) return this.fail(res, 'Entry not found')
      txn.remark = req.body.narration
      if (status === 'approved') {
      // ✅ Already deducted at request time
      txn.status = 'approved'
      txn.remark = req.body.narration || 'Withdrawal approved'
      await txn.save()

      return this.success(res, { success: true }, 'Withdrawal Approved')
      } else if (status === 'rejected') {

         // ❌ Need to reverse deduction
      const userId = txn.userId
      const amt = txn.amount
      const prevBal = await this.getUserBalance(userId.toString())
      const closeBal = prevBal + amt

      // Reverse accounting entry
      const accStmt = new AccoutStatement({
        userId,
        narration: req.body.narration || 'Withdrawal rejected (amount refunded)',
        amount: amt,
        type: ChipsType.fc,
        txnType: TxnType.cr,
        openBal: prevBal,
        closeBal,
        txnBy: 'System',
      })
      await accStmt.save()

      // Update balance
      const pnl = await this.calculatepnl(userId, 'D')
      const mainBal = await this.getUserDepWithBalance(userId)
      await Balance.findOneAndUpdate(
        { userId },
        { balance: closeBal, profitLoss: pnl + amt, mainBalance: mainBal },
        { new: true, upsert: true },
      )

      txn.status = 'rejected'
      txn.remark = req.body.narration || 'Withdrawal rejected'
      await txn.save()

      return this.success(res, { success: true }, 'Withdrawal Rejected and amount refunded')
    } else {
      return this.fail(res, 'Invalid status')
    }

      // await DepositWithdraw.findOneAndUpdate({ _id: id }, { ...rest })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }


}
