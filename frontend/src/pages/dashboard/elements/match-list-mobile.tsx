import React, { Fragment } from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";
import { useLocation } from "react-router-dom";

const MatchListMobile = (props: any) => {
  const location = useLocation();

  return (
    <div
      className="card-content mobile-match"
      style={
        location.pathname.includes("in-play")
          ? { maxHeight: "300px", overflowY: "scroll" }
          : {}
      }
    >
      <div className="table coupon-table coupon-table-mobile">
        <div className="row">
          {props.matchList.length > 0 ? (
            props.matchList.map((match: LMatch, index: number) => {
              const marketId =
                match?.markets && match?.markets?.length > 0
                  ? match?.markets[0].marketId
                  : null;
              return (
                <div
                  key={match.matchId}
                  className="w-100 d-flex justify-content-between align-items-center text-nowrap"
                >
                  <div
                    className="d-flex  flex-column justify-content-center align-items-center p-2 border-right"
                    style={{
                      width: "90px",
                      fontSize: "12px",
                      position: "relative",
                    }}
                  >
                    <span className="text-success fw-bold">
                      {moment(match.matchDateTime).format("ddd")}
                    </span>
                    <span className="text-success">
                      {moment(match.matchDateTime).format("hh:mm A")}
                    </span>
                    {new Date(match.matchDateTime).getTime() <
                      new Date().getTime() && (
                      <span className="game-icon">
                        <img
                          src="/imgs/live.gif"
                          alt="live"
                          style={{
                            position: "absolute",
                            width: "17px",
                            height: "12px",
                            top: "0px",
                            right: "0px",
                          }}
                        />{" "}
                      </span>
                    )}
                  </div>

                  <div className="w-100 col-6">
                    <div className="game-icons" style={{ paddingRight: "0px" }}>
                      {match.isFancy && (
                        <span className="game-icon">
                          <img src="/imgs/f.svg" />
                        </span>
                      )}
                      {match.isBookMaker && (
                        <span className="game-icon">
                          <img src="/imgs/bm.svg" />
                        </span>
                      )}
                      <span className="game-icon">
                        <img src="/imgs/tv.svg" />
                      </span>
                    </div>
                    <a
                      onClick={() => props.currentMatch(match)}
                      className="text-edark "
                      href={undefined}
                      style={{ fontSize: "11px", fontWeight: "bolder" }}
                    >
                      {match.name}
                    </a>{" "}
                  </div>

                  <div className="w-100">{props.memoOdds(marketId)}</div>
                </div>
              );
            })
          ) : (
            <div>
              <div className="text-center bg-gray p10">No Match Found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(MatchListMobile);
