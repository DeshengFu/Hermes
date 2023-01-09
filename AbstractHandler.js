import './App.css';

import * as React from 'react';

import { loading, get_json, post_json, put_json, delete_json, post_file } from './App';



class AbstractHandler extends React.Component {
    constructor(path, method, value = {}) {
        super();
        this.path = path;
        this.method = method;
        this.value = value;
        this.defvalue = { ...value };
        this.timeout = 0;
    }

    handle(result, info) {
    }

    draw() {
        return (<></>);
    }

    sdraw() {
        return this.draw();
    }

    reset() {
        this.value = { ...this.defvalue };
    }

    async submit(path = '') {
        if (this.timeout > 0) clearTimeout(this.timeout);
        loading(true);
        if (path !== '')
            this.path = path;
        else
            path = this.path;
        if (this.method === 'delete') {
            const params = decodeURIComponent((new URLSearchParams(this.value)).toString());
            path = path + (path.indexOf('?') < 0 ? '?' : '&') + params;
        }
        let result = null;
        if (this.method === 'get') result = await get_json(path);
        if (this.method === 'post') result = await post_json(path, this.value);
        if (this.method === 'put') result = await put_json(path, this.value);
        if (this.method === 'delete') result = await delete_json(path);
        if (this.method === 'file') result = await post_file(path, this.value['file'], this.value);
        this.timeout = setTimeout(loading.bind(null, false), 100);
        this.handle(result.result, result.info);
    }

    render() {
        return this.sdraw();
    }
}



export default AbstractHandler;