const dns = require('dns');
const fs = require('fs');

const srv = '_mongodb._tcp.blooddonation30.bzmicim.mongodb.net';
const logFile = 'resolved_hosts.txt';

// Create a custom resolver to use Google DNS
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8']);

console.log('Resolving SRV for:', srv);

resolver.resolveSrv(srv, (err, addresses) => {
    if (err) {
        const msg = 'Resolution failed: ' + err.message;
        console.error(msg);
        fs.writeFileSync(logFile, msg);
        process.exit(1);
    }

    let content = 'Resolved addresses:\n';
    addresses.forEach(a => {
        content += `${a.name}:${a.port}\n`;
    });

    // Also try to find the replica set name
    resolver.resolveTxt('blooddonation30.bzmicim.mongodb.net', (err, records) => {
        if (err) {
            content += 'TXT resolution failed/missing: ' + err.message + '\n';
        } else {
            const txt = records.flat().join('');
            content += 'TXT records: ' + txt + '\n';
            // Parse replicaSet from TXT if possible (often looks like "authSource=admin&replicaSet=atlas-xxx-shard-0")
            const match = txt.match(/replicaSet=([^&]+)/);
            if (match) {
                content += 'ReplicaSet: ' + match[1] + '\n';
            }
        }

        fs.writeFileSync(logFile, content);
        console.log('Results written to', logFile);
    });
});
