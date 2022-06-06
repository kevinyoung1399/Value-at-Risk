import React from 'react'
import Popup from 'reactjs-popup'

/**
 * The AddStockPopUp component of this React App
 * @author Kevin Young
 */
class AddStockPopUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      asset: "",
      amount: -1,
      volatility: -1,
      expectedReturn: -1,
      id: -1,

      canShowVolatility: this.props.canShowVolatility,
      canShowExpectedReturn: this.props.canShowExpectedReturn,
      canShowTestMessage: this.props.canShowTestMessage,
      informationMissing: false
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
   * Sets the asset state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onAssetNameChange = event => {
    this.setState({ asset: event.target.value });
  };

/**
   * Sets the amount state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onAmountChange = event => {
    this.setState({ amount: parseFloat(event.target.value) });
  };

/**
   * Sets the volatility state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onVolatilityChange = event => {
    this.setState({ volatility: event.target.value /100});
  };

/**
   * Sets the expectedReturn state for the back test calculation
   * @param {*} event - The event that triggers the function
   *
   */
  onExpectedRateChange = event => {
    this.setState({ expectedReturn: event.target.value /100});
  };

/**
 * Add the stock to the user's stocks list using the input data from the pop-up
 */
  onAddStock = () => {
    /*Check if input values are all filled in, depending on the approach (some approaches
    allow input volatility/expected return data, some do not).*/
    if ((this.state.asset != "" && this.state.amount >= 0) && 
      ((this.state.canShowVolatility && this.state.volatility >=0) || (!this.state.canShowVolatility)) &&
        ((this.state.canShowExpectedReturn && this.state.expectedReturn >=0) || (!this.state.canShowExpectedReturn))) {
          /*Prepare data to be submitted, depending on the approach/available data*/
          this.assignID()
          this.setState({informationMissing: false})

          var inputStockData = {id : this.state.id, asset : this.state.asset, amount : this.state.amount}

          if (this.state.canShowVolatility) {
            inputStockData.volatility = this.state.volatility
          }

          if (this.state.canShowExpectedReturn) {
            inputStockData.expectedReturn = this.state.expectedReturn
          }
          console.log('good info')
          this.props.onInputStocksChange(inputStockData)
          return true
        } else {
          console.log('missing info', this.state)
          this.setState({informationMissing: true})
          this.forceUpdate()
          return false
        }
  }

 /* Rendering of the AddStockPopUp */
 render() {
    return (
      <Popup
        trigger={
          <div className="link pointer br3 ba bg-near-white dim b--white-10 pa1 mr3 w-45 shadow-5 ">
              <h3 className="black">add stock </h3>
          </div>
        }
        modal className=" bg-transparent br3 shadow-5 center"
      >
        {close => (
          <div className="measure br3 ba b--col1 mv4 mw6 center">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="black f3 fw6 ph0 mh0 center ">add stock</legend>
              <div className="mt3">
              { /*Specify if a message stating that the stock ticker will be used for testing (back testing,
                stress testing and efficiency finding*/
                this.state.canShowTestMessage? 
                <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of the asset the stock will be tested on</label>
                : <label className="black db fw6 lh-copy f6 nice-bold ">ticker symbol of stock</label>
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
                <label className="black db fw6 lh-copy f6">amount of stock ($)</label>
                <input
                  className="pa2 input-reset near-black ba bg-transparent hover w-100"
                  type="number"
                  name="number"
                  min="0" 
                  id="number"
                  onChange={this.onAmountChange}
                />
              </div>
              { /*Specify if the volatility form can be included (this will depend on the VaR approach)*/

              this.state.canShowVolatility? (
              <div className="mt3">
                <label className="black db fw6 lh-copy f6">volatility of stock (%)</label>
                <input
                  className="pa2 input-reset near-black ba bg-transparent hover w-100"
                  type="number"
                  name="number"
                  min="0"
                  max="100" 
                  id="number"
                  onChange={this.onVolatilityChange}
                />
              </div>

                ) : <div></div> }
              { /*Specify if the expected return form can be included (this will depend on the VaR approach)*/

              this.state.canShowExpectedReturn? (
              <div className="mt3">
                <label className="black db fw6 lh-copy f6">expeted return of stock (%)</label>
                <input
                  className="pa2 input-reset near-black ba bg-transparent hover w-100"
                  type="number"
                  name="number"
                  min="0"
                  max="100"
                  id="number"
                  onChange={this.onExpectedRateChange}
                />
              </div>

                ) : <div></div> }            
            <div className="mt3">
              <input
                onClick={() => {
                  if (this.onAddStock()) {
                  close()
                  }
                }}
                className="br2 pa2 b--green b ph3 col1 pv2 input-reset ba bg-transparent grow pointer f6 dib"
                type="submit"
                value="add stock"
              />
            </div>
            { /*Check if there is any missing information, if there is, update with an error message*/
              this.state.informationMissing ? (
                  <label className="pa2 red db fw6 lh-copy f6">please fill in all the details.</label>
                ) :<div></div>

            }
            <div className="mt3">
            <button
              className="br2 pa2 b--red b ma1 pa2 input-reset ba bg-transparent grow pointer f6 dib "
              onClick={() => {
                console.log('modal closed ')
                close()
              }}
            >
              cancel
            </button>
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
            </fieldset>
          </div>
        )}
      </Popup>
    );
  }
}

export default AddStockPopUp