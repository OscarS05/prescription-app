-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "doctor_signature_id" TEXT;

-- CreateTable
CREATE TABLE "doctor_signatures" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "doctor_signatures_doctor_id_idx" ON "doctor_signatures"("doctor_id");

-- AddForeignKey
ALTER TABLE "doctor_signatures" ADD CONSTRAINT "doctor_signatures_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_signature_id_fkey" FOREIGN KEY ("doctor_signature_id") REFERENCES "doctor_signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
