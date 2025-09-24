-- CreateTable
CREATE TABLE "public"."_CategoryItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryItems_B_index" ON "public"."_CategoryItems"("B");

-- AddForeignKey
ALTER TABLE "public"."_CategoryItems" ADD CONSTRAINT "_CategoryItems_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."TimelineCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryItems" ADD CONSTRAINT "_CategoryItems_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TimelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "public"."_CategoryItems" ("A", "B") SELECT "categoryId", "id" FROM "public"."TimelineItem" WHERE "categoryId" IS NOT NULL;
