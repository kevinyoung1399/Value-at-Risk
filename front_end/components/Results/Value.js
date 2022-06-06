import React from 'react';
/**
 * The Value component of this React App
 * @author Kevin Young
 */
const Value = ({val, cvar, onRouteChange}) => {
	/* Rendering of the Value page */
	return (
			<article className="measure br3 ba b--col1 mv4 mw2 center w-80-l">
			<main className="ba b--transparent ph0 mh0 mv3">
				<div className='green pa2 f3 fw6 ph0 mh0'>
				 	<label className="db fw6 lh-copy f4" htmlFor="text">your value at risk is:</label>
						${`${val}`}
				</div>
				{cvar ?
				<div className='green pa2 f3 fw6 ph0 mh0'>
				 	<label className="db fw6 lh-copy f4" htmlFor="text">your conditional value at risk is:</label>
						${`${cvar}`}
				</div> :
				<div>
				</div>

				}
				
	            <div className="lh-copy mt3">
	              <p
	                className=" nice-bold link dim col1 ph2 pv2 pointer fw5 lh-copy f6"
	                onClick={() => window.location.reload()}
	              >
	                return to menu
	              </p>
	            </div>
			</main>
		</article>
	);
}

export default Value;