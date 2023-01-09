import './App.css';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import AbstractHandler from './AbstractHandler';
import { reload } from './App';



export class GroupWrapper extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (<FormControl component="fieldset">
            <FormLabel component="legend">{this.props.title}</FormLabel>
            {this.props.input}
        </FormControl>);
    }
}

export class TooltipWrapper extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (<Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            {this.props.input}
            <Tooltip title={this.props.tooltip}><HelpOutlineIcon size="small" sx={{ color: 'action.active', marginLeft: '10px', marginBottom: '5px' }} /></Tooltip>
        </Box>);
    }
}



export class TextInput extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        let inputProps = {}
        if (this.props.start) inputProps.startAdornment = <InputAdornment position="start">{this.props.start}</InputAdornment>;
        if (this.props.end) inputProps.endAdornment = <InputAdornment position="end">{this.props.end}</InputAdornment>;
        return (
            <TextField
                fullWidth={this.props.fullwidth}
                type={this.props.type}
                id={this.props.id}
                label={this.props.label}
                onChange={this.props.form.handleTextChange.bind(this.props.form, this)}
                value={this.props.form.value.hasOwnProperty(this.props.id) ? this.props.form.value[this.props.id] : ''}
                helperText={this.props.form.validity.hasOwnProperty(this.props.id) ? this.props.form.validity[this.props.id] : ''}
                error={this.props.form.validity.hasOwnProperty(this.props.id) && this.props.form.validity[this.props.id] !== ''}
                variant="standard" multiline={this.props.multiline} rows={this.props.rows}
                InputProps={inputProps} />
        );
    }
}



export class SelectInput extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <TextField select
                fullWidth={this.props.fullwidth}
                id={this.props.id}
                label={this.props.label}
                onChange={this.props.form.handleSelectChange.bind(this.props.form, this)}
                value={this.props.form.value.hasOwnProperty(this.props.id) ? this.props.form.value[this.props.id] : ''}
                helperText={this.props.form.validity.hasOwnProperty(this.props.id) ? this.props.form.validity[this.props.id] : ''}
                error={this.props.form.validity.hasOwnProperty(this.props.id) && this.props.form.validity[this.props.id] !== ''}
                variant="standard"
            >
                {this.props.options.map((option, id) => (<MenuItem key={"option_" + id} value={option.value}>{option.name}</MenuItem>))}
            </TextField>
        );
    }
}



export class FileInput extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    onchange(e) {
        this.props.form.handleFileChange(this, e);
        this.forceUpdate();
    }

    render() {
        return (
            <Stack direction="row" spacing={2}>
                <label htmlFor="file">
                    <input style={{ display: 'none' }} multiple type="file"
                        id={this.props.id} onChange={this.onchange.bind(this)} />
                    <Button size="small" variant="contained" component="span">{this.props.label}</Button>
                </label>
                <Typography>{this.props.form.value[this.props.id]['name'] ? this.props.form.value[this.props.id]['name'] : ''}</Typography>
                <Typography color="error">{this.props.form.validity.hasOwnProperty(this.props.id) ? this.props.form.validity[this.props.id] : ''}</Typography>
            </Stack>
        );
    }
}



export class CheckboxInput extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <FormControlLabel label={this.props.label} disabled={this.props.disabled} control={<Checkbox
                id={this.props.id}
                value={this.props.value}
                onChange={this.props.form.handleCheckboxChange.bind(this.props.form, this)}
                checked={this.props.form.value.hasOwnProperty(this.props.id) && this.props.form.value[this.props.id] === this.props.value}
            />} />
        );
    }
}



export class DateInput extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <MobileDatePicker
                id={this.props.id}
                label={this.props.label}
                value={this.props.form.value.hasOwnProperty(this.props.id) ? this.props.form.value[this.props.id] : new Date()}
                onChange={this.props.form.handleDateChange.bind(this.props.form, this, this.props.id)}
                renderInput={(params) => <TextField fullWidth={this.props.fullwidth} variant="standard" {...params} />}
            />
        );
    }
}



export class AbstractForm extends AbstractHandler {
    constructor(path, method, value, infobox = []) {
        super(path, method, value);
        this.infobox = infobox;
        this.validity = {};
    }

    validate(id, value) {
        return '';
    }

    result(result, info) {
    }

    onchange(name, value) {
    }

    handle(result, info) {
        if (result === -1) reload();
        if (result >= 0) this.result(result, info);
    }

    handleTextChange(obj, e) {
        this.value[e.target.id] = e.target.value;
        this.onchange(e.target.id, e.target.value);
        obj.forceUpdate();
    }

    handleSelectChange(obj, e) {
        this.value[obj.props.id] = e.target.value;
        this.onchange(obj.props.id, e.target.value);
        obj.forceUpdate();
    }

    handleFileChange(obj, e) {
        this.value[e.target.id] = e.target.files[0];
        this.onchange(e.target.id, e.target.files[0]);
        obj.forceUpdate();
    }

    handleCheckboxChange(obj, e) {
        this.value[e.target.id] = e.target.checked ? e.target.value : '';
        this.onchange(e.target.id, e.target.checked ? e.target.value : '');
        obj.forceUpdate();
    }

    handleDateChange(obj, name, value) {
        this.value[name] = value;
        this.onchange(name, value);
        obj.forceUpdate();
    }

    presubmit() {
        let isok = true;
        for (const key in this.value) {
            this.validity[key] = this.validate(key, this.value[key]);
            if (this.validity[key] !== '') isok = false;
        }
        return isok;
    }

    sdraw() {
        return (<React.Fragment>{this.draw()}
            {this.infobox.length > 0 ? (<Box sx={{ padding: "25px" }}>{this.infobox.map((item, i) => (<div key={"infobox_" + i} align="left">{i + 1}. {item}</div>))}</Box>) : null}
        </React.Fragment>);
    }
}



export class AbstractDialog extends AbstractForm {
    constructor(path, method, value, reference, name, titlestr, submitstr, width = 35) {
        super(path, method, value);
        reference[name] = this;
        this.reference = reference;
        this.titlestr = titlestr;
        this.submitstr = submitstr;
        this.width = width;
        this.state = { mode: 0, information: '' };
    }

    handle(result, info) {
        if (result === -1) reload();
        if (result === 0) this.reset();
        if (result >= 0) this.result(result, info);
    }

    openmain() {
        this.setState({ mode: 1 });
    }

    openresult(information) {
        this.setState({ mode: 2, information: information });
    }

    close(reset = true) {
        if (reset) this.reset();
        this.setState({ mode: 0 });
    }

    options() {
        return [];
    }

    draw() {
        return (
            <React.Fragment>
                <Dialog open={this.state.mode === 1} onClose={() => { this.close(); }} maxWidth={this.width + 'vw'}>
                    <DialogTitle>{this.titlestr}</DialogTitle>
                    <DialogContent>
                        <Box component="form" noValidate autoComplete="off" sx={{ width: this.width + 'vw' }}>
                            {this.options().map((item, i) => (
                                <div align="left" key={"option_" + i}>
                                    {item}
                                    <Box sx={{ height: 20 }} />
                                </div>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { if (this.presubmit()) { this.close(false); this.submit(); } else this.forceUpdate(); }} autoFocus>{this.submitstr}</Button>
                        <Button onClick={() => { this.close(); }}>{window.lan.general.cancel}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.mode === 2} onClose={() => { this.close(); }} maxWidth='35vw'>
                    <DialogTitle>{this.titlestr}</DialogTitle>
                    <DialogContent sx={{ width: '35vw' }}><DialogContentText>{this.state.information}</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.close(); }} autoFocus>{window.lan.general.close}</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}



export default AbstractForm;