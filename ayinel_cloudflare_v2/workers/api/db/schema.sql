CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  handle TEXT UNIQUE,
  displayName TEXT,
  bio TEXT,
  avatarUrl TEXT,
  bannerUrl TEXT,
  theme TEXT,
  musicUrl TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS studios (
  id TEXT PRIMARY KEY,
  ownerId TEXT,
  handle TEXT UNIQUE,
  name TEXT,
  about TEXT,
  bannerUrl TEXT,
  theme TEXT,
  musicUrl TEXT,
  links TEXT,
  tipsLinks TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  studioId TEXT,
  kind TEXT,
  title TEXT,
  description TEXT,
  hlsUrl TEXT,
  dashUrl TEXT,
  thumbnailUrl TEXT,
  duration INTEGER,
  visibility TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS crews (
  id TEXT PRIMARY KEY,
  userId TEXT,
  studioId TEXT,
  tier TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);
