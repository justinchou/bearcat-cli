'use strict';

const Path    = require('path');
const bearcat = require('bearcatjs');

let configPaths = [require.resolve('./context.json')];
bearcat.createApp(configPaths, {
    // NODE_ENV: '',
    // BEARCAT_ENV: '',
    // NODE_CPATH: '',
    // BEARCAT_CPATH: '',
    // BEARCAT_LOGGER: 'on',
    BEARCAT_HOT: 'on',
    BEARCAT_HPATH: Path.join(__dirname, '/hot'),
    // BEARCAT_ANNOTATION: 'on',
    BEARCAT_GLOBAL: true
});

bearcat.on('reload', function () {
    // console.log('reload occured...');
});

bearcat.start(function () {
    // console.log('bearcat ioc container started...');

    let car = bearcat.getBean('car', '辽B345230');
    car.run();

    console.log();

    let bus = bearcat.getBean('bus');
    bus.run();

    console.log();

    let moto = bearcat.getBean('moto', '辽A374913');
    moto.run();

    console.log();

    let truck = bearcat.getBean('truck');
    truck.run();

    console.log();
    console.log();
    console.log();

    let producer = bearcat.getBean('producer');
    producer.produceCan('fish', (err, data) => {
        console.log('Caller CB [ %j ] err:', data, err);
    });
});