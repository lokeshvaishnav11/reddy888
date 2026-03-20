"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasCallbackController = void 0;
const mongoose_1 = require("mongoose");
const Balance_1 = require("../models/Balance");
const User_1 = require("../models/User");
const ApiController_1 = require("./ApiController");
const FancyController_1 = require("./FancyController");
const CasCasino_1 = require("../models/CasCasino");
const CasinoBet_1 = require("../models/CasinoBet");
const defaultRatio = {
    ownRatio: 100,
    allRatio: [
        {
            parent: mongoose_1.Types.ObjectId('63382d9bfbb3a573110c1ba5'),
            ratio: 100,
        },
    ],
};
const allowedPartners = [
    "CASINO_PARTNER_1",
];
class CasCallbackController extends ApiController_1.ApiController {
    constructor() {
        super(...arguments);
        this.getbalance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, PartnerId } = req.body;
                console.log(req.body, "req.body balance");
                // if (!allowedPartners.includes(PartnerId)) {
                //   return res.status(500).json({
                //     balance: 0,
                //     status: 'OP_FAILURE',
                //     bet_status: 'N'
                //   });
                // }
                const balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                if (balance) {
                    return res.status(200).json({
                        bet_status: "Y",
                        balance: ((balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer)),
                        status: 'OP_SUCCESS',
                    });
                }
                else {
                    return res.status(500).json({
                        bet_status: 'N',
                        balance: 0,
                        status: 'OP_FAILURE',
                    });
                }
            }
            catch (e) {
                return res.status(500).json({
                    bet_status: 'N',
                    balance: 0,
                    status: 'OP_FAILURE',
                });
            }
        });
        this.getBetrequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body, "req.body betrequest");
            try {
                const { userId, token, PartnerId, transactionId, debitAmount, gameId, roundId, reqId } = req.body;
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
                    });
                }
                if (debitAmount < 0) {
                    return res.status(500).json({
                        balance: 0,
                        status: 'OP_ERROR_NEGATIVE_DEBIT_AMOUNT',
                    });
                }
                const fancyController = new FancyController_1.FancyController();
                let balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                const user = yield User_1.User.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
                if (balance && user._id) {
                    const currentBalance = (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer);
                    if (currentBalance < debitAmount) {
                        return res.status(500).json({
                            balance: 0,
                            status: 'OP_INSUFFICIENT_FUNDS',
                        });
                    }
                    const findGame = yield CasCasino_1.CasCasino.findOne({ game_identifier: gameId });
                    const checkBetExist = yield CasinoBet_1.CasinoBet.findOne({ providerTransactionId: transactionId });
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0'); // Get hours (00-23)
                    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes (00-59)
                    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds (00-59)
                    const timeString = `${hours}${minutes}${seconds}`;
                    if (!checkBetExist) {
                        const parentinfo = yield User_1.User.findOne({ _id: user === null || user === void 0 ? void 0 : user.parentId });
                        const partnership = parentinfo != null && parentinfo.partnership != undefined
                            ? parentinfo.partnership[4]
                            : defaultRatio;
                        const obj = {
                            userId: mongoose_1.Types.ObjectId(userId),
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
                            gameName: (findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId,
                        };
                        const bet = new CasinoBet_1.CasinoBet(obj);
                        const sbet = yield bet.save();
                        if (sbet) {
                            let userIdList = [];
                            const parentIdList = [];
                            const narrationN = `ICASINO-${(findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId} [${roundId}]`;
                            yield fancyController.addprofitlosstouser({
                                userId: mongoose_1.Types.ObjectId(userId),
                                bet_id: sbet._id,
                                profit_loss: -debitAmount,
                                matchId: gameId,
                                narration: narrationN,
                                sportsType: gameId,
                                selectionId: parseInt(`${gameId}${timeString}`),
                                sportId: 5001,
                            });
                            userIdList.push(mongoose_1.Types.ObjectId(userId));
                            partnership.allRatio.map((ItemParentStr) => {
                                userIdList.push(mongoose_1.Types.ObjectId(ItemParentStr.parent));
                                parentIdList.push(ItemParentStr.parent);
                            });
                            const unique = [...new Set(userIdList)];
                            if (unique.length > 0) {
                                yield fancyController.updateUserAccountStatementCasino(unique, parentIdList);
                            }
                        }
                        balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                        return res.status(200).json({
                            balance: (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer),
                            status: 'OP_SUCCESS',
                        });
                    }
                    else {
                        if (checkBetExist) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_DUPLICATE_TRANSACTION',
                            });
                        }
                        else {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_FAILURE_BET_EXIST',
                            });
                        }
                    }
                }
                else {
                    return res.status(500).json({
                        balance: 0,
                        status: 'OP_FAILURE',
                    });
                }
            }
            catch (e) {
                return res.status(500).json({
                    balance: 0,
                    status: 'OP_FAILURE',
                });
            }
        });
        this.getCreditRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, token, PartnerId, transactionId, creditAmount, gameId, roundId, reqId } = req.body;
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
                    });
                }
                const fancyController = new FancyController_1.FancyController();
                let balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                const user = yield User_1.User.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
                if (balance && user._id) {
                    const currentBalance = (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer);
                    const findGame = yield CasCasino_1.CasCasino.findOne({ game_identifier: gameId });
                    const checkWinExist = yield CasinoBet_1.CasinoBet.findOne({
                        requestUuid: reqId,
                        description: 'win',
                    });
                    const checkRollback = yield CasinoBet_1.CasinoBet.findOne({
                        providerTransactionId: transactionId,
                        description: 'win',
                        rolledBack: 'Y',
                    });
                    const checkBetExist = yield CasinoBet_1.CasinoBet.findOne({ providerTransactionId: transactionId });
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0'); // Get hours (00-23)
                    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes (00-59)
                    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds (00-59)
                    const timeString = `${hours}${minutes}${seconds}`;
                    if (checkBetExist && !checkWinExist && !checkRollback) {
                        const parentinfo = yield User_1.User.findOne({ _id: user === null || user === void 0 ? void 0 : user.parentId });
                        const partnership = parentinfo != null && parentinfo.partnership != undefined
                            ? parentinfo.partnership[4]
                            : defaultRatio;
                        const obj = {
                            userId: mongoose_1.Types.ObjectId(userId),
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
                            gameName: (findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId,
                        };
                        const bet = new CasinoBet_1.CasinoBet(obj);
                        const sbet = yield bet.save();
                        if (sbet) {
                            let userIdList = [];
                            const parentIdList = [];
                            const narrationN = `ICASINO-${(findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId} [${roundId}]`;
                            yield fancyController.addprofitlosstouser({
                                userId: mongoose_1.Types.ObjectId(userId),
                                bet_id: sbet._id,
                                profit_loss: creditAmount,
                                matchId: gameId,
                                narration: narrationN,
                                sportsType: gameId,
                                selectionId: parseInt(`${gameId}${timeString}`),
                                sportId: 5001,
                            });
                            userIdList.push(mongoose_1.Types.ObjectId(userId));
                            partnership.allRatio.map((ItemParentStr) => {
                                userIdList.push(mongoose_1.Types.ObjectId(ItemParentStr.parent));
                                parentIdList.push(ItemParentStr.parent);
                            });
                            const unique = [...new Set(userIdList)];
                            if (unique.length > 0) {
                                yield fancyController.updateUserAccountStatementCasino(unique, parentIdList);
                            }
                        }
                        balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                        return res.status(200).json({
                            balance: (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer),
                            status: 'OP_SUCCESS',
                        });
                    }
                    else {
                        if ((!checkWinExist && checkRollback) || (checkWinExist && checkRollback)) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_ERROR_TRANSACTION_INVALID',
                            });
                        }
                        if (checkWinExist) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_DUPLICATE_TRANSACTION',
                            });
                        }
                        else if (!checkBetExist) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_TRANSACTION_NOT_FOUND',
                            });
                        }
                        else {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_FAILURE_BET_EXIST',
                            });
                        }
                    }
                }
                else {
                    return res.status(500).json({
                        balance: 0,
                        status: 'OP_FAILURE',
                    });
                }
            }
            catch (e) {
                return res.status(500).json({
                    balance: 0,
                    status: 'OP_FAILURE',
                });
            }
        });
        this.getrollback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, token, PartnerId, transactionId, rollbackAmount, gameId, roundId, reqId } = req.body;
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
                    });
                }
                const fancyController = new FancyController_1.FancyController();
                let balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                const user = yield User_1.User.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
                if (balance && user._id) {
                    const currentBalance = (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer);
                    const findGame = yield CasCasino_1.CasCasino.findOne({ game_identifier: gameId });
                    const checkWinExist = yield CasinoBet_1.CasinoBet.findOne({
                        providerTransactionId: transactionId,
                        description: 'win',
                    });
                    const checkRollback = yield CasinoBet_1.CasinoBet.findOne({
                        providerTransactionId: transactionId,
                        description: 'win',
                        rolledBack: 'Y',
                    });
                    const checkBetExist = yield CasinoBet_1.CasinoBet.findOne({ providerTransactionId: transactionId });
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0'); // Get hours (00-23)
                    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes (00-59)
                    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds (00-59)
                    const timeString = `${hours}${minutes}${seconds}`;
                    if (checkBetExist && !checkWinExist && !checkRollback) {
                        const parentinfo = yield User_1.User.findOne({ _id: user === null || user === void 0 ? void 0 : user.parentId });
                        const partnership = parentinfo != null && parentinfo.partnership != undefined
                            ? parentinfo.partnership[4]
                            : defaultRatio;
                        const obj = {
                            userId: mongoose_1.Types.ObjectId(userId),
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
                            gameName: (findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId,
                        };
                        const bet = new CasinoBet_1.CasinoBet(obj);
                        const sbet = yield bet.save();
                        if (sbet) {
                            let userIdList = [];
                            const parentIdList = [];
                            const narrationN = `ICASINO-${(findGame === null || findGame === void 0 ? void 0 : findGame.game_name) || gameId} [${roundId}]`;
                            yield fancyController.addprofitlosstouser({
                                userId: mongoose_1.Types.ObjectId(userId),
                                bet_id: sbet._id,
                                profit_loss: rollbackAmount,
                                matchId: gameId,
                                narration: narrationN,
                                sportsType: gameId,
                                selectionId: parseInt(`${gameId}${timeString}`),
                                sportId: 5001,
                            });
                            userIdList.push(mongoose_1.Types.ObjectId(userId));
                            partnership.allRatio.map((ItemParentStr) => {
                                userIdList.push(mongoose_1.Types.ObjectId(ItemParentStr.parent));
                                parentIdList.push(ItemParentStr.parent);
                            });
                            const unique = [...new Set(userIdList)];
                            if (unique.length > 0) {
                                yield fancyController.updateUserAccountStatementCasino(unique, parentIdList);
                            }
                        }
                        balance = yield Balance_1.Balance.findOne({ userId: mongoose_1.Types.ObjectId(userId) });
                        return res.status(200).json({
                            balance: (balance === null || balance === void 0 ? void 0 : balance.balance) - (balance === null || balance === void 0 ? void 0 : balance.exposer),
                            status: 'OP_SUCCESS',
                        });
                    }
                    else {
                        if (!checkBetExist) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_TRANSACTION_NOT_FOUND',
                            });
                        }
                        else if (checkRollback) {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_DUPLICATE_TRANSACTION',
                            });
                        }
                        else {
                            return res.status(500).json({
                                balance: 0,
                                status: 'OP_FAILURE_BET_EXIST',
                            });
                        }
                    }
                }
                else {
                    return res.status(500).json({
                        balance: 0,
                        status: 'OP_FAILURE',
                    });
                }
            }
            catch (e) {
                return res.status(500).json({
                    balance: 0,
                    status: 'OP_FAILURE',
                });
            }
        });
    }
}
exports.CasCallbackController = CasCallbackController;
//# sourceMappingURL=Icasino.js.map