-- CreateTable
CREATE TABLE "Model3D" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Model3D_pkey" PRIMARY KEY ("id")
);
