import './App.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import AbstractHandler from './AbstractHandler';
import { load, load_component } from './App';



export class AbstractPage extends AbstractHandler {
    constructor(path, infobox = []) {
        super(path, 'get', {});
        this.infobox = infobox;
        this.loaded = false;
        this.login = false;
    }

    result(result, info) {
    }

    handle(result, info) {
        this.loaded = result > -2;
        this.login = result === -1;
        if (this.login) this.forceUpdate();
        if (result >= 0) this.result(result, info);
    }

    componentDidMount() {
        window.pagelist.push(this);
        this.submit();
    }

    componentWillUnmount() {
        for (var i = 0; i < window.pagelist.length; i++) {
            if (window.pagelist[i] === this) {
                window.pagelist.splice(i, 1);
                return;
            }
        }
    }

    pdraw(navi, mpanel, rpanel, main) {
        return (
            <div align="center" className='cframe'>
                <Grid container><Grid item xs={4} sx={{ padding: '15px' }}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <Link underline="hover" key="1" color="inherit" href="#" onClick={() => { load('/'); void (0); }}>{window.lan.general.name}</Link>
                        {navi.map((item, i) => {
                            return item.link ? (<Link underline="hover" key="1" color="inherit" href="#" onClick={() => { load(item.link); }}>{item.info}</Link>) : (<Typography key={i} color="text.primary">{item.info}</Typography>);
                        })}
                    </Breadcrumbs>
                </Grid><Grid item xs={4} align="center" sx={{ padding: '15px' }}>
                        {mpanel}
                    </Grid><Grid item xs={4} align="right" sx={{ padding: '15px' }}>
                        {rpanel}
                    </Grid></Grid>
                <Box sx={{ height: 10 }} />
                {main}
            </div>
        );
    }

    sdraw() {
        return (<>{this.loaded ? (this.login ? load_component('login') :
            (<>{this.draw()}<Box sx={{ padding: "25px" }}>{this.infobox.map((item, i) => (<div key={"infobox_" + i} align="left">{i + 1}. {item}</div>))}</Box></>)) : (<></>)}</>);
    }
}



export default AbstractPage;