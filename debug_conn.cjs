const net = require('net');

const host = 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
const ports = [4000, 3306];

ports.forEach(port => {
    const socket = new net.Socket();
    socket.setTimeout(5000);

    console.log(`Checking connection to ${host}:${port}...`);

    socket.on('connect', () => {
        console.log(`[SUCCESS] Connected to ${host}:${port}`);
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.log(`[TIMEOUT] Connection to ${host}:${port} timed out`);
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.log(`[ERROR] Connection to ${host}:${port} failed: ${err.message}`);
    });
});
