/*
  Warnings:

  - The primary key for the `AvatarToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AvatarToUser" (
    "avatarId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "AvatarToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AvatarToUser_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AvatarToUser" ("avatarId", "userId") SELECT "avatarId", "userId" FROM "AvatarToUser";
DROP TABLE "AvatarToUser";
ALTER TABLE "new_AvatarToUser" RENAME TO "AvatarToUser";
CREATE INDEX "AvatarToUser_userId_idx" ON "AvatarToUser"("userId");
CREATE UNIQUE INDEX "AvatarToUser_userId_avatarId_key" ON "AvatarToUser"("userId", "avatarId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
