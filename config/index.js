const dev = {
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT,
};

const prod = {
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME,
};

const config = {
  mongoDbAtlasUri: process.env.MONGODB_ATLAS_URI,
  myApi: process.env.MY_API,
};

const all =
  process.env.NODE_ENV === 'development'
    ? { ...config, ...dev }
    : { ...config, ...prod };

module.exports = { config: all };
