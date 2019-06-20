const argon = require('argon2');
const os = require('os');

(async () => {
    console.log(await argon.hash('apassword' /* TEMPORARY TEMPORARY TEMPORARY */, {
        type: argon.argon2id,
        parallelism: os.cpus().length
    }));
})()