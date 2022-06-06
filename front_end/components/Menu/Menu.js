import React from 'react';
/**
 * The Menu component of this React App
 * @author Kevin Young
 */
class Menu extends React.Component {
	constructor() {
		super();
		}

  /**
   * Directs the user to the "about" route
   *
   */
	onPressAbout = () => {
		this.props.onRouteChange("about")
	}

  /**
   * Directs the user to the "historicalSimulationMenu" route
   *
   */
	onPressGoHistoricalSimulationMenu = () => {
		this.props.onRouteChange("historicalSimulationMenu")
	}

  /**
   * Directs the user to the "linearModelMenu" route
   *
   */
	onPressGoLinearMenu = () => {
		this.props.onRouteChange("linearModelMenu")
	}

  /**
   * Directs the user to the "monteCarloSimulationMenu" route
   *
   */
	onPressGoMonteCarlo= () => {
		this.props.onRouteChange("monteCarloSimulationMenu")
	}

  /**
   * Directs the user to the "volatilityMenu" route
   *
   */
	onPressGoVolatilityMenu = () => {
		this.props.onRouteChange("volatilityMenu")
	}

  /**
   * Directs the user to the "optionPricingMenu" route
   *
   */
	onPressGoOptionPricingMenu = () => {
		this.props.onRouteChange("optionPricingMenu")
	}

  /**
   * Directs the user to the "backtest" route
   *
   */
	onPressGoModelAnalysisMenu= () => {
		this.props.onRouteChange("modelAnalysisMenu")
	}

	/* Rendering of the Menu page */
	render() {
		return (
			<article className="br3 ba b--white-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 white">
				  <div className="measure">
				    <fieldset id="menu" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">value at risk finder</legend>
				      <input  onClick={this.onPressAbout}className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6" type="submit" value="about the project" />
				      <legend className="f3 fw6 ph0 mh0">calculate the var of your portfolio.</legend>
				      <div className="mt3 pa2">
				        <input onClick={this.onPressGoHistoricalSimulationMenu} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="historical simulation"/>
				        <input onClick={this.onPressGoLinearMenu} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="linear model"/>
				        <input onClick={this.onPressGoMonteCarlo} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="monte carlo simulation"/>
				      </div>
				      <legend className="f3 fw6 pa2 mh0">estimate the volatility of a stock.</legend>
				      <div className="mv3">
				        <input onClick={this.onPressGoVolatilityMenu} className="b ph3 pv2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="estimate volatility"/>
				      </div>
				      <legend className="f3 fw6 pa2 mh0">price an option.</legend>
				      <div className="mv3">
				        <input onClick={this.onPressGoOptionPricingMenu} className="b ph3 pv2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="price option"/>
				      </div>
				      <legend className="f3 fw6 pa2 mh0">test your value at risk.</legend>
				      <div className="mv3">
				        <input onClick={this.onPressGoModelAnalysisMenu} className="b ph3 pv2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="test value at risk"/>
				      </div>
				    </fieldset>
				  </div>
				</main>
			</article>
		);	
	}	

}


export default Menu;
