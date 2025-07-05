"use server";

import { z } from "zod";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: true } | undefined> {
  const { userId } = await auth();

  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  await db.insert(EventTable).values({ ...data, clerkUserId: userId });

  redirect("/events");
}

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: true } | undefined> {
  const { userId } = await auth();

  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect("/events");
}
