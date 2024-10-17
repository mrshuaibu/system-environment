'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

/******************/
/*System*/
/******************/
const osElement = select('.os');
const whatLanguage = select('.what-language');
const whatBrowser = select('.what-browser');

function getSystemInfo() {
    const userAgent = navigator.userAgent;

    let osName = 'Unknown OS';
    switch (true) {
        case userAgent.includes('Windows NT'):
            osName = 'Windows';
            break;
        case userAgent.includes('Mac OS X'):
            osName = 'MacOS';
            break;
        case userAgent.includes('Linux'):
            osName = 'Linux';
            break;
        case userAgent.includes('Android'):
            osName = 'Android';
            break;
        case userAgent.includes('like Mac OS X'):
            osName = 'iOS';
            break;
    }
    osElement.innerText = `OS: ${osName}`;

    const language = navigator.language || navigator.userLanguage;
    whatLanguage.innerText = `Language: ${language}`;

    let browserName = 'Unknown Browser';
    switch (true) {
        case userAgent.includes('Chrome') && !userAgent.includes('Edg'):
            browserName = 'Chrome';
            break;
        case userAgent.includes('Firefox'):
            browserName = 'Firefox';
            break;
        case userAgent.includes('Edg'):
            browserName = 'Edge';
            break;
        case userAgent.includes('Safari') && !userAgent.includes('Chrome'):
            browserName = 'Safari';
            break;
    }
    whatBrowser.innerText = `Browser: ${browserName}`;
}

listen('load', window, getSystemInfo);

/******************/
/*window*/
/******************/
const pageWidth = select('.page-width');
const pageHeight = select('.page-height');
const orientationElement = select('.orientation');

function updateWindowInfo() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    pageWidth.innerText = `Width: ${width}px`;
    pageHeight.innerText = `Height: ${height}px`;

    const orientationMap = {
        true: 'Landscape',
        false: 'Portrait'
    };

    const orientation = orientationMap[width > height];
    orientationElement.innerText = `Orientation: ${orientation}`;
}

listen('load', window, updateWindowInfo);
listen('resize', window, updateWindowInfo);

/******************/
/*Battery*/
/******************/
const batteryLevelElement = select('.battery-level');
const batteryStatusElement = select('.battery-status');

function getBatteryInfo() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryInfo(battery);

            battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
            battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
        });
    } else {
        batteryLevelElement.innerText = 'Battery information not available';
        batteryStatusElement.innerText = 'Battery information not available';
    }
}

function updateBatteryInfo(battery) {
    const batteryLevel = Math.round(battery.level * 100); 
    const isCharging = battery.charging ? 'Charging' : 'Not Charging';

    batteryLevelElement.innerText = `Battery Level: ${batteryLevel}%`;
    batteryStatusElement.innerText = `Status: ${isCharging}`;
}

listen('load', window, getBatteryInfo);

const onlineStatusElement = select('.button');

const statusMap = {
    true: 'ONLINE',
    false: 'OFFLINE'
};

function updateOnlineStatus() {
    onlineStatusElement.innerText = statusMap[navigator.onLine];
}

listen('online', window, updateOnlineStatus);
listen('offline', window, updateOnlineStatus);

listen('load', window, updateOnlineStatus);

