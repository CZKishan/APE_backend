module.exports = {
    environment: 'staging',
    port: process.env.port,
    protocol: 'http',
    TAG: "staging",
    mongo: {
        dbName: process.env.dbName,
        dbUrl: process.env.dbUrl,
    },

    swagger_port: 80,
    isStag: true,

};
