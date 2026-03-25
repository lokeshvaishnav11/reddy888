const Footer = () => {
  return (
    <div>
      <section className="footerx">
        <div className="footer-top d-none">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/terms-and-conditions">
                    {" "}
                    Terms and Conditions{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/responsible-gaming">
                    {" "}
                    Responsible Gaming{" "}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="support-detail">
            <h2>24X7 Support</h2>
            <p></p>
          </div>
          <div className="social-icons-box"></div>
        </div>
      </section>
      <div className="footer-bottom d-none">
        <div className="secure-logo">
          <div>
            <img src="https://wver.sprintstaticdata.com/v3/static/front/img/ssl.png" />
          </div>
          <div className="ml-2">
            <b>100% SAFE</b>
            <div>Protected connection and encrypted data.</div>
          </div>
        </div>
        <div className="d-inline-block">
          <button className="btn p-0">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/18plus.png" />
          </button>
          <a href="https://www.gamcare.org.uk/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gamecare.png" />
          </a>
          <a href="https://www.gamblingtherapy.org/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gt.png" />
          </a>
        </div>
      </div>
      <div className="footer-text d-none">
        <p></p>
        <p className="text-center">
          © Copyright 2026. All Rights Reserved. Powered by BETBHAI365
        </p>
      </div>
      <div
  className="d-flex flex-column align-items-center justify-content-center w-100"
  style={{ gap: "28px", background: "#f8f8f8", padding: "30px 0" , borderRadius:"10px"}}
>
  {/* Logos Grid */}
  <div
    className="w-100 px-2 d-flex flex-wrap justify-content-center"
    style={{ columnGap: "15px", rowGap: "18px" }}
  >
    {[
      "https://www.reddy888.com/assets/upi-icon-CqXq5Mo6.svg",
      "https://www.reddy888.com/assets/bank-transfer-icon-7O74h-u5.svg",
      "https://www.reddy888.com/assets/be-gamble-aware-icon-B44fWZ8T.svg",
      "https://www.reddy888.com/assets/malta-gaming-authority-BFnFA_pf.svg",
      "https://www.reddy888.com/assets/e-cogra-icon-ClrIrN8g.svg",
      "https://www.reddy888.com/assets/gambling-commission-icon-By8rxeDP.svg",
    ].map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`logo-${i}`}
        style={{
          width: "80px",
          objectFit: "contain",
        }}
      />
    ))}
  </div>

  {/* Bottom Logo */}
  <img
    src="https://www.reddy888.com/assets/gaming-curacao-icon-SsaB65an.svg"
    alt="Company logo"
    style={{
      width: "144px",
      objectFit: "contain",
    }}
  />
</div>
    </div>
  );
};
export default Footer;
