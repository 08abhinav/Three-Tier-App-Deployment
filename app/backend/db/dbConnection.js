let pool;

export const setDB = (dbInstance) => {
  pool = dbInstance;
};

export const getDB = () => {
  if (!pool) throw new Error("DB not initialized");
  return pool;
};
