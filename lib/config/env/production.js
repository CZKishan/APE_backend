module.exports = {
    environment: 'production',
    port: process.env.port,
    protocol: 'http',
    TAG: "production",
    mongo: {
        dbName: process.env.dbName,
        dbUrl: process.env.dbServerUrl,
    },
    swagger_port: 80,
    isProd: true,
};
