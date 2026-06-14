-- Create HistoricalFigure table
CREATE TABLE "HistoricalFigure" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nickname" TEXT NOT NULL,
  "avatar" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Game table
CREATE TABLE "Game" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "historicalFigureId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "guessedBy" TEXT,
  "questionCount" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "Game_historicalFigureId_fkey" FOREIGN KEY ("historicalFigureId") REFERENCES "HistoricalFigure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Question table
CREATE TABLE "Question" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "gameId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "aiReply" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "Game_historicalFigureId_idx" ON "Game"("historicalFigureId");
CREATE INDEX "Question_gameId_idx" ON "Question"("gameId");
CREATE INDEX "Question_userId_idx" ON "Question"("userId");
