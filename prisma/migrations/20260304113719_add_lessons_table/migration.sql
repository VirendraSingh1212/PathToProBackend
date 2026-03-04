-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "video_url" TEXT,
    "duration" INTEGER,
    "position" INTEGER NOT NULL,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
