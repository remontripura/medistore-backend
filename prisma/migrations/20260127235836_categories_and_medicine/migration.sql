-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "categoriId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_id_key" ON "Categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_id_key" ON "Medicine"("id");

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_categoriId_fkey" FOREIGN KEY ("categoriId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
