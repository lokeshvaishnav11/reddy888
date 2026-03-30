import React, { ChangeEvent, MouseEvent, useRef } from "react";
import User from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  logout,
  selectUserData,
} from "../../../redux/actions/login/loginSlice";
import NavMenu from "./nav-menu";
import {
  hideBalExp,
  HideBalExp,
  selectBalance,
  selectHideBalExp,
  setExposer,
  setSingleBal,
} from "../../../redux/actions/balance/balanceSlice";
import { CustomLink, useNavigateCustom } from "./custom-link";
import { isMobile } from "react-device-detect";
import Marqueemessge from "../../../admin-app/pages/_layout/elements/welcome";
import NavMobileMenu from "./nav-mobile-menu";
import axios, { AxiosResponse } from "axios";
import { CONSTANTS } from "../../../utils/constants";
import userService from "../../../services/user.service";
import ReactModal from "react-modal";
import { useWebsocketUser } from "../../../context/webSocketUser";
import Rules from "../../Rules/rules";
import { selectRules } from "../../../redux/actions/common/commonSlice";
import AutocompleteComponent from "../../../components/AutocompleteComponent";
import matchService from "../../../services/match.service";
import IMatch from "../../../models/IMatch";
import casinoSlugs from "../../../utils/casino-slugs.json";
import UserService from "../../../services/user.service";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { title } from "process";
import Login from "../../login/login";
import RegisterNew from "../../login/registernew";

const HeaderLogin = () => {
  // const isMobile = true

  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);

  const dispatch = useAppDispatch();
    const [loginHit, setLoginHit] = React.useState(false);
    const [registerHit, setRegisterHit] = React.useState(false);

  const navigate = useNavigateCustom();

  const { socketUser } = useWebsocketUser();

  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [showSideB, setShowSideB] = React.useState<boolean>(false);

  const [showAuto, setShowAuto] = React.useState<boolean>(false);

  const [userMessage, setUserMessage] = React.useState<string>("");

  const [hideExpBal, setHideExpBal] = React.useState<HideBalExp>(
    {} as HideBalExp,
  );

  const [isOpen, setIsOpen] = React.useState<any>(false);
  const [isOpenRule, setIsOpenRule] = React.useState<any>(false);
  const [getExposerEvent, setGetExposerEvent] = React.useState<any>([]);

  // React.useEffect(() => {
  //   axios.get(`userMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
  //     setUserMessage(res.data.message)
  //   })
  // }, [])

//   React.useEffect(() => {
//     setIsOpenRule(rules.open);
//   }, [rules]);

//   React.useEffect(() => {
//     const handlerExposer = ({ exposer, balance }: any) => {
//       if (balance !== undefined) dispatch(setSingleBal(balance));
//       if (exposer !== undefined) dispatch(setExposer(exposer));
//     };
//     socketUser.on("updateExposer", handlerExposer);

//     return () => {
//       socketUser.removeListener("updateExposer", handlerExposer);
//     };
//   }, [balance]);

//   React.useEffect(() => {
//     setHideExpBal(selectHideBal);
//   }, [selectHideBal]);




  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (showMenu && ref.current && !ref.current.contains(event.target)) {
        closeMenu();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, showMenu]);

  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside2 = (event: any) => {
      if (showSideB && ref2.current && !ref2.current.contains(event.target)) {
        closeSideB();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [ref2, showSideB]);

  const closeMenu = () => {
    setShowMenu(false);
  };
  const closeSideB = () => {
    setShowSideB(false);
  };


  const [userParentAlldata, setUserParentAlldata] = React.useState<{
    [key: string]: any;
  }>({});

  // React.useEffect(() => {
  //     if (userState?.user?.username) {
  //       UserService.getUserDetail(userState?.user?.username).then(
  //         (res: AxiosResponse<any>) => {
  //           console.log(res, "ressss for all values");
  //           const detail = res?.data.data;
  //           setUserAlldata(detail);
  //         }
  //       );
  //     }
  //   }, [userState?.user?.username]);

//   React.useEffect(() => {
//     // const userState = useAppSelector<{ user: User }>(selectUserData);
//     const username: any = userState?.user?.username;

//     console.log(username, "testagentmaster");
//     UserService.getParentUserDetail(username).then(
//       (res: AxiosResponse<any>) => {
//         console.log(res, "check balance for parent");
//         const detail = res?.data.data[0];
//         setUserParentAlldata(detail);
//       },
//     );
//   }, [userState]);

  const items = [
    { title: "HOME", linkto: "/match/4/in-play" },
    { title: "MULTI MARKETS", linkto: "/match/4/in-play" },
    { title: "CRICKET", linkto: "/" },
    { title: "SPORTSBOOK", linkto: "/match/4/in-play" },
    { title: "CASINO", linkto: "/casino-games" },
    { title: "TENNIS", linkto: "/match/3/in-play" },
    { title: "COCK FIGHT", linkto: "#" },
    { title: "FOOTBALL", linkto: "/match/1/in-play" },
    { title: "HORSE RACING", linkto: "/match/7/in-play" },
    { title: "GREYHOUND", linkto: "/match/4339/in-play" },
    { title: "BASKETBALL", linkto: "/match/11/in-play" },
    { title: "BASEBALL", linkto: "/match/9/in-play" },
    { title: "POLITICS", linkto: "/match/46/in-play" },
    { title: "BINARY", linkto: "/match/4/in-play" },
    { title: "KABADDI", linkto: "/match/13/in-play" },
  ];

  return (
    <>
    

      <div >
        <header
          style={{ background: "#132225" }}
          className=" text-white py-2 px-1"
        >
          <div className="container-fluid d-flex align-items-center justify-content-between">
            {/* LEFT: Logo */}
            <div className="d-flex align-items-center">
              <div
                style={{ fontSize: "30px" }}
                onClick={() => setShowSideB(!showSideB)}
              >
                ☰
              </div>
              <CustomLink to="/match/4/in-play" className="navbar-brand ml-1">
                <img src="/imgs/image.png" alt="logo" style={{ height: 20 }} />
              </CustomLink>
            </div>

            <ul
              ref={ref2}
              style={{
                display: showSideB ? "block" : "none",
                position: "absolute",
                top: "0px",
                height: "100%",
                left: "0",
                zIndex: 1000,
                minWidth: "256px",
                // padding: '5px 0',
                // margin: '5px 0',
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "left",
                backgroundColor: "#fff",
                border: "1px solid rgba(0, 0, 0, 0.15)",

                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.175)",
                listStyle: "none",
                color: "#000000",
              }}
            >
              <div className="bg-light" style={{ overflow: "hidden" }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center px-2 py-2 border-bottom bg-theme">
                  <div
                    className="d-flex align-items-center "
                    style={{ gap: "8px" }}
                  >
                    <img
                      src="/imgs/image.png"
                      alt="logo"
                      style={{ height: 25 }}
                    />
                  </div>
                  <div
                    onClick={() => setShowSideB(!showSideB)}
                    style={{ cursor: "pointer", color: "white" }}
                  >
                    ✕
                  </div>
                </div>
              </div>

              <div className="sidebar-menu">
                <CustomLink to="/" className="menu-item text-dark">
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center  px-3 py-3"
                  >
                    <img
                      src="https://www.reddy888.com/assets/cricket-sidebar-icon-C5omyrdc.svg"
                      className="menu-icon"
                    />
                    <span>Cricket</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/1/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img
                      src="https://www.reddy888.com/assets/football-sidebar-icon-C_dnYWzd.svg"
                      className="menu-icon"
                    />
                    <span>Football</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/3/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/imgs/tenis.svg" className="menu-icon" />
                    <span>Tennis</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/12/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/basketball.svg" className="menu-icon" />
                    <span>Basketball</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/5/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/baseball.svg" className="menu-icon" />
                    <span>Baseball</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/6/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/ice.svg" className="menu-icon" />
                    <span>Ice Hockey</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/7/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/volleyball.svg" className="menu-icon" />
                    <span>Volleyball</span>
                  </div>
                </CustomLink>

                <CustomLink
                  to="match/8/in-play"
                  className="menu-item text-dark"
                >
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/kabaddi.svg" className="menu-icon" />
                    <span>Kabaddi</span>
                  </div>
                </CustomLink>

                <div className="menu-item">
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/promotion.svg" className="menu-icon" />
                    <span>Promotions</span>
                  </div>
                </div>

                <div className="menu-item">
                  <div
                    style={{ gap: "12px" }}
                    className="d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <img src="/assets/game.svg" className="menu-icon" />
                    <span>Game Rules</span>
                  </div>
                </div>

                <div className="menu-header px-3 py-2">Change Language</div>

                <div className="px-3 py-3">
                  <select className="form-select">
                    <option>English (EN)</option>
                    <option>Hindi (IN)</option>
                  </select>
                </div>
              </div>
            </ul>

            {/* RIGHT: Balance + Buttons + User */}
            <div
              style={{ gap: "8px" }}
              className="d-flex align-items-center gap-2"
            >
              <button 
              

                className="d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  gap: "4px",
                  padding: "0 8px",
                  borderRadius: "50px",
                  minHeight: "28px",
                  background: "#2c4f58", // bg-accordionHeader ka approx color
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={() => setRegisterHit(true)} 
              >
                <span style={{ fontSize: "11px" }}>Sign Up</span>
              </button>

              <button
                onClick={() => setLoginHit(true)}
                className="d-flex align-items-center justify-content-center fw-bold"
                style={{
                  gap: "4px",
                  padding: "0 8px",
                  borderRadius: "50px",
                  minHeight: "28px",
                  background: "#ffffff", // bg-accordionHeader ka approx color
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontSize: "11px",
                  color: "#000000",
                }}
                onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Login
              </button>
            </div>
          </div>
        </header>

        <div>
          <div className="bg-light py-2">
            <div
              style={{ gap: "2px", overflowX: "auto" }}
              className="d-flex hide-scrollbar flex-nowrap gap-2  px-2"
            >
              {items.map((item: any, index: number) => (
                <CustomLink
                  to={item?.linkto}
                  key={index}
                  style={{ borderRadius: "9999px", fontSize: "12px" }}
                  className={`btn rounded-pill px-4 py-1 fw-semibold ${
                    item.name === "HOME"
                      ? "btn-danger text-white"
                      : item.name === "CRICKET"
                      ? "btn-outline-dark"
                      : "btn-light border"
                  }`}
                >
                  {item.title}
                </CustomLink>
              ))}
            </div>
          </div>
        </div>
      </div>

        { loginHit && 
          <div style={{position: "absolute",
    top: "0px",
    right: "13px",
    background: "transparent",
    zIndex: 1000,}}>
        <Login />


      </div>}

      {registerHit && 
        <div style={{position: "absolute",
    top: "0px",
    right: "13px",
    background: "transparent",
    zIndex: 1000,}}>
        <RegisterNew />
        </div>}


    </>
  );
};
export default HeaderLogin;
