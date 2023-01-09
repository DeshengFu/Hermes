import '../App.css';

import * as React from 'react';
import Grid from '@mui/material/Grid';

import { initialize_title, modify_title } from '../App';
import { AbstractPage } from '../AbstractPage';



class Information extends AbstractPage {
	constructor() {
		super('/information.basic.php');
		this.state = { info: null };
	}

	result(result, info) {
		this.setState({ info: info });
	}

	tdraw() {
		return (<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
			Hermes Main Page
		</Grid>);
	}

	draw() {
		initialize_title();
		modify_title(2, window.lan.information.title);
		return this.pdraw([{ info: window.lan.information.title }], null, null, this.tdraw());
	}
}



export default Information;