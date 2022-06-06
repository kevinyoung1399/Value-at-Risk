import React from 'react'
import Popup from 'reactjs-popup'
import "./PopUp.css";

/**
 * The HelpAndDocPopUp component of this React App
 * @author Kevin Young
 */

/* Rendering of the HelpAndDocPopUp */
const HelpAndDocPopUp =  () => (
  <Popup trigger={<button  style={{ display: "flex", justifyContent: "flex-start" }} 
  className = "link dim col1 ph2 pv1 pointer fw6 lh-copy f6">help and documentation</button>}
   modal className=" bg-transparent br3 ba shadow-5 center w-100">
    {close => (
      <div className="">
        <div className="pa2">
          <p className ="black fw5 center pa2">
          This web application is able to estimate volatilities using the simple volatility algorithm, EWMA and GARCH(1, 1). 
          It is able to price options, via binomial option pricing, Monte Carlo simulation and the Black Scholes Merton model. 
          It can calculate the VaR of a portfolio containing stocks and options, using historical simulation, hybrid historical simulation, Monte Carlo simulation, multivariate Monte Carlo simulation, 
          the linear model and the liner model with co-variances. Furthermore, the application can back,-test stress-test and calculate the efficiency of a calculated VaR.
          </p>
          <p className ="black b center pa2">
          Input your information and press the calculate button to find your results.
          </p>
          <div className="center">
            <button
              className="white br4 buttonPosition b ma1 input-reset ba bg-black b--red grow pointer f6 dib center"
              onClick={() => {
                console.log('modal closed')
                close()
              }}
            >
              X
            </button>
          </div>
        </div>
      </div>
    )}
  </Popup>
)

export default HelpAndDocPopUp