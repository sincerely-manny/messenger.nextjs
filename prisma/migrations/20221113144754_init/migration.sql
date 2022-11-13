-- CreateTable
CREATE TABLE "AvatarToUser" (
    "userId" INTEGER NOT NULL,
    "avatarId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "avatarId"),
    CONSTRAINT "AvatarToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AvatarToUser_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
