import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { BetLock } from '../models/BetLock'
import { Match } from '../models/Match'
import { RoleType } from '../models/Role'
import { User } from '../models/User'
import { ApiController } from './ApiController'
import { Balance } from '../models/Balance'
import { CasCasino } from '../models/CasCasino'
import axios from 'axios'

export class BetLockController extends ApiController {
  betLock = async (req: Request, res: Response) => {
    try {
      const { match, type, status, userId } = req.body
      const user: any = req.user
      const types: any = { M: 'betFair', B: 'book', F: 'fancy' }
      const isMatch = await Match.findOne({ matchId: match.matchId }).count()
      if (isMatch && !userId) {
        const updateField = types[type]
        const updateQuery = {
          [updateField]: status,
          matchId: match.matchId,
          parentId: Types.ObjectId(user?._id),
          sportId: match.sportId,
        }
        await BetLock.findOneAndUpdate(
          { matchId: match.matchId, parentId: Types.ObjectId(user?._id) },
          { $set: updateQuery },
          { upsert: true, new: true },
        )

        return this.success(res, req.body)
      } else if (isMatch && userId) {
        const updateField = types[type]
        const updateQuery = {
          [updateField]: status,
          matchId: match.matchId,
          parentId: Types.ObjectId(user?._id),
          sportId: match.sportId,
          userId: Types.ObjectId(userId),
        }
        await BetLock.findOneAndUpdate(
          {
            matchId: match.matchId,
            parentId: Types.ObjectId(user?._id),
            userId: Types.ObjectId(userId),
          },
          { $set: updateQuery },
          { upsert: true, new: true },
        )

        return this.success(res, req.body)
      }
      return this.fail(res, 'Match not found')
    } catch (e) {
      const err = e as Error
      return this.fail(res, err.message)
    }
  }

  getChildUserList = async (req: Request, res: Response) => {
    try {
      const currentUser: any = req.user
      const { username, matchId }: any = req.query
      const regex = username ? new RegExp(username, 'i') : ''
      const users = await User.paginate(
        {
          username: { $regex: regex },
          parentStr: { $elemMatch: { $eq: Types.ObjectId(currentUser._id) } },
          role: RoleType.user,
        },
        { select: { _id: 1, username: 1 }, lean: true },
      )
      const searchUsers = users.docs.map((user) => {
        return Types.ObjectId(user._id)
      })

      const betLockUsers = await BetLock.find({
        userId: { $in: searchUsers },
        parentId: Types.ObjectId(currentUser._id),
        matchId,
      }).lean()

      const usersWithBetLock: any = users.docs.map((user) => {
        const lockUser: any = betLockUsers.find((u: any) => u.userId.equals(user._id))
        if (lockUser && lockUser._id) delete lockUser._id
        return { ...user, ...lockUser }
      })
      users.docs = usersWithBetLock

      return this.success(res, users)
    } catch (e) {
      const err = e as Error
      return this.fail(res, err.message)
    }
  }

  usersLock = async (req: Request, res: Response) => {
    try {
      const { ids, lock, type } = req.body
      const user: any = req.user
      switch (type) {
        case 'betLock':
          await User.updateMany(
            {
              _id: { $in: ids },
              parentStr: { $elemMatch: { $eq: Types.ObjectId(user._id) } },
              role: { $ne: RoleType.admin },
            },
            { $set: { betLock: lock } },
          )
          break
        case 'loginLock':
          await User.updateMany(
            {
              _id: { $in: ids },
              parentStr: { $elemMatch: { $eq: Types.ObjectId(user._id) } },
              role: { $ne: RoleType.admin },
            },
            { $set: { isLogin: lock } },
          )
          break
      }
      this.success(res, { success: true }, 'Actions succesfully saved')
    } catch (e: unknown) {
      const err = e as Error
      this.fail(res, err.message)
    }
  }


  getCasPlayUrl = async (req: Request, res: Response) => {
      const { lobby_url, isMobile, ipAddress } = req.body
      const userInfo: any = req.user
      // if (userInfo?.isDemo) {
      //   return this.fail(res, "Sorry for inconvience! USE Real ID to play all these games.")
      // }
      const userInfoLatest = await User.findOne({ _id: userInfo?._id })
  
  
     
        const platformId = "cmfl6rytx0000pn0ifooykw0m"
        const returnurl="https://betbhai365.cloud/not-play"
      
      // if (!userInfoLatest?.parentStr?.some((id: string) => collectUserId.includes(id))) {
      //   this.fail(res, "Game Locked");
      //   return;
      // }
      const balance = await Balance.findOne({ userId: userInfo._id }, { balance: 1, exposer: 1, casinoexposer: 1 })
      const finalBalance = (balance?.balance || 0) - (balance?.exposer || 0) - (balance?.casinoexposer || 0)
      const gameInfo: any = await CasCasino.findOne({
        game_identifier: lobby_url,
      })
      if (true) {
        const payload = {
          user: userInfo.username,
          platformId: platformId,
          platform: isMobile ? 'GPL_MOBILE' : "GPL_DESKTOP",
          lobby: false,
          lang: 'en',
          clientIp: ipAddress,
          // gameId: parseInt(gameInfo?.game_identifier) || parseInt(lobby_url),
                    gameId: parseInt(lobby_url),

          currency: 'INR',
          userId: userInfo._id,
          username: userInfo.username,
          balance: finalBalance,
          redirectUrl:returnurl
        }
        console.log(payload,"payload for cas url")
        return axios
          .post('https://daimondexchang99.com/api/get-play-bhi', payload)
          .then((resData) => {
            const data = resData?.data
            console.log(data,"data from cas api")
            if (data?.message != "failed") {
              console.log(resData?.data,"resdata from cas api")
              this.success(
                res,
                { gameInfo: gameInfo, payload: payload, url: resData?.data?.data?.url },
                'Data Found',
              )
  
            } else {
              this.fail(res, "Game Not Found")
  
            }
          })
      } else {
        this.fail(res, "Game Not Found")
      }
    }

   




}
