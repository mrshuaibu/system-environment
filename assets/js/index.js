'use strict';

// Using utility functions
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

    const osMap = {
        'Windows NT': 'Windows',
        'Mac OS X': 'MacOS',
        'Linux': 'Linux',
        'Android': 'Android',
        'like Mac OS X': 'iOS'
    };

    const osName = Object.keys(osMap).find(key => userAgent.includes(key)) || 'Unknown OS';
    osElement.innerText = `OS: ${osName}`;

    const language = navigator.language || navigator.userLanguage;
    whatLanguage.innerText = `Language: ${language}`;

    const browserMap = {
        'Chrome': 'Chrome',
        'Firefox': 'Firefox',
        'Edg': 'Edge',
        'Safari': 'Safari'
    };

    const browserName = Object.keys(browserMap).find(key => 
        userAgent.includes(key) && !(key === 'Safari' && userAgent.includes('Chrome'))
    ) || 'Unknown Browser';
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

    // Determine orientation
    const orientationMap = {
        true: 'Landscape',
        false: 'Portrait'
    };

    const orientation = orientationMap[width > height];
    orientationElement.innerText = `Orientation: ${orientation}`;
}

// Call the function on load and resize
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

// Status map
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

