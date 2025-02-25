import { z } from "zod";

export const makeSchemaCheck = z
  .string()
  .min(1, { message: "Make is required" });

export const modelSchemaCheck = z
  .string()
  .min(1, { message: "Model is required" });

export const yearSchemaCheck = z
  .number()
  .nonnegative({ message: "Year cannot be negative" })
  .min(1500, { message: "Year must be valid" })
  .max(2025, { message: "Year must be valid" });

export const priceSchemaCheck = z
  .number()
  .positive({ message: "Price cannot be negative" });

export const imageUrlSchemaCheck = z
  .string()
  .url({ message: "Must be a valid url" })
  .optional();

export const CarFormSchema = z.object({
  make: makeSchemaCheck,
  model: modelSchemaCheck,
  manufactureYear: yearSchemaCheck,
  price: priceSchemaCheck,
  imageUrl: imageUrlSchemaCheck,
});

export type CarAddEditFormValues = z.infer<typeof CarFormSchema>;
