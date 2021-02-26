const dev = {
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
};

const prod = {
  dbUri: process.env.DB_URI || "mongodb://localhost:27017",
  dbName: process.env.DB_NAME,
};

const config = {
  mongoDbAtlasUri: process.env.MONGODB_ATLAS_URI,
  myApi: process.env.MY_API,
  logglySubDoming: process.env.LOGGLY_SUBDOMAIN,
  logglyFetchToken: process.env.LOGGLY_FETCH_TOKEN,
};

const all =
  process.env.NODE_ENV === "development"
    ? { ...config, ...dev }
    : { ...config, ...prod };

module.exports = { config: all };
