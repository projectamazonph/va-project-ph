import { z } from "zod";

export const EmailSchema = z.object({
  email: z.string().email("Enter a valid email address.").max(254),
});

export type EmailInput = z.infer<typeof EmailSchema>;
