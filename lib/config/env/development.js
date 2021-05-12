module.exports = {
    environment: 'development',
    port: process.env.port,
    protocol: 'http',
    TAG: "development",
    mongo: {
        dbName: process.env.dbName,
        dbUrl: process.env.dbUrl,
        options: {
        }
    },

    isDev: true
};
