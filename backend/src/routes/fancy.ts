import { Router } from 'express'
import { FancyController } from '../controllers/FancyController'
import { BetLockController } from '../controllers/BetLockController'
import Http from '../middlewares/Http'
import Passport from '../passport/Passport'

export class FancyRoutes {
  public router: Router
  public FancyController: FancyController = new FancyController()
  public BetLockController: BetLockController = new BetLockController() 
  // casCallBackController: any
  // BetLockController: any

  constructor() {
    this.router = Router()
    this.routes()
  }

  routes() {
    // this.router.get(
    //   '/active-fancies',
     
    //   this.FancyController.activeFancies,
    // )

    this.router.get(
      '/suspend-fancy',
      Passport.authenticateJWT,
      Http.adminUserRequest,
      this.FancyController.suspendFancy,
    )
    // this.router.get(
    //   '/result-fancy',
     
    //   this.FancyController.declarefancyresult,
    // )

    this.router.get(
      '/result-market',
      Passport.authenticateJWT,
      Http.adminUserRequest,
      this.FancyController.declaremarketresult,
    )

    this.router.get(
      '/rollback-result-market',
      Passport.authenticateJWT,
      Http.adminUserRequest,
      this.FancyController.rollbackmarketresult,
    )
    this.router.get(
      '/rollback-result-market-wise',
      Passport.authenticateJWT,
      Http.adminUserRequest,
      this.FancyController.rollbackmarketwiseresult,
    )

    this.router.post(
      '/get-cas-casino-play-url',
      Passport.authenticateJWT,
      this.FancyController.getCasPlayUrl,
    )

    this.router.get(
      '/fancy-result-rollback',
      Passport.authenticateJWT,
      Http.adminUserRequest,
      this.FancyController.rollbackfancyresult,
    )

    this.router.post(
      '/check-user-pnl',
      Passport.authenticateJWT,
      this.FancyController.apiupdateUserBal,
    )

    this.router.post("/icasino-url",Passport.authenticateJWT, this.BetLockController.getCasPlayUrl);

    // this.router.get(
    //   "/change-status-Fancy",
    //   Passport.authenticateJWT,
    //   Http.adminUserRequest,
    //   this.FancyController.FancyActiveInactive
    // );

    // this.router.get(
    //   "/delete-Fancy",
    //   Passport.authenticateJWT,
    //   Http.adminUserRequest,
    //   this.FancyController.FancyDelete
    // );
  }
}
