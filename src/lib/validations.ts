import { z } from "zod";

// Lithuanian phone number regex: +370XXXXXXXX or 8XXXXXXXX
const lithuanianPhoneRegex = /^(\+370|8)[0-9]{8}$/;

// Registration form validation schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "El. paštas privalomas")
    .email("Neteisingas el. pašto formatas"),
  password: z
    .string()
    .min(8, "Slaptažodis turi būti bent 8 simbolių")
    .regex(/[A-Z]/, "Slaptažodyje turi būti bent viena didžioji raidė")
    .regex(/[a-z]/, "Slaptažodyje turi būti bent viena mažoji raidė")
    .regex(/[0-9]/, "Slaptažodyje turi būti bent vienas skaičius"),
  confirmPassword: z.string().min(1, "Pakartokite slaptažodį"),
  firstName: z
    .string()
    .min(1, "Vardas privalomas")
    .min(2, "Vardas turi būti bent 2 simbolių")
    .max(100, "Vardas per ilgas"),
  lastName: z
    .string()
    .min(1, "Pavardė privaloma")
    .min(2, "Pavardė turi būti bent 2 simbolių")
    .max(100, "Pavardė per ilga"),
  phone: z
    .string()
    .min(1, "Telefonas privalomas")
    .regex(
      lithuanianPhoneRegex,
      "Neteisingas telefono formatas. Naudokite +370XXXXXXXX arba 8XXXXXXXX"
    ),
  company: z
    .string()
    .max(255, "Įmonės pavadinimas per ilgas")
    .optional()
    .or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"],
});

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El. paštas privalomas")
    .email("Neteisingas el. pašto formatas"),
  password: z.string().min(1, "Slaptažodis privalomas"),
});

// Type inference from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Helper function to format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Convert 8XXXXXXXX to +370XXXXXXXX
  if (cleaned.startsWith("8") && cleaned.length === 9) {
    return "+370" + cleaned.substring(1);
  }

  return cleaned;
}

// Validate phone number
export function isValidLithuanianPhone(phone: string): boolean {
  return lithuanianPhoneRegex.test(phone);
}
