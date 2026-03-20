import React, { useEffect } from 'react'
import { MouseEvent } from 'react'
import { useNavigateCustom } from '../_layout/elements/custom-link'

const Page404 = () => {
  const navigate = useNavigateCustom()

  const redirectToHome = (e?: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault()
    navigate.go('/')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.go('/')
    }, 1000) // ⏱ 2 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='login'>
      <div className='wrapper'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='loginInner1'>
                <div className='log-logo m-b-20 text-center'>
                  <img src='/imgs/logo.png' className='logo-login' alt='logo' />
                </div>

                <div className='featured-box-login featured-box-secundary default text-center'>
                  <div className='error-template'>
                    <h1>Oops!</h1>
                    <h2>404 Not Found</h2>
                    <div className='error-details m-b-20'>
                      Sorry, the page you are looking for does not exist.
                    </div>
                    <div className='error-actions'>
                      <a
                        href='#'
                        onClick={redirectToHome}
                        className='btn btn-primary btn-lg'
                      >
                        Take Me Home
                      </a>
                    </div>
                    <p style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
                      Redirecting to home in 2 seconds...
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
