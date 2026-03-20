import React, { MouseEvent } from 'react'
import { isMobile } from 'react-device-detect'
import { selectCasinoMatchList } from '../../redux/actions/casino/casinoSlice'
import { useAppSelector } from '../../redux/hooks'
import ICasinoMatch from '../../models/ICasinoMatch'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { toast } from 'react-toastify'
import casinoService from '../../services/casino.service'
import authService from '../../services/auth.service'
import { AxiosResponse } from 'axios'
import { useParams } from "react-router-dom";

const IcasinoListItem = () => {

  // const isMobile = true

  const gamesList = useAppSelector<any>(selectCasinoMatchList)
  const navigate = useNavigateCustom()
  const casinoWidth = isMobile ? 'col-3' : 'col11'

  const [gameUrl, setGameUrl] = React.useState<string>('')
  const [loadingGame, setLoadingGame] = React.useState(false)
  const [MacJson, setMacJson] = React.useState<any[]>([])

  const { id } = useParams<{ id: string }>()

  // ==========================
  // Normal Casino Click
  // ==========================
  const onCasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: ICasinoMatch) => {
    e.preventDefault()
    if (!Item.isDisable && Item.match_id !== -1) {
      navigate.go(`/casino/${Item.slug}/${Item.match_id}`)
    } else {
      toast.warn('This game is suspended by admin, please try again later')
    }
  }

  // ==========================
  // International Casino Click
  // ==========================
  const onIntcasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: any) => {
    e.preventDefault()

    setLoadingGame(true)

    const payload: any = {
      lobby_url: Item,
      ipAddress: authService.getIpAddress(),
      isMobile: isMobile,
    }

    casinoService
      .getplaycasinotwo(payload)
      .then((res: AxiosResponse<any>) => {
        setGameUrl(res.data.data.url)
      })
      .catch(() => {
        toast.error("Unable to launch game")
      })
      .finally(() => {
        setLoadingGame(false)
      })
  }

  // ==========================
  // Dynamic JSON Loader
  // ==========================
  React.useEffect(() => {
    if (id) {
      import(`./gamesJson/${id}.json`)
        .then((module) => {
          setMacJson(module.default || [])
        })
        .catch((err) => {
          console.error("JSON load error:", err)
          setMacJson([])
        })
    }
  }, [id])

  // ==========================
  // Auto open iframe (optional)
  // ==========================
  // React.useEffect(() => {
  //   if (gameUrl) {
  //     window.open(gameUrl, "_blank")
  //   }
  // }, [gameUrl])

  return (
    <>
      {/* ================= LOADING ================= */}
      {loadingGame && (
  <div className="fullscreen-loader">
    <div className="loader-card">
      <div className="spinner"></div>
      <div className="loader-text">Loading Casino…</div>
    </div>
  </div>
)}


      {/* ================= IFRAME ================= */}
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

      {/* ================= NORMAL CASINO LIST ================= */}
      {/* 
      {gamesList &&
        gamesList
          .filter((item: any) => !item.isDisable && item.match_id !== -1)
          .map((Item: any, key: number) => {
            return (
              <div className="casino-list-item" key={key}>
                <a href="#" onClick={(e) => onCasinoClick(e, Item)}>
                  <div
                    className="casino-list-item-banner"
                    style={{ backgroundImage: `url(${Item.image})` }}
                  ></div>
                  <div className="casino-list-name">{Item.title}</div>
                </a>
              </div>
            )
          })}
      */}

      {/* ================= INTERNATIONAL CASINO LIST ================= */}
       {/* <div className='col-12'>
        <div className='card-content pt30 pb30'>
      {MacJson.length > 0 &&
        MacJson
          .filter((item: any) => item.code !== "")
          .map((Item: any, key: number) => {
            return (
              <div className="casino-list-item" key={key}>
                <a href="#" onClick={(e) => onIntcasinoClick(e, Item.gameId)}>
                  <div
                    className="casino-list-item-banner"
                    style={{ backgroundImage: `url(${Item.image})` }}
                  ></div>
                  <div className="casino-list-name">{Item.name}</div>
                </a>
              </div>
            )
          })}
          </div>
          </div> */}

          {/* <div
  // className="col-12"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    paddingTop: "30px",
    paddingBottom: "30px",
    margin : "0 6px",
  }}
>
  {MacJson.length > 0 &&
    MacJson.filter((item: any) => item.code !== "").map((Item: any, key: number) => {
      return (
        <div
          key={key}
          style={{
            // flex: "1 1 200px", // min-width 200px
            // maxWidth: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <a
            href="#"
            onClick={(e) => onIntcasinoClick(e, Item.gameId)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                width: "200px",
                height: "150px",
                backgroundImage: `url(${Item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
              }}
            ></div>
            <div
              style={{
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {Item.name}
            </div>
          </a>
        </div>
      );
    })}
</div> */}


<div className="row px-2 py-4">
  {MacJson.length > 0 &&
    MacJson
      .filter((item: any) => item.code !== "")
      .map((Item: any, key: number) => (
        <div
          key={key}
          className="col-6 col-md-2 mb-4 d-flex justify-content-center"
        >
          <a
            href="#"
            onClick={(e) => onIntcasinoClick(e, Item.gameId)}
            style={{ textDecoration: "none", color: "inherit" , width: "100%"}}
          >
            <div
              style={{
                width: "100%",
                height: "150px",
                backgroundImage: `url(${Item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
              }}
            />
            <div
              style={{
                marginTop: "8px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {Item.name}
            </div>
          </a>
        </div>
      ))}
</div>


    </>
  )
}

export default React.memo(IcasinoListItem)
