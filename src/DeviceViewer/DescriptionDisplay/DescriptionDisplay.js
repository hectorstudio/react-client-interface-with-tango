import React from 'react';
import cx from 'classnames';

import './DescriptionDisplay.css';

const DescriptionDisplay = ({description}) => <i
	className={cx(
		'DescriptionDisplay fa fa-info-circle', {
		  'no-description': description === 'No description'
		}
	)}
	title={description}
	onClick={alert.bind(null, description)}
/>;

export default DescriptionDisplay;
