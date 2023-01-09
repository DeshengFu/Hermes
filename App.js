import './App.css';

import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import config from './config.json';

import InformationBasic from './feature/information.basic';



window.pagelist = [];



const components = {
    information: { basic: InformationBasic }
};



const plugins = {
}



window.onpopstate = function (event) {
    refresh();
}



export function loading(isloading) {
    window.appframe.setState({ isloading: isloading });
}



export function load(url) {
    window.history.pushState(null, null, url);
    refresh();
}



export function reload() {
    for (var i = 0; i < window.pagelist.length; i++) {
        window.pagelist[i].submit();
    }
    refresh();
}



export function refresh() {
    window.appframe.setState({ id: window.appframe.id + 1 });
}



export function initialize_title() {
    document.title = (window.server ? (window.server.name + ' - ') : '') + window.lan.main.title;
}



export function modify_title(level, value) {
    var parts = document.title.split(' - ').reverse();
    parts[level] = value;
    document.title = parts.reverse().join(' - ');
    if (document.getElementById('main_title')) document.getElementById('main_title').innerText = parts[0];
}



export function get_url(path) {
    return window.server.url + path;
}



export async function get_json(path) {
    let response = await fetch(window.server.url + encodeURI(path), { credentials: 'include' });
    return await response.json();
}



export async function post_file(path, file, data) {
    let form = new FormData();
    if (file.name) form.append("file", file);
    form.append("json", JSON.stringify(data));
    let response = await fetch(window.server.url + encodeURI(path), { credentials: 'include', method: 'POST', body: form });
    return await response.json();
}



export async function post_json(path, data) {
    let response = await fetch(window.server.url + encodeURI(path), { credentials: 'include', method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    return await response.json();
}



export async function put_json(path, data) {
    let response = await fetch(window.server.url + encodeURI(path), { credentials: 'include', method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    return await response.json();
}



export async function delete_json(path) {
    let response = await fetch(window.server.url + encodeURI(path), { credentials: 'include', method: 'DELETE' });
    return await response.json();
}



export function load_component(base, path, reference) {
    const variant = window.config.feature[base];
    if (!variant) return (null);
    var Component = components[base][variant];
    return (<Component key={'component_' + base} path={path} reference={reference} />);
}



export function load_plugin(base, variant, information, reference) {
    if (!window.config.plugin[base]) return (null);
    return new plugins[base][variant](variant, information, reference);
}



export function split_path(path) {
    const path_info = path.split('/');
    return [path_info[1], path.substring(path_info[1].length + 1)];
}



const theme = createTheme({
    palette: {
        primary: {
            main: '#404080',
        },
        secondary: {
            main: '#808080',
        },
        light: {
            main: '#A0A0A0',
        }
    }
});



class Frame extends React.Component {
    render() {
        initialize_title();
        const [base, path] = split_path(window.location.pathname === '/' ? '/information' : window.location.pathname);
        const component = load_component(base, path);
        return component;
    }
}



class App extends React.Component {
    constructor() {
        super();
        this.state = { loaded: false, isloading: false, id: 0 };
        window.appframe = this;
    }

    async load() {
        window.config = config;

        window.server = config.server;

        window.language = config.language;
        window.lan = require('./lan/' + config.language + '/lan.json');
        for (let feature in config.feature) {
            let lan;
            try {
                lan = require('./lan/' + config.language + '/feature/' + feature + '.json');
            } catch (ex) { continue; }
            window.lan[feature] = lan;
            if (lan.global)
            {
                lan.global.forEach((item) => {
                    if (!window[item[0]]) window[item[0]] = [];
                    window[item[0]][item[1]] = item[2];
                });
            }
        }
        for (let plugin in config.plugin) {
            let lan;
            try {
                lan = require('./lan/' + config.language + '/plugin/' + plugin + '.json');
            } catch (ex) { continue; }
            window.lan[plugin] = lan;
            if (lan.global)
            {
                lan.global.forEach((item) => {
                    if (!window[item[0]]) window[item[0]] = [];
                    window[item[0]][item[1]] = item[2];
                });
            }
        }
        require('./lan/' + config.language + '/css.css');
        this.setState({ loaded: true });
    }

    componentDidMount() {
        this.load();
    }

    render() {
        if (!this.state.loaded) return (
            <ThemeProvider theme={theme}><div className="mframe">
                <Backdrop sx={{ bgcolor: '#FFFFFF' }} open={true}><CircularProgress color="inherit" /></Backdrop></div>
            </ThemeProvider>);
        return (
            <ThemeProvider theme={theme}><LocalizationProvider dateAdapter={AdapterDayjs}><div className="frame"><Frame /></div>
                <Backdrop sx={{ bgcolor: '#FFFFFF' }} open={this.state.isloading}> <CircularProgress color="inherit" /></Backdrop>
            </LocalizationProvider></ThemeProvider>
        );
    }
}



export default App;