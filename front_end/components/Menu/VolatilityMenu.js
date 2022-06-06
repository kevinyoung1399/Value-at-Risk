import React from 'react';
/**
 * The VolatilityMenu component of this React App
 * @author Kevin Young
 */
class VolatilityMenu extends React.Component {
	constructor() {
		super();
		}

  /**
   * Directs the user to the "simpleVolatility" route
   *
   */
	onPressGoSimpleVolatility = () => {
		this.props.onRouteChange("simpleVolatility")
	}

  /**
   * Directs the user to the "ewma" route
   *
   */
	onPressGoEWMA= () => {
		this.props.onRouteChange("ewma")
	}

  /**
   * Directs the user to the "garch" route
   *
   */
	onPressGoGARCH = () => {
		this.props.onRouteChange("garch")
	}

	/* Rendering of the VolatilityMenu page */
	render() {
		return (
			<article className="br3 ba b--white-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 white-80">
				  <div className="measure">
				    <fieldset id="menu" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">value at risk finder</legend>
				      <legend className="f3 fw6 ph0 mh0">choose a approach to estimate the volatility of a stock.</legend>
				      <div className="mt3">
				        <input onClick={this.onPressGoSimpleVolatility} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="simple volatility"/>
				        <input onClick={this.onPressGoEWMA} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="EWMA"/>
				        <input onClick={this.onPressGoGARCH} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="GARCH(1, 1)"/>
				      </div>
			            <div className="lh-copy mt3">
			              <p
			                className=" nice-bold link dim col1 ph2 pv2 pointer fw5 lh-copy f6"
			                onClick={() => this.props.onRouteChange("menu")}
			              >
			                return to menu
			              </p>
			            </div>
				    </fieldset>
				  </div>
				</main>
			</article>
		);	
	}	

}


export default VolatilityMenu;
