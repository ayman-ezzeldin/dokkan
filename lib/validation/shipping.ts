import { z } from "zod";

export const egyptPhoneRegex = /^(?:\+?20|0)?1[0125][0-9]{8}$/;

export const shippingSchema = z.object({
  recipientName: z.string().min(5, "من فضلك أدخل الاسم الثلاثي.").max(80),
  province: z.string().min(1, "من فضلك أدخل المحافظة."),
  cityOrDistrict: z.string().min(1, "من فضلك أدخل المدينة/الحي."),
  streetInfo: z.string().min(1, "من فضلك أدخل العنوان بالتفصيل."),
  landmark: z.string().max(500).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(egyptPhoneRegex, "رقم الموبايل غير صالح. الرجاء إدخال رقم صحيح (مثال: 01012345678)."),
  phoneAlternate: z
    .string()
    .regex(egyptPhoneRegex, "رقم الموبايل غير صالح.")
    .optional()
    .or(z.literal("")),
  notesOrBooksList: z.string().max(500).optional().or(z.literal("")),
});

export type ShippingInput = z.infer<typeof shippingSchema>;


