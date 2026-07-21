CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tech" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "githubUrl" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);
