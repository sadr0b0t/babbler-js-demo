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

// - Импортируем babbler.js и виджеты напрямую из исходников,
// а не из скомпилированных/установленных модулей, чтобы можно 
// было обновлять изменения прямо на лету в окне приложения с ctrl+R.
// - Репозитории babbler-js и babbler-js-material-ui должны быть
// клонированы на одном уровне с текущим репозиторием.
// - В репозиториях babbler-js и babbler-js-material-ui нужно удалить
// или переименовать каталог node_modules, если он был там создан,
// иначе получим предупреждение о том, что в приложение загружено
// несколько копий React и неработающие виджеты MaterialUI.
// - Также в текущем проекте оставляем зависимость от модуля babbler-js -
// это нужно для виджетов babbler-material-ui, т.к. они грузят
// babbler-js как модуль внутри своего кода и мы не хотим это
// исправлять каждый раз во всех файлах во время разработки.
// В процессе работы они все равно будут иметь дело только с тем
// объектом babblerDevice, который мы туда передадим (т.е. с последней
// исправленной версией), зависимость нужна там только для некоторых 
// констант с именами событий.
// - Если разрабатываемая версия babbler-js-material-ui все-таки требует 
// последней разрабатываемой версии babbler-js, можно заменить установленный
// пакет babbler-js на локальную ссылку:
//     npm link babbler-js
// внутри самого проекта babbler-js нужно выполнить
//     npm run-script build
// чтобы исходники src/babbler.js конвертировались lib/babbler.js 
// (файлы внутри библиотеки подгружаются именно из lib, не из src)

// виджеты Babbler MaterialUI
import BabblerConnectionStatusIcon from '../../babbler-js-material-ui/src/BabblerConnectionStatusIcon';
import BabblerConnectionErrorSnackbar from '../../babbler-js-material-ui/src/BabblerConnectionErrorSnackbar';
import BabblerConnectionPanel from '../../babbler-js-material-ui/src/BabblerConnectionPanel';
import BabblerDataFlow from '../../babbler-js-material-ui/src/BabblerDataFlow';

import BabblerDebugPanel from './widgets/BabblerDebugPanel';

// Babbler.js
import BabblerDevice from '../../babbler-js/src/babbler';

const btnStyle = {
  margin: 12
};

// Управление лампочкой
var BabblerLedControlPnl = React.createClass({
// http://www.material-ui.com/#/components/raised-button
// http://www.material-ui.com/#/components/subheader

    getInitialState: function() {
        return {
            deviceStatus: this.props.babblerDevice.deviceStatus(),
            ledOn: false
        };
    },
    
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            this.setState({deviceStatus: status});
        }.bind(this);
        this.props.babblerDevice.on(BabblerDevice.Event.STATUS, this.deviceStatusListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerDevice.removeListener(BabblerDevice.Event.STATUS, this.deviceStatusListener);
    },
    
    render: function() {
        var connected = this.state.deviceStatus === BabblerDevice.Status.CONNECTED ? true : false;
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
        this.props.babblerDevice.sendCmd("ledon", [],
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
        this.props.babblerDevice.sendCmd("ledoff", [],
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
var babblerDevice1 = new BabblerDevice();

// Контент приложения
ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div>
        <Paper>
            <BabblerConnectionPanel babblerDevice={babblerDevice1}/>
            <BabblerConnectionStatusIcon 
                babblerDevice={babblerDevice1} 
                iconSize={50}
                style={{position: "absolute", right: 0, marginRight: 14, marginTop: 5}} />
        </Paper>
        
        <Divider style={{marginTop: 20, marginBottom: 20}}/>
        
        <Tabs>
            <Tab label="Лампочки" >
                <BabblerLedControlPnl babblerDevice={babblerDevice1}/>
            </Tab>
            <Tab label="Отладка" >
                <BabblerDebugPanel babblerDevice={babblerDevice1}/>
            </Tab>
            <Tab label="Лог" >
                <BabblerDataFlow 
                    babblerDevice={babblerDevice1} 
                    reverseOrder={true}
                    maxItems={10000}
                    timestamp={true}
//                    filter={{ err: false, data: false }}
//                    filter={{ data: {queue: false} }}
//                    filter={{ err: {in: false, out: false, queue: false}, data: {in: false, out: false, queue: false} }}
                    style={{margin: 20}}/>
            </Tab>
        </Tabs>
        
        <BabblerConnectionErrorSnackbar babblerDevice={babblerDevice1}/>
      </div>
    </MuiThemeProvider>,
    document.getElementById('app-content')
);

