// react-app-ui.js

var React = require('react');
var ReactDOM = require('react-dom');

// виджеты MaterialUI
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';

import RaisedButton from 'material-ui/RaisedButton';

import FontIcon from 'material-ui/FontIcon';
import {red200, green200} from 'material-ui/styles/colors';

import Subheader from 'material-ui/Subheader';

// виджеты Babbler MaterialUI
//var BabblerConnectionStatusIcon = require('babbler-js-material-ui').BabblerConnectionStatusIcon;
//var BabblerConnectionErrorSnackbar = require('babbler-js-material-ui').BabblerConnectionErrorSnackbar;
//var BabblerConnectionPanel = require('babbler-js-material-ui').BabblerConnectionPanel;
//var BabblerDataFlow = require('babbler-js-material-ui').BabblerDataFlow;

import BabblerConnectionStatusIcon from 'babbler-js-material-ui/lib/BabblerConnectionStatusIcon';
import BabblerConnectionErrorSnackbar from 'babbler-js-material-ui/lib/BabblerConnectionErrorSnackbar';
import BabblerConnectionPanel from 'babbler-js-material-ui/lib/BabblerConnectionPanel';
import BabblerDataFlow from 'babbler-js-material-ui/lib/BabblerDataFlow';
import BabblerDebugPanel from 'babbler-js-material-ui/lib/BabblerDebugPanel';

// Babbler.js
import Babbler from 'babbler-js';

const btnStyle = {
  margin: 12
};

// Управление лампочкой
var BabblerLedControlPnl = React.createClass({
// http://www.material-ui.com/#/components/raised-button
// http://www.material-ui.com/#/components/subheader

    getInitialState: function() {
        return {
            deviceStatus: this.props.babbler.deviceStatus,
            ledOn: false
        };
    },
    
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            this.setState({deviceStatus: status});
        }.bind(this);
        this.stickedPropListener = function(prop, err, val) {
            if(prop === "ledstatus") {
                this.setState({ledOn: (val == 'on' ? true : false)});
            }
        }.bind(this);
        
        this.props.babbler.on(Babbler.Event.STATUS, this.deviceStatusListener);
        this.props.babbler.on(Babbler.Event.PROP, this.stickedPropListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babbler.removeListener(Babbler.Event.STATUS, this.deviceStatusListener);
    },
    
    render: function() {
        var connected = this.state.deviceStatus === Babbler.Status.CONNECTED ? true : false;
        return (
            <div style={{textAlign: "center"}}>
                <div>
                    <RaisedButton label="Включить лампочку" onClick={this.cmdLedon} disabled={!connected} style={btnStyle} />
                    <RaisedButton label="Выключить лампочку" onClick={this.cmdLedoff} disabled={!connected} style={btnStyle} />
                </div>
                
                <FontIcon 
                    className="material-icons" 
                    style={{fontSize: 160, marginTop: 40}}
                    color={(this.state.ledOn ? green200 : red200)}
                >{(this.state.ledOn ? "sentiment_very_satisfied" : "sentiment_very_dissatisfied")}</FontIcon>
                     
            </div>
        );
    },
    
    cmdLedon: function() {
        this.props.babbler.sendCmd("ledon", [],
            // onResult
            function(err, reply, cmd, params) {
                if(err) {
                    console.log(cmd + (params.length > 0 ? " " + params : "") + ": " + err);
                } else if(reply != 'ok') {
                    console.log(cmd + (params.length > 0 ? " " + params : "") + ": " + reply);
                } else { // reply == 'ok'
                    this.setState({ledOn: true});
                }
            }.bind(this)
        );
    }, 
    
    cmdLedoff: function() {
        this.props.babbler.sendCmd("ledoff", [],
            // onResult
            function(err, reply, cmd, params) {
                if(err) {
                    console.log(cmd + (params.length > 0 ? " " + params : "") + ": " + err);
                } else if(reply != 'ok') {
                    console.log(cmd + (params.length > 0 ? " " + params : "") + ": " + reply);
                } else { // reply == 'ok'
                    this.setState({ledOn: false});
                }
            }.bind(this)
        );
    }
});

// Устройство Babbler, подключенное к последовательному порту
var babbler1 = new Babbler();
babbler1.stickProp("ledstatus", "ledstatus", [], 2000);


// Контент приложения
ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div>
        <Paper>
            <BabblerConnectionPanel babbler={babbler1}/>
            <BabblerConnectionStatusIcon 
                babbler={babbler1} 
                iconSize={50}
                style={{position: "absolute", right: 0, marginRight: 14, marginTop: 5}} />
        </Paper>
        
        <Divider style={{marginTop: 20, marginBottom: 20}}/>
        
        <Tabs>
            <Tab label="Лампочки" >
                <BabblerLedControlPnl babbler={babbler1}/>
            </Tab>
            <Tab label="Отладка" >
                <BabblerDebugPanel babbler={babbler1}
//                    filter={{ err: false, data: false }}
//                    filter={{ data: {queue: false} }}
//                    filter={{ err: {in: false, out: false, queue: false}, data: {in: false, out: false, queue: false} }}
//                    filter={{ data: {content: ['"cmd":"ping"']} }}
                    filter={{ data: {content: ['"cmd":"ledstatus"']} }}
                />
            </Tab>
            <Tab label="Лог" >
                <BabblerDataFlow 
                    babbler={babbler1} 
                    reverseOrder={true}
                    maxItems={10000}
                    timestamp={true}
//                    filter={{ err: false, data: false }}
//                    filter={{ data: {queue: false} }}
//                    filter={{ err: {in: false, out: false, queue: false}, data: {in: false, out: false, queue: false} }}
//                    filter={{ data: {content: ['"cmd":"ping"']} }}
//                    filter={{ data: {content: ['"cmd":"ledstatus"']} }}
                    style={{margin: 20}}/>
            </Tab>
        </Tabs>
        
        <BabblerConnectionErrorSnackbar babbler={babbler1}/>
      </div>
    </MuiThemeProvider>,
    document.getElementById('app-content')
);

