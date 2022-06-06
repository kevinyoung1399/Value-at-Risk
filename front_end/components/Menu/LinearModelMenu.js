import React from 'react';
/**
 * The LinearModelMenu component of this React App
 * @author Kevin Young
 */
class LinearModelMenu extends React.Component {
	constructor() {
		super();
		}

  /**
   * Directs the user to the "linearModel" route
   *
   */
	onPressGoStandardLinear = () => {
		this.props.onRouteChange("linearModel")
	}

  /**
   * Directs the user to the "linearModelCovariance" route
   *
   */
	onPressGoLinearCovariance= () => {
		this.props.onRouteChange("linearModelCovariance")
	}

	/* Rendering of the LinearModelMenu page */
	render() {
		return (
			<article className="br3 ba b--white-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 white-80">
				  <div className="measure">
				    <fieldset id="menu" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">value at risk finder</legend>
				      <legend className="f3 fw6 ph0 mh0">choose a linear model approach.</legend>
				      <div className="mt3">
				        <input onClick={this.onPressGoStandardLinear} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="standard linear model"/>
				        <input onClick={this.onPressGoLinearCovariance} className="b ph3 pv2 ma2 input-reset white ba b--white bg-transparent grow pointer f6 dib" type="submit" value="linear model with covariance"/>
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


export default LinearModelMenu;
