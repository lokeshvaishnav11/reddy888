import React, { useEffect, useRef } from "react";
import { CustomLink } from "../../_layout/elements/custom-link";
import { useNavigate } from "react-router-dom";

const imagePrefix = "https://www.reddy888.com";

const data = [
  [
    { src: "/assets/mac88-gaming-zwaLeLHC.webp", alt: "MAC88 LIVE" },
    { src: "/assets/fun-games-B9krrndl.webp", alt: "FUN GAMES" },
  ],
  [
    { src: "/assets/mac_excite-BPgjhHMC.webp", alt: "MAC EXCITE" },
    { src: "/assets/spribe-BsCYpKXd.webp", alt: "SPRIBE" },
  ],
  [
    { src: "/assets/popok-CCGGfJpq.webp", alt: "POPOK" },
    { src: "/assets/kingmaker-Cu2mBW-G.webp", alt: "KINGMAKER" },
  ],
  [
    { src: "/assets/evolution-DpufiSUb.webp", alt: "EVOLUTION" },
    { src: "/assets/turbo-C98pkOBi.webp", alt: "TURBO" },
  ],
  [
    { src: "/assets/evolution-DpufiSUb.webp", alt: "EVOLUTION" },
    { src: "/assets/turbo-C98pkOBi.webp", alt: "TURBO" },
  ],
];

const GameSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // 🔥 duplicate data for infinite effect
  const loopData = [...data, ...data];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;

    const interval = setInterval(() => {
      scrollAmount += 1; // speed control (increase = faster)

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        // 🔁 reset to start (loop smooth)
        slider.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        slider.scrollLeft += 1;
      }
    }, 20); // ⏱ smoothness (lower = smoother)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="d-flex flex-column w-100" style={{ gap: "4px" }}>
      <div className="w-100">
        <div className="d-flex flex-column align-items-center w-100">

          <div
            ref={sliderRef}
            className="d-flex w-100"
            style={{
              gap: "4px",
              overflow: "hidden", // ❗ hide scrollbar
              paddingLeft: "4px",
              paddingTop: "6px",
            }}
          >
            {loopData.map((column, i) => (
              <div key={i} className="d-grid" style={{ gap: "4px" }}>
                {column.map((item, j) => (
                  <div onClick={() => navigate("/casino-games")}  key={j} style={{marginBottom:"4px"}}>
                    <img
                      src={imagePrefix + item.src}
                      alt={item.alt}
                      className="w-100 rounded"
                      style={{
                        minWidth: "280px",
                        height: "36px",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "0.15s",
                      }}
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.95)")
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameSlider;