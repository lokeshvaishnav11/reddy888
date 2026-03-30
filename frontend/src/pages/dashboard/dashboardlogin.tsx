import { AxiosResponse } from "axios";
import React, { useCallback, MouseEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import LMatch from "../../models/LMatch";
import sportsServices from "../../services/sports.service";
import ISport from "../../models/ISport";
import { useAppSelector } from "../../redux/hooks";
import {
  selectSportList,
  setCurrentMatch,
} from "../../redux/actions/sports/sportSlice";
import IMatch from "../../models/IMatch";
import { useDispatch } from "react-redux";
import { CustomLink, useNavigateCustom } from "../_layout/elements/custom-link";
import { useWebsocket } from "../../context/webSocket";
import GameTab from "../_layout/elements/game-tab";
import { isMobile } from "react-device-detect";
import GameTabMobile from "../_layout/elements/game-tab-mobile";
import MatchList from "./elements/match-list";
import MatchListMobile from "./elements/match-list-mobile";
import CasinoListItem from "../CasinoList/CasinoListItem";
import casinoService from "../../services/casino.service";
import betService from "../../services/bet.service";

import providersData from "./providers.json";
import mayfav from "./myfav.json";

import {
  selectCasinoMatchList,
  setHomePageCasinoMatch,
} from "../../redux/actions/casino/casinoSlice";
import Fav from "../_layout/elements/fav";
import axios from "axios";
import authService from "../../services/auth.service";
import GameSlider from "./elements/GameSlider";
import HomeCasinoListSHow from "../CasinoList/HomeCasinoListSHow";
import Header from "../_layout/elements/header";
import HeaderLogin from "../_layout/elements/headerlogin";
import Login from "../login/login";

const DashboardLogin = () => {
  const [matchList, setMatchList] = React.useState<LMatch[]>([]);
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);
  const navigate = useNavigateCustom();
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const [odds, setOdds] = React.useState<Record<string, Array<any>>>({});
  const location = useLocation();
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  const [gameUrl, setGameUrl] = React.useState<string>("");
  const [loadingGame, setLoadingGame] = React.useState(false);

  const onIntcasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: any) => {
    e.preventDefault();

    setLoadingGame(true); // <<-- LOADING START

    const payload: any = {
      lobby_url: Item,
      ipAddress: authService.getIpAddress(),
      isMobile: isMobile,
    };

    casinoService
      .getplaycasinotwo(payload)
      .then((res: AxiosResponse<any>) => {
        setGameUrl(res.data.data.url);
      })
      .finally(() => {
        setLoadingGame(false); // <<-- LOADING STOP
      });
  };
  // const isMobile = true;

  const { sportId, status } = useParams();
  console.log(sportId, status, "from parmas in sports");
  React.useEffect(() => {
    sportsServices
      .getMatchList(sportId, status)
      .then((res: AxiosResponse<any>) => {
        const oddsData = { ...odds };
        console.log(res.data, "data from sport list");
        marketIdsEvent(res.data.data, oddsData, "joinMarketRoom");
        setOdds(oddsData);
        setMatchList(res.data.data);
      });
    return () => {
      const oddsData = { ...odds };
      marketIdsEvent(matchList, oddsData, "leaveMarketRoom");
    };
  }, [sportId, status]);

  React.useEffect(() => {
    if (gamesList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        dispatch(setHomePageCasinoMatch(res.data.data));
      });
  }, []);
  React.useEffect(() => {
    socket.on("getMarketData", (marketData) => {
      let firstIndexFirst = "-";
      let firstIndexTwo = "-";
      let secIndexFirst = "-";
      let secfirstIndexTwo = "-";
      let thirdIndexFirst = "-";
      let thirdfirstIndexTwo = "-";
      if (marketData.runners) {
        if (
          marketData.runners[0] &&
          marketData.runners[0].ex.availableToBack[0]
        ) {
          firstIndexFirst = marketData.runners[0].ex.availableToBack[0].price;
          firstIndexTwo = marketData.runners[0].ex.availableToLay[0].price;
        }

        if (
          marketData.runners[1] &&
          marketData.runners[1].ex.availableToBack[0]
        ) {
          secIndexFirst = marketData.runners[1].ex.availableToBack[0].price;
          secfirstIndexTwo = marketData.runners[1].ex.availableToLay[0].price;
        }

        if (
          marketData.runners[2] &&
          marketData.runners[2].ex.availableToBack[0]
        ) {
          thirdIndexFirst = marketData.runners[2].ex.availableToBack[0].price;
          thirdfirstIndexTwo = marketData.runners[2].ex.availableToLay[0].price;
        }
      }

      setOdds((prevOdds) => ({
        ...prevOdds,
        [marketData.marketId]: [
          firstIndexFirst,
          firstIndexTwo,
          thirdIndexFirst,
          thirdfirstIndexTwo,
          secIndexFirst,
          secfirstIndexTwo,
        ],
      }));
    });

    return () => {
      socket.off("getMarketData");
    };
  }, [odds]);

  // React.useEffect(()=>{
  //   betService.lenadena().then((res:AxiosResponse<any>)  =>{
  //     console.log(res,"res for lena dena jai hind !")
  //   })
  // },[])

  // const fetchMarketData = async () => {
  //   try {
  //      const response = await axios.get("http://185.211.4.99:3000/allMatchUsingSports/4");

  //      console.log(response,"fetching data from api ")
  //     const marketData = response.data;
  //     console.log(marketData,"market Data is")

  //     let firstIndexFirst = "-";
  //     let firstIndexTwo = "-";
  //     let secIndexFirst = "-";
  //     let secfirstIndexTwo = "-";
  //     let thirdIndexFirst = "-";
  //     let thirdfirstIndexTwo = "-";

  //     if (marketData.runners) {
  //       if (marketData.runners[0]?.ex?.availableToBack[0]) {
  //         firstIndexFirst = marketData.runners[0].ex.availableToBack[0].price;
  //         firstIndexTwo = marketData.runners[0].ex.availableToLay[0]?.price || "-";
  //       }

  //       if (marketData.runners[1]?.ex?.availableToBack[0]) {
  //         secIndexFirst = marketData.runners[1].ex.availableToBack[0].price;
  //         secfirstIndexTwo = marketData.runners[1].ex.availableToLay[0]?.price || "-";
  //       }

  //       if (marketData.runners[2]?.ex?.availableToBack[0]) {
  //         thirdIndexFirst = marketData.runners[2].ex.availableToBack[0].price;
  //         thirdfirstIndexTwo = marketData.runners[2].ex.availableToLay[0]?.price || "-";
  //       }
  //     }

  //     setOdds((prevOdds) => ({
  //       ...prevOdds,
  //       [marketData.marketId]: [
  //         firstIndexFirst,
  //         firstIndexTwo,
  //         thirdIndexFirst,
  //         thirdfirstIndexTwo,
  //         secIndexFirst,
  //         secfirstIndexTwo,
  //       ],
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching market data:", error);
  //   }
  // };

  // React.useEffect(() => {
  //   // Fetch data every 2 seconds
  //   const interval = setInterval(() => {
  //     fetchMarketData();
  //   }, 2000);

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, []);

  const memoOdds = useCallback(
    (marketId: any) => {
      if (!marketId) {
        return (
          <>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
          </>
        );
      }
      const marketData = odds[marketId];
      return (
        <>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[0]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[1]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[2]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[3]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[4]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[5]) || "-"}
              </span>
            </button>
          </td>
        </>
      );
    },
    [odds],
  );

  const marketIdsEvent = (data: any, oddsData: any, event: string) => {
    console.log(data, oddsData, event, "market Event Data");
    data.map((match: IMatch) => {
      match.markets?.map((market) => {
        if (market.marketName == "Match Odds" && !odds[market.marketId]) {
          // setOdds((prevOdds) => ({
          //   ...prevOdds,
          //   [market.marketId]:Array(6).fill('-'),
          // }));
        }
        setTimeout(() => {
          socket.emit(event, market.marketId);
        }, 200);
      });
    });
  };

  const currentMatch = (match: IMatch) => {
    dispatch(setCurrentMatch(match));
    navigate.go(`/odds/${match.matchId}`);
  };

  const tabStyle = {
    padding: "6px 8px",
    margin: "0 4px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#6b6b6b",
    borderRadius: "6px 6px 0 0",
  };
  const [casinoo, setCasinoo] = React.useState("popular");

  return (
    <>
      {" "}
      <HeaderLogin />
      {/* {isMobile ? <GameTabMobile sportId={sportId} sportListState={sportListState} /> : ''} */}
      <div className="pb-4 mtc-5">
        {!isMobile ? <Fav /> : ""}
        {!isMobile ? (
          <GameTab sportId={sportId} sportListState={sportListState} />
        ) : (
          ""
        )}
        <GameSlider />
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="matchlist coupon-card-first">
              <div
                className="d-flex align-items-center w-100"
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontSize: "18px",
                  letterSpacing: "0.5px",
                  gap: "5px",
                  borderBottom: "2px solid #000000",
                  paddingBottom: "8px",
                }}
              >
                <img
                  src="https://www.reddy888.com/assets/cricket-icon-utIDTbmH.svg"
                  alt="cricket"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>Cricket</span>
              </div>

              {!isMobile ? (
                <MatchList
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              ) : (
                <MatchListMobile
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              )}

              <div
                className="w-100 d-flex align-items-center justify-content-between bg-white"
                style={{
                  paddingTop: "4px",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
              >
                <div
                  className="d-flex overflow-auto"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Active Tab */}
                  <div
                    style={{
                      padding: "6px 8px",
                      margin: "0 4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      color: "#2c4f58",
                      borderBottom: "2px solid #2c4f58",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                      transition: "0.1s",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => setCasinoo("popular")}
                  >
                    Popular
                  </div>

                  {/* Tab */}
                  <div
                    style={{
                      padding: "6px 8px",
                      margin: "0 4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      color: "#6b6b6b",
                      borderRadius: "6px 6px 0 0",
                    }}
                  >
                    <span style={{ color: "orange", fontSize: "14px" }}>
                      New Launch
                    </span>
                  </div>

                  {/* Tab */}
                  <div style={tabStyle} onClick={() => setCasinoo("indian")}>
                    Indian games
                  </div>
                  <div style={tabStyle}>Roulette</div>
                  <div style={tabStyle}>AE Sexy</div>
                  <div style={tabStyle}>Slots</div>
                </div>
              </div>

              {casinoo === "indian" ? (
                <HomeCasinoListSHow />
              ) : (
                <div
                  className="w-100 overflow-auto d-flex bg-white hide-scrollbar"
                  style={{
                    padding: "10px 8px",
                    gap: "8px",
                    overflowX: "auto",
                  }}
                >
                  {/* Card 1 */}
                  <CustomLink
                    to="/casino-list-int/19"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="d-flex flex-column align-items-center"
                      style={{
                        width: isMobile ? "117px" : "135px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src="https://cdn.uvwin2024.co/banners/banner__8be77263-5b63-438b-94e5-6f5053f2eba5.webp"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    </div>
                  </CustomLink>

                  {/* Card 2 */}
                  <CustomLink
                    to="/casino-list-int/20"
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{ width: isMobile ? "117px" : "135px" }}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src="https://cdn.uvwin2024.co/banners/banner__499bf269-85a3-44ef-8bc4-0e570c04bbe8.jpeg"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    </div>
                  </CustomLink>

                  {/* Card 3 */}
                  <CustomLink to="/casino-list-int/21">
                    <div style={{ width: isMobile ? "117px" : "135px" }}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src="https://cdn.uvwin2024.co/banners/banner__db6b4a5e-6a5a-4529-98a5-9abcf406ebd7.webp"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    </div>
                  </CustomLink>

                  {/* Card 4 */}
                  <CustomLink to="/casino-list-int/22">
                    <div style={{ width: isMobile ? "117px" : "135px" }}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src="https://cdn.uvwin2024.co/banners/banner__556c2635-5b4f-4cce-824e-d448ed4c766c.webp"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    </div>
                  </CustomLink>

                  <CustomLink to="/casino-list-int/22">
                    <div style={{ width: isMobile ? "117px" : "135px" }}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src="https://cdn.uvwin2024.co/banners/banner__2f1f345c-8ce5-4c93-813e-80e7d08141bf.webp"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    </div>
                  </CustomLink>
                </div>
              )}

              <div
                className="w-100 d-flex align-items-center justify-content-between"
                style={{
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  padding: "6px 7px",
                  backgroundColor: "#1e2a38", // bg-headerBg ka approx color
                }}
              >
                {/* Left Section */}
                <div
                  className="d-flex align-items-center w-100"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "18px",
                    letterSpacing: "0.5px",
                    gap: "5px",
                  }}
                >
                  <img
                    src="https://www.reddy888.com/assets/cricket-icon-utIDTbmH.svg"
                    alt="cricket"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span>Cricket Battle</span>
                </div>

                {/* Right Section */}
                <div style={{ whiteSpace: "nowrap" }}>
                  <sup></sup>
                </div>
              </div>

              <img
                src="https://www.reddy888.com/assets/cricket_battle-4PCl3A2V.webp"
                alt="cricket-battle"
                className="w-100"
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />

              {/* <h2
                className="newheading"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  background: "var(--theme2-bg)",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <span>Newly Launch</span>
              </h2> */}
              <div className="row mx-0 mt-0 d-none">
                {mayfav?.map((item: any) => (
                  <div key={item.id} className="col-4 col-md-3 px-1">
                    <a
                      className="csn_thumb mb-2"
                      onClick={(e) => onIntcasinoClick(e, item.id)}
                    >
                      {/* <CustomLink to={`/casino-list-int/${item.id}`}> */}
                      <img
                        className="img-fluid w-100"
                        style={{ height: "15vh" }}
                        src={item.image}
                        alt={item.title}
                      />
                      {/* </CustomLink> */}
                    </a>
                  </div>
                ))}
              </div>
              {/* <h2
                className="newheading"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  background: "var(--theme2-bg)",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <span>My Favourites</span>
              </h2> */}

              {location.pathname.includes("in-play") || !isMobile ? (
                <div className="home-page">
                  <div
                    className="casino-list mt-2"
                    style={{ marginLeft: !isMobile ? "-6px" : "" }}
                  >
                    {/* <div className='section-title'>Live Casino</div> */}
                    {/* <CasinoListItem /> */}
                  </div>
                </div>
              ) : (
                ""
              )}

              <h2
                className="newheading"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <img src="/assets/chery.svg" />
              </h2>

              <div className="row mx-0 mt-0">
                {providersData?.map((item) => (
                  <div key={item.id} className="col-4 col-md-3 px-1">
                    <div className="csn_thumb mb-2">
                      <CustomLink to={`/casino-list-int/${item.id}`}>
                        <img
                          className="img-fluid w-100"
                          src={item.image}
                          alt={item.title}
                        />
                      </CustomLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {loadingGame && (
        <div className="fullscreen-loader">
          <div className="loader-card">
            <div className="spinner"></div>
            <div className="loader-text">Loading Casino…</div>
          </div>
        </div>
      )}
      {gameUrl && (
        <div className="slot-iframe show">
          <iframe
            scrolling="no"
            allow="fullscreen;"
            src={gameUrl}
            style={{ width: "100%", border: "0px", height: "100%" }}
          ></iframe>
        </div>
      )}

   
    </>
  );
};
export default DashboardLogin;
