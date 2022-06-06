import React from 'react'
import Popup from 'reactjs-popup'

/**
 * The AddOptionPopUp component of this React App
 * @author Kevin Young
 */
class AddOptionPopUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      pricingMethod:'not chosen',
      asset: "",

      optionType: "call",
      stockPrice: -1,
      strikePrice: -1,
      volatility: -1,
      riskFreeRate: -1,
      timeToMaturity: -1,
      iterations: -1,
      dividendYield: -1,
      timePerStep: -1,
      numberOfSteps: -1,

      informationMissing: false,
      canShowTestMessage: this.props.canShowTestMessage
    };
  }

/**
   * Assign a newly added option with an identifier
   */
  assignID = () => {
    var id = Math.floor(Math.random() * Math.floor(11));
    this.setState({id : id})
  }

/**
   * Sets the pricingMethod state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onChoosePricingMethod(pricingMethod) {
    this.setState({pricingMethod: pricingMethod})
    this.forceUpdate()
  };

/**
   * Sets the asset state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onAssetNameChange = event => {
    this.setState({ asset: event.target.value });
  };

/**
   * Sets the optionType state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onOptionTypeChange = event => {
    console.log('option type', event.target.value)
    this.setState({ optionType: event.target.value });
  };

/**
   * Sets the stockPrice state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onStockPriceChange = event => {
    this.setState({ stockPrice: parseFloat(event.target.value) });
  };

/**
   * Sets the strikePrice state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onStrikePriceChange = event => {
    this.setState({ strikePrice: parseFloat(event.target.value) });
  };

/**
   * Sets the volatility state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onVolatilityChange = event => {
    this.setState({ volatility: event.target.value / 100 });
  };

/**
   * Sets the riskFreeRate state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onRiskFreeRateChange = event => {
    this.setState({ riskFreeRate: parseFloat(event.target.value) });
  };

/**
   * Sets the timeToMaturity state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onTimeToMaturityChange = event => {
    this.setState({ timeToMaturity: parseFloat(event.target.value) });
  };

/**
   * Sets the iterations state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onIterationsChange = event => {
    this.setState({ iterations: parseFloat(event.target.value) });
  };

/**
   * Sets the dividendYield state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onDividendYieldChange = event => {
    this.setState({ dividendYield: parseFloat(event.target.value) });
  };

/**
   * Sets the timePerStep state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onTimePerStepChange = event => {
    this.setState({ timePerStep: parseFloat(event.target.value) });
  };

/**
   * Sets the numberOfSteps state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onNunberOfStepsChange = event => {
    this.setState({ numberOfSteps: parseFloat(event.target.value) });
  };

/**
 * Add the option to the user's stocks list using the input data from the pop-up
 */
  onAddOption = () => {

    // Check if any information is missing. This will depend on the approach
    // chosen as each approach has varying parameters.
    if (this.state.pricingMethod === "monte carlo simulation") {
      if (this.state.asset === "" || this.state.optionType ==="" || 
            this.state.stockPrice < 0 || this.state.strikePrice < 0 ||
            this.state.volatility < 0 || this.state.riskFreeRate < 0 ||
            this.state.timeToMaturity < 0 || this.state.iterations < 0 ) {

            console.log('missing info', this.state)
            this.setState({informationMissing: true})
            this.forceUpdate()
            return false
          }
        }

    else if (this.state.pricingMethod === "black scholes merton model") {
      if (this.state.asset === "" || this.state.optionType ==="" || 
            this.state.stockPrice < 0 || this.state.strikePrice < 0 ||
            this.state.volatility < 0 || this.state.riskFreeRate < 0 ||
            this.state.timeToMaturity < 0 || this.state.dividendYield < 0 ) {

            console.log('missing info', this.state)
            this.setState({informationMissing: true})
            this.forceUpdate()
            return false
          }
        }

    else if (this.state.pricingMethod === "binomial option pricing model") {
      if (this.state.asset === "" || this.state.optionType ==="" || 
            this.state.stockPrice < 0 || this.state.strikePrice < 0 ||
            this.state.volatility < 0 || this.state.riskFreeRate < 0 ||
            this.state.timePerStep < 0 || this.state.dividendYield < 0 ||
            this.state.numberOfSteps < 0 ) {

            console.log('missing info', this.state)
            this.setState({informationMissing: true})
            this.forceUpdate()
            return false
          }
        }



    console.log('good info', this.state)
    this.assignID()

      /*Prepare data to be submitted, depending on the approach/available data*/
      var inputOptionData = {id : this.state.id, asset : this.state.asset, 
        pricingMethod : this.state.pricingMethod, optionType : this.state.optionType,
        stockPrice : this.state.stockPrice, strikePrice : this.state.strikePrice, volatility : this.state.volatility,
        riskFreeRate : this.state.riskFreeRate}

      if (this.state.pricingMethod === "monte carlo simulation") {
        console.log('monte carlo')
        inputOptionData.timeToMaturity = this.state.timeToMaturity
        inputOptionData.iterations = this.state.iterations
      }

      else if (this.state.pricingMethod === "black scholes merton model") {
        console.log('black scholes')
        inputOptionData.timeToMaturity = this.state.timeToMaturity
        inputOptionData.dividendYield = this.state.dividendYield
      }

      else {
        console.log('binomial trees')
        inputOptionData.timePerStep = this.state.timePerStep
        inputOptionData.dividendYield = this.state.dividendYield
        inputOptionData.numberOfSteps = this.state.numberOfSteps
      }

      this.setState({informationMissing: false, pricingMethod: 'not chosen'})
      this.props.onInputOptionsChange(inputOptionData)
    return true
  }

 /* Rendering of the AddOptionPopUp
    This pop up has 4 pages, the add option menu, the monte carlo simulation page, 
    the black scholes merton model page and the binomial option pricing model page. 
    The resulting rendered page will depend on the pricingMethod state of this component. */
 render() {
    return (
      <Popup
        trigger={
          <div className="link pointer br3 ba bg-near-white dim b--white-10 pa1 mr3 w-45 shadow-5 ">
              <h3 className="black">add option </h3>
          </div>
        }
        modal className=" bg-transparent br3 shadow-5 center"
      >
        {close => (
          <div className="measure br3 ba b--col1 mv4 mw2 center">
            <fieldset id="add_option" className="ba b--transparent ph0 mh0 mv3">
              <legend className="black f3 fw6 ph0 mh0 center ">add option</legend>
              {this.state.pricingMethod === 'not chosen'?
                <div>
                <label className="black db fw6 lh-copy f6" htmlFor="text">choose an option pricing method.</label>
                <div className="flex flex-column-m mv1 mw10 pa3">
                  <div onClick={() => this.onChoosePricingMethod('monte carlo simulation')} className="ma3 link pointer br2 ba bg-near-black dim b--white-10 pa1 w-45 shadow-5 ">
                      <h3 className="">monte carlo simulation</h3>
                  </div>
                  <div onClick={() => this.onChoosePricingMethod('black scholes merton model')} className="ma3 link pointer br2 ba bg-near-black dim b--white-10 pa1 w-45 shadow-5 ">
                      <h3 className="">black scholes merton model</h3>
                  </div>
                  <div onClick={() => this.onChoosePricingMethod('binomial option pricing model')} className="ma3 link pointer br2 ba bg-near-black dim b--white-10 pa1 w-45 shadow-5 ">
                      <h3 className="">binomial option pricing model</h3>
                  </div>
                </div>
                </div> :
              /*The corresponding form will rener depending on what option pricing method the user chooses. E.g. by choosing 
                  Black Scholes Merton model, the Black Scholes Merton Model form will be rendered to the user, where they will be
                  able to input their data to be used for the Black Scholes Merton model.
              */
                this.state.pricingMethod === 'monte carlo simulation' ?
                  <div>
                  <h3 className="black"> monte carlo simulation </h3>
                  <div className="mt3">
                    { /*Specify if a message stating that the stock ticker will be used for testing (back testing,
                      stress testing and efficiency finding*/
                      this.state.canShowTestMessage? 
                      <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of the asset the option will be tested on</label>
                      : <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of option</label>
                    }
                    <input
                      className="pa2 input-reset near-black ba ba bg-transparent hover w-100"
                      type="text"
                      name="text"
                      id="text"
                      onChange={this.onAssetNameChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">option type</label>
                    <select
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onOptionTypeChange}>
                      <option value="call">call</option>
                      <option value="put">put</option>
                    </select>
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">stock price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStockPriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">strike price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStrikePriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">volatility (%)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onVolatilityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">risk free rate</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onRiskFreeRateChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">time to maturity (years)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onTimeToMaturityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">number of iterations</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onIterationsChange}
                    />
                  </div>
                  <div className="mt3">
                    <input
                      onClick={() => {
                        if (this.onAddOption()) {
                        close()
                        }
                      }}
                      className="br2 pa2 b--green b ph3 col1 pv2 input-reset ba bg-transparent grow pointer f6 dib"
                      type="submit"
                      value="add option"
                    />
                  </div>
                  { /*Check if there is any missing information, if there is, update with an error message*/
                    this.state.informationMissing ? (
                        <label className="pa2 red db fw6 lh-copy f6">please fill in all the details.</label>
                      ) :<div></div>

                  }
                </div>



                 :
                this.state.pricingMethod === 'black scholes merton model' ?
                  <div>
                  <h3 className="black"> the black scholes merton model </h3>
                  <div className="mt3">
                    { /*Specify if a message stating that the stock ticker will be used for testing (back testing,
                      stress testing and efficiency finding*/
                      this.state.canShowTestMessage? 
                      <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of the asset the option will be tested on</label>
                      : <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of option</label>
                    }
                    <input
                      className="pa2 input-reset near-black ba ba bg-transparent hover w-100"
                      type="text"
                      name="text"
                      id="text"
                      onChange={this.onAssetNameChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">option type</label>
                    <select
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onOptionTypeChange}>
                      <option value="call">call</option>
                      <option value="put">put</option>
                    </select>
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">stock price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStockPriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">strike price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStrikePriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">volatility (%)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onVolatilityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">risk free rate</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onRiskFreeRateChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">time to maturity (years)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onTimeToMaturityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">dividend yield</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onDividendYieldChange}
                    />
                  </div>
                  <div className="mt3">
                    <input
                      onClick={() => {
                        if (this.onAddOption()) {
                        close()
                        }
                      }}
                      className="br2 pa2 b--green b ph3 col1 pv2 input-reset ba bg-transparent grow pointer f6 dib"
                      type="submit"
                      value="add option"
                    />
                  </div>
                  { /*Check if there is any missing information, if there is, update with an error message*/
                    this.state.informationMissing ? (
                        <label className="pa2 red db fw6 lh-copy f6">please fill in all the details.</label>
                      ) :<div></div>

                  }
                </div>



                :
                                  <div>
                  <h3 className="black"> the binomial option pricing model </h3>
                  <div className="mt3">
                    { /*Specify if a message stating that the stock ticker will be used for testing (back testing,
                      stress testing and efficiency finding*/
                      this.state.canShowTestMessage? 
                      <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of the asset the option will be tested on</label>
                      : <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of option</label>
                    }
                    <input
                      className="pa2 input-reset near-black ba ba bg-transparent hover w-100"
                      type="text"
                      name="text"
                      id="text"
                      onChange={this.onAssetNameChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">option type</label>
                    <select
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      name="number"
                      id="number"
                      onChange={this.onOptionTypeChange}>
                      <option value="call">call</option>
                      <option value="put">put</option>
                    </select>
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">stock price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStockPriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">strike price($)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStrikePriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">volatility (%)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onVolatilityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">risk free rate</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onRiskFreeRateChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">dividend yield</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onDividendYieldChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">time per step in tree (years)</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onTimePerStepChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className="black db fw6 lh-copy f6">number of steps in tree</label>
                    <input
                      className="pa2 input-reset near-black ba bg-transparent hover w-100"
                      type="number"
                      min="1"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onNunberOfStepsChange}
                    />
                  </div>
                  <div className="mt3">
                    <input
                      onClick={() => {
                        if (this.onAddOption()) {
                        close()
                        }
                      }}
                      className="br2 pa2 b--green b ph3 col1 pv2 input-reset ba bg-transparent grow pointer f6 dib"
                      type="submit"
                      value="add option"
                    />
                  </div>
                  { /*Check if there is any missing information, if there is, update with an error message*/
                    this.state.informationMissing ? (
                        <label className="pa2 red db fw6 lh-copy f6">please fill in all the details.</label>
                      ) :<div></div>

                  }
                </div>
              }
            <div className="mt3">
            <button
              className="white br4 buttonPosition b ma1 input-reset ba bg-black b--red grow pointer f6 dib center"
              onClick={() => {
                this.setState({pricingMethod: 'not chosen'})
                console.log('modal closed')
                close()
              }}
            >
              X
            </button>
            <button
              className="br2 pa2 b--red b ma1 pa2 input-reset ba bg-transparent grow pointer f6 dib "
              onClick={() => {
                this.setState({pricingMethod: 'not chosen'})
                console.log('modal closed ')
                close()
              }}
            >
              cancel
            </button>
            </div>
          </fieldset>
          </div>
        )}
      </Popup>
    );
  }
}

export default AddOptionPopUp