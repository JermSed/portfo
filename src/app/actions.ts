"use server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { guestbook } from "~/server/db/schema";

const getString = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value : "";

export async function saveGuestbookEntry(state: unknown, formData: FormData) {
  void state;
  const local_entry_id = getString(formData.get("local_entry_id"));
  const created_by = getString(formData.get("created_by"));
  const signature = getString(formData.get("signature"));
  const hasCreatedEntryBefore = getString(formData.get("hasCreatedEntryBefore"));
  const local_created_by_id = getString(formData.get("local_created_by_id"));
  const entry = getString(formData.get("entry"));
  const body = entry.slice(0, 500);

  await db.insert(guestbook).values({
    createdBy: created_by,
    body,
    lastModified: new Date(),
    signature,
    hascreatedentrybefore: hasCreatedEntryBefore || null,
    localCreatedById: local_created_by_id || null,
    localEntryId: local_entry_id || null,
  });

  revalidatePath("/visitors");
}

export async function approveGuestbookEntry(id: string) {
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId)) return;

  await db
    .update(guestbook)
    .set({ approved: true })
    .where(eq(guestbook.id, parsedId));

  revalidatePath("/visitors");
}

export async function declineGuestbookEntry(id: string) {
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId)) return;

  await db.delete(guestbook).where(eq(guestbook.id, parsedId));

  revalidatePath("/visitors");
}
