import { z } from "zod";

export const updateProgressSchema = z.object({
    body: z.object({
        last_position_seconds: z.number().min(0).optional(),
        is_completed: z.boolean().optional(),
    }),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>["body"];
