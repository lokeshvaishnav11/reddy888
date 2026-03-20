import React from "react";
import moment from "moment";
import MarqueeAnnouncement from "../_layout/elements/marqueeAnnouncement";
import "../reports.css";
import userService from "../../../services/user.service";
import { AxiosResponse } from "axios";
import User from "../../../models/User";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";

const Settlement = () => {
  const userState = useAppSelector(selectUserData);

  const [userList, setUserList] = React.useState<any>({});
  const [showModal, setShowModal] = React.useState(false);
const [selectedUser, setSelectedUser] = React.useState<any>(null);

const [settlementForm, setSettlementForm] = React.useState({
  amount: "",
  note: "",
});


  const fetchAllChildren = async (rootUsername: string) => {
    const visited = new Set<string>(); // duplicate calls avoid
    const queue: string[] = [rootUsername];
    const allUsers: any[] = [];

    while (queue.length > 0) {
      const currentUsername = queue.shift();
      if (!currentUsername || visited.has(currentUsername)) continue;

      visited.add(currentUsername);

      try {
        const res: AxiosResponse<any> = await userService.getUserList({
          username: currentUsername,
          type: "",
          search: "",
          status: "",
          page: 1,
        });

        const items = res?.data?.data?.items || [];

        for (const item of items) {
          // store user
          allUsers.push(item);

          // push child username for next level
          if (item?.username && !visited.has(item.username)) {
            queue.push(item.username);
          }
        }
      } catch (error) {
        console.error("Error fetching children for:", currentUsername);
      }
    }

    return allUsers;
  };

  React.useEffect(() => {
    if (!userState?.user?.username) return;

    const loadAllUsers = async () => {
      const users = await fetchAllChildren(userState.user.username);
      setUserList(users); // ✅ ek hi baar set
    };

    loadAllUsers();
  }, [userState?.user?.username]);

  console.log(userList, "userlistttttt");

  const profitUsers = Array.isArray(userList)
    ? userList.filter((u) => (u?.balance?.profitLoss ?? 0) >= 0)
    : [];

  const lossUsers = Array.isArray(userList)
    ? userList.filter((u) => (u?.balance?.profitLoss ?? 0) < 0)
    : [];

  const totalProfit = profitUsers.reduce(
    (sum, u) => sum + (u?.balance?.profitLoss ?? 0),
    0
  );

  const totalLoss = lossUsers.reduce(
    (sum, u) => sum + (u?.balance?.profitLoss ?? 0),
    0
  );


  const handleSettlementClick = (user: any) => {
    setSelectedUser(user);
    setSettlementForm({
      amount: user?.balance?.profitLoss ?? 0,
      note: "",
    });
    setShowModal(true);
  };

  const handleSettlementSave = async () => {
    if (!selectedUser) return;
  
    const payload = {
      userId: selectedUser._id,
      username: selectedUser.username,
      role: selectedUser.role,
      amount: settlementForm.amount,
      note: settlementForm.note,
    };
  
    try {
      await userService.adminSettlement(payload); // 🔥 API call
      setShowModal(false);
    } catch (error) {
      console.error("Settlement failed", error);
    }
  };
  
  

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: "20px" }}>
        <div className="container-fluid report-page">
          <div className="row mt-3">
            {/* PROFIT TABLE */}
            <div className="col-md-6 col-12 mb-3">
              <div className="card shadow-sm">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered mb-0">
                    <thead>
                      <tr className=" bg-success text-white font-bold">
                        <th>Username</th>
                        <th>Chip</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {profitUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No Users
                          </td>
                        </tr>
                      )}

                      {profitUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td className="text-success fw-bold">
                            {user.balance?.profitLoss}
                          </td>
                          <td>
                          <button
  style={{ background: "#CC9647" }}
  className="btn btn-sm text-white text-uppercase"
  onClick={() => handleSettlementClick(user)}
>
  Settlement
</button>

                          </td>
                        </tr>
                      ))}
                      {profitUsers.length > 0 && (
                        <tr className="fw-bold bg-success text-white">
                          <td>Total</td>
                          <td className="text-white">{totalProfit}</td>
                          <td>-</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* LOSS TABLE */}
            <div className="col-md-6 col-12 mb-3">
              <div className="card shadow-sm">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered mb-0">
                    <thead>
                      <tr className=" bg-danger text-white font-bold">
                        <th>Username</th>
                        <th>Chip</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lossUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No Users
                          </td>
                        </tr>
                      )}

                      {lossUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td className="text-danger fw-bold">
                            {user.balance?.profitLoss}
                          </td>
                          <td>
                          <button
  style={{ background: "#CC9647" }}
  className="btn btn-sm text-white text-uppercase"
  onClick={() => handleSettlementClick(user)}
>
  Settlement
</button>

                          </td>
                        </tr>
                      ))}
                      {lossUsers.length > 0 && (
                        <tr className="fw-bold bg-danger text-white">
                          <td>Total</td>
                          <td className="text-white">{totalLoss}</td>
                          <td>-</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
  <div className="modal fade show d-block" tabIndex={-1}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        {/* HEADER */}
        <div className="modal-header">
          <h5 className="modal-title">
            Settlement for <b>{selectedUser.username}</b>
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          />
        </div>

        {/* BODY */}
        <div className="modal-body">
          <p className="mb-2">
            <b>Total Outstanding Amount :</b>{" "}
            {selectedUser.balance?.profitLoss}
          </p>

          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              value={settlementForm.amount}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  amount: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Note</label>
            <textarea
              className="form-control"
              rows={3}
              value={settlementForm.note}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  note: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSettlementSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>

    {/* backdrop */}
    {/* <div className="modal-backdrop fade show"></div> */}
  </div>
)}



    </>
  );
};

export default Settlement;
