import api from '../utils/api'

class AccountService {
  getAccountList(page: number, filter: any) {
    return api.post(`account-statement-list?page=${page}`, filter)
  }
  getProfitLoss(page: number, filter: any) {
    return api.post(`profit-loss?page=${page}`, filter)
  }


  allbetsdata() {
    return api.get(`allbetsdata`);
  }


}
export default new AccountService()
