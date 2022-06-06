import React from 'react'

/**
 * The MonteCarloOptionPricing component of this React App
 * @author Kevin Young
 */
class MonteCarloOptionPricing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      asset: "",
      optionType: "call",
      stockPrice: -1,
      strikePrice: -1,
      volatility: -1,
      riskFreeRate: -1,
      timeToMaturity: -1,
      iterations: -1,

      informationMissing: false,
      loadingResults: false,
    };
  }

  onAssetNameChange = event => {
    this.setState({ asset: event.target.value });
  };

  onOptionTypeChange = event => {
    console.log('option type', event.target.value)
    this.setState({ optionType: event.target.value });
  };


  onStockPriceChange = event => {
    this.setState({ stockPrice: parseFloat(event.target.value) });
  };

  onStrikePriceChange = event => {
    this.setState({ strikePrice: parseFloat(event.target.value) });
  };

  onVolatilityChange = event => {
    this.setState({ volatility: event.target.value / 100 });
  };

  onRiskFreeRateChange = event => {
    this.setState({ riskFreeRate: parseFloat(event.target.value) });
  };

  onTimeToMaturityChange = event => {
    this.setState({ timeToMaturity: parseFloat(event.target.value) });
  };

  onIterationsChange = event => {
    this.setState({ iterations: parseFloat(event.target.value) });
  };

/**
   * Fetches the "binomialOptionPricing" method from the backend server and
   * then navigates to another route to display the calculated validty.
   *
   */
  onCalculate = () => {

    // first check if any data from the user is missing
    if (this.state.asset === "" || this.state.optionType ==="" || 
          this.state.stockPrice < 0 || this.state.strikePrice < 0 ||
          this.state.volatility < 0 || this.state.riskFreeRate < 0 ||
          this.state.timePerStep < 0 || this.state.dividendYield < 0 ||
          this.state.numberOfSteps < 0 ) {

          console.log('mising info', this.state)
          this.setState({informationMissing: true})
          this.forceUpdate()
          return false
        }
  
    // Otherwise, send data to server.
    console.log('good info', this.state)
    /*Prepare data to be submitted, depending on the approach/available data*/

    var optionTypeName = this.state.optionType
    var nameCapitalized = optionTypeName.charAt(0).toUpperCase() + optionTypeName.slice(1)

    this.setState({informationMissing: false, loadingResults: true})


    console.log('calculation being sent', this.state)

    fetch('http://localhost:5000/montecarlooptionpricing', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        optionType : nameCapitalized,
        stockPrice : this.state.stockPrice, 
        strikePrice : this.state.strikePrice, 
        volatility : this.state.volatility,
        riskFreeRate : this.state.riskFreeRate, 
        timeToMaturity : this.state.timeToMaturity, 
        iterations : this.state.iterations}

        )
    })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          this.props.loadOptionPrice(data)
          this.props.onRouteChange("optionPriceResult")
        
      }).catch(400).then(this.props.onRouteChange("errorPage"))
    return true
  }

 render() {
    return (
          <div className="measure br3 ba b--col1 mv4 mw2 center w-80-l">
            <fieldset id="add_option" className="ba b--transparent ph0 mh0 mv3">
            <legend className="f1 fw6 ph0 mh0">value at risk finder</legend>
              <legend className=" f2 fw6 ph0 mh0 center ">monte carlo simulation option pricing.</legend>
                  <h3 className="">fill in your parameters to price your option.</h3>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6 nice-bold ">ticker symbol of option</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="text"
                      name="text"
                      id="text"
                      onChange={this.onAssetNameChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">option type</label>
                    <select
                      className="pa2 input-reset white ba b--light-gray ba bg-black border-white hover w-40-m w-40-l"
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
                    <label className=" db fw6 lh-copy f6">stock price($)</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStockPriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">strike price($)</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      name="number"
                      id="number"
                      onChange={this.onStrikePriceChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">volatility (%)</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onVolatilityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">risk free rate</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onRiskFreeRateChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">time to maturity (years)</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onTimeToMaturityChange}
                    />
                  </div>
                  <div className="mt3">
                    <label className=" db fw6 lh-copy f6">iterations</label>
                    <input
                      className="pa2 input-reset white ba b--light-gray ba bg-transparent border-white hover w-40-m w-40-l"
                      type="number"
                      min="0"
                      max="100"
                      name="number"
                      id="number"
                      onChange={this.onIterationsChange}
                    />
                  </div>
                  { /*Check if results are being prepared, if so, send loading message*/
              this.state.loadingResults ? (
                  <label className="pa3 green db fw6 lh-copy f5">your results are being prepared. please wait...</label>
                ) :
                <div>
                <button
                  className="b br2 pa3 ma4 input-reset white ba b--green bg-transparent grow pointer f6 dib"
                   onClick={() => this.onCalculate()}
                >
                  calculate
                </button>
                      { /*Check if there is any missing information, if there is, update with an error message*/
                        this.state.informationMissing ? (
                            <label className="pa2 red db fw6 lh-copy f6">please fill in all the details.</label>
                          ) :<div></div>

                      }
                    <div className="lh-copy">
                      <p
                        className="link dim ph2 pv1 pointer fw5 lh-copy f6"
                        onClick={() => this.props.onRouteChange("menu")}
                      >
                        return to menu
                      </p>
                    </div>
                    </div>
                  }
          </fieldset>
          </div>
        )}
}

export default MonteCarloOptionPricing;