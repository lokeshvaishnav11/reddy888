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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositWithdrawController = void 0;
const BankAccount_1 = require("../models/BankAccount");
const User_1 = require("../models/User");
const ApiController_1 = require("./ApiController");
const DepositWithdraw_1 = require("../models/DepositWithdraw");
const mongoose_1 = require("mongoose");
const Role_1 = require("../models/Role");
const AccountController_1 = require("./AccountController");
const Balance_1 = require("../models/Balance");
const Upi_1 = require("../models/Upi");
const AccountStatement_1 = require("../models/AccountStatement");
const UserChip_1 = require("../models/UserChip");
class DepositWithdrawController extends ApiController_1.ApiController {
    constructor() {
        super(...arguments);
        this.addBankAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const bank = yield BankAccount_1.BankAccount.create(Object.assign({ userId: user._id }, req.body));
                return this.success(res, { success: true, bank }, 'Bank account added successfully');
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        this.addUpi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const upi = yield Upi_1.Upi.create(Object.assign({ userId: user._id }, req.body));
                return this.success(res, { success: true, upi }, 'Upi account added successfully');
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        this.getBankAndUpiAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const upi = yield Upi_1.Upi.find({ userId: user._id }).exec();
                const bank = yield BankAccount_1.BankAccount.find({ userId: user._id }).exec();
                return this.success(res, { upi, bank });
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        this.deleteBankAndUpiAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (req.body.type === 'upi')
                    yield Upi_1.Upi.deleteOne({ _id: req.body.id, userId: user._id }).exec();
                else
                    yield BankAccount_1.BankAccount.deleteOne({ _id: req.body.id, userId: user._id }).exec();
                return this.success(res, { success: true });
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        this.calculatepnl = (userId, type = 'W') => __awaiter(this, void 0, void 0, function* () {
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
            const bal = yield Balance_1.Balance.findOne({ userId: userId }).select({ profitLoss: 1 });
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
            return (bal === null || bal === void 0 ? void 0 : bal.profitLoss) ? bal === null || bal === void 0 ? void 0 : bal.profitLoss : 0;
        });
        this.addDepositWithdrawOldddd = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req.user;
                user = yield User_1.User.findOne({ _id: mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id) });
                const filePath = req.file ? req.file.path : null;
                const { type, utrno } = req.body;
                const parentUsers = [...user.parentStr];
                const checkWithdraw = yield DepositWithdraw_1.DepositWithdraw.findOne({ userId: user._id, status: 'pending', type: type });
                if (checkWithdraw)
                    throw Error(`You have already created ${type} request!`);
                const getBalWithExp = yield Balance_1.Balance.findOne({ userId: user._id });
                if (getBalWithExp.balance - getBalWithExp.exposer < req.body.amount && type == "withdraw") {
                    throw Error('Insufficient amount to withdrawal, Due to pending exposure or less amount');
                }
                yield DepositWithdraw_1.DepositWithdraw.create(Object.assign(Object.assign({ userId: user._id, parentId: parentUsers === null || parentUsers === void 0 ? void 0 : parentUsers.pop(), parentStr: user.parentStr, username: user.username }, req.body), { imageUrl: filePath, orderId: Date.now(), utrno: utrno }));
                return this.success(res, { success: true }, `${req.body.type === 'deposit' ? 'Deposit' : 'Withdraw'} amount added successfully`);
            }
            catch (e) {
                return this.fail(res, e.message);
            }
        });
        this.addDepositWithdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req.user;
                user = yield User_1.User.findOne({ _id: mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id) });
                const filePath = req.file ? req.file.path : null;
                const { type, utrno, amount, narration } = req.body;
                const amt = Number(amount);
                const parentUsers = [...user.parentStr];
                const checkWithdraw = yield DepositWithdraw_1.DepositWithdraw.findOne({ userId: user._id, status: 'pending', type: type });
                if (checkWithdraw)
                    throw Error(`You have already created ${type} request!`);
                const getBalWithExp = yield Balance_1.Balance.findOne({ userId: user._id });
                if (getBalWithExp.balance - getBalWithExp.exposer < req.body.amount && type == "withdraw") {
                    throw Error('Insufficient amount to withdrawal, Due to pending exposure or less amount');
                }
                if (type === 'withdraw') {
                    // STEP 1: Deduct immediately
                    const prevBal = yield this.getUserBalance(user._id.toString());
                    const closeBal = prevBal - amt;
                    // Add accounting entry
                    const accStmt = new AccountStatement_1.AccoutStatement({
                        userId: user._id,
                        narration: narration || 'Withdrawal request (on hold)',
                        amount: -amt,
                        type: AccountStatement_1.ChipsType.fc,
                        txnType: UserChip_1.TxnType.dr,
                        openBal: prevBal,
                        closeBal: closeBal,
                        txnBy: user.username,
                    });
                    yield accStmt.save();
                    // Update Balance
                    const pnl = yield this.calculatepnl(user._id, 'W');
                    const mainBal = yield this.getUserDepWithBalance(user._id);
                    yield Balance_1.Balance.findOneAndUpdate({ userId: user._id }, {
                        balance: closeBal,
                        profitLoss: pnl - amt,
                        mainBalance: mainBal,
                    }, { new: true, upsert: true });
                }
                // STEP 2: Create the withdraw/deposit request
                yield DepositWithdraw_1.DepositWithdraw.create(Object.assign(Object.assign({ userId: user._id, parentId: parentUsers === null || parentUsers === void 0 ? void 0 : parentUsers.pop(), parentStr: user.parentStr, username: user.username }, req.body), { imageUrl: filePath, orderId: Date.now(), utrno: utrno, status: 'pending' }));
                return this.success(res, { success: true }, `${req.body.type === 'deposit' ? 'Deposit' : 'Withdraw'} amount added successfully`);
            }
            catch (e) {
                return this.fail(res, e.message);
            }
        });
        this.getDepositWithdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { startDate, endDate, username, reportType } = req.body;
                const user = req.user;
                let query = {
                    userId: mongoose_1.Types.ObjectId(user._id),
                    type: req.body.type,
                };
                if (user.role !== Role_1.RoleType.user) {
                    delete query.userId;
                    query.parentStr = { $elemMatch: { $eq: mongoose_1.Types.ObjectId(user._id) } };
                }
                if (username)
                    query.username = username;
                if (startDate) {
                    query.createdAt = {
                        $gte: startDate.includes('T')
                            ? `${startDate.replace('T', ' ')}:00`
                            : `${startDate} 00:00:00`,
                    };
                }
                if (endDate) {
                    query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $lte: endDate.includes('T') ? `${endDate.replace('T', ' ')}:00` : `${endDate} 23:59:59` });
                }
                if (reportType && reportType != 'ALL') {
                    query.status = reportType;
                }
                console.log('query', query);
                const data = yield DepositWithdraw_1.DepositWithdraw.find(query).exec();
                return this.success(res, data);
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        ////oldddwala
        this.updateDepositWithdrawoldddd = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const _a = req.body, { id, status } = _a, rest = __rest(_a, ["id", "status"]);
                const txn = yield DepositWithdraw_1.DepositWithdraw.findOne({
                    _id: mongoose_1.Types.ObjectId(id),
                    status: 'pending',
                });
                if (!txn)
                    return this.fail(res, 'Entry not found');
                txn.remark = req.body.narration;
                if (status === 'approved') {
                    req.body.amount = txn.amount;
                    req.body.parentUserId = txn.parentId;
                    req.body.userId = txn.userId;
                    const { userAccBal, pnlData } = yield new AccountController_1.AccountController().depositWithdraw(req, req === null || req === void 0 ? void 0 : req.user);
                    const successMsg = 'Transaction Approved';
                    if (successMsg) {
                        txn.status = status;
                    }
                    yield txn.save();
                    return this.success(res, { success: true }, successMsg);
                }
                else {
                    const successMsg = 'Transaction rejected';
                    txn.status = 'rejected';
                    yield txn.save();
                    return this.success(res, { success: true }, successMsg);
                }
                // await DepositWithdraw.findOneAndUpdate({ _id: id }, { ...rest })
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
        this.updateDepositWithdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const _b = req.body, { id, status } = _b, rest = __rest(_b, ["id", "status"]);
                const txn = yield DepositWithdraw_1.DepositWithdraw.findOne({
                    _id: mongoose_1.Types.ObjectId(id),
                    status: 'pending',
                });
                if (!txn)
                    return this.fail(res, 'Entry not found');
                txn.remark = req.body.narration;
                if (status === 'approved') {
                    // ✅ Already deducted at request time
                    txn.status = 'approved';
                    txn.remark = req.body.narration || 'Withdrawal approved';
                    yield txn.save();
                    return this.success(res, { success: true }, 'Withdrawal Approved');
                }
                else if (status === 'rejected') {
                    // ❌ Need to reverse deduction
                    const userId = txn.userId;
                    const amt = txn.amount;
                    const prevBal = yield this.getUserBalance(userId.toString());
                    const closeBal = prevBal + amt;
                    // Reverse accounting entry
                    const accStmt = new AccountStatement_1.AccoutStatement({
                        userId,
                        narration: req.body.narration || 'Withdrawal rejected (amount refunded)',
                        amount: amt,
                        type: AccountStatement_1.ChipsType.fc,
                        txnType: UserChip_1.TxnType.cr,
                        openBal: prevBal,
                        closeBal,
                        txnBy: 'System',
                    });
                    yield accStmt.save();
                    // Update balance
                    const pnl = yield this.calculatepnl(userId, 'D');
                    const mainBal = yield this.getUserDepWithBalance(userId);
                    yield Balance_1.Balance.findOneAndUpdate({ userId }, { balance: closeBal, profitLoss: pnl + amt, mainBalance: mainBal }, { new: true, upsert: true });
                    txn.status = 'rejected';
                    txn.remark = req.body.narration || 'Withdrawal rejected';
                    yield txn.save();
                    return this.success(res, { success: true }, 'Withdrawal Rejected and amount refunded');
                }
                else {
                    return this.fail(res, 'Invalid status');
                }
                // await DepositWithdraw.findOneAndUpdate({ _id: id }, { ...rest })
            }
            catch (e) {
                return this.fail(res, e);
            }
        });
    }
    //old adddepostiwithdraw
    getUserBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ac = yield AccountStatement_1.AccoutStatement.aggregate([
                { $match: { userId: mongoose_1.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                    },
                },
            ]);
            const Balance_ = ac && ac.length > 0 ? ac[0].totalAmount : 0;
            return Balance_;
        });
    }
    getUserDepWithBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ac = yield AccountStatement_1.AccoutStatement.aggregate([
                { $match: { userId: mongoose_1.Types.ObjectId(userId), type: AccountStatement_1.ChipsType.fc } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                    },
                },
            ]);
            const Balance_ = ac && ac.length > 0 ? ac[0].totalAmount : 0;
            return Balance_;
        });
    }
}
exports.DepositWithdrawController = DepositWithdrawController;
//# sourceMappingURL=DepositWithdrawController.js.map