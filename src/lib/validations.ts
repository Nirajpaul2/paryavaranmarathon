import { z } from "zod";

export const RegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters")
    .trim(),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const birthDate = new Date(val);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return age >= 12 && age <= 99;
    }, "Participants must be at least 12 years of age"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  city: z.string().min(2, "City is required").max(100).trim(),
  state: z.string().min(2, "State is required").max(100).trim(),
  emergencyName: z
    .string()
    .min(2, "Emergency contact name is required")
    .max(100)
    .trim(),
  emergencyMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit emergency contact number")
    .trim(),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"])
    .optional(),
  runningExp: z
    .enum([
      "First-time 5K runner",
      "Casual runner (5K)",
      "Seasoned 5K runner",
      "First-time 10K runner",
      "Casual runner (5K-10K)",
      "Seasoned 10K runner",
      "Half Marathon / Marathon runner",
    ])
    .optional(),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export const PaymentSubmissionSchema = z.object({
  registrationId: z.string().min(1, "Registration ID is required"),
  transactionId: z
    .string()
    .min(6, "Transaction/UTR reference ID must be at least 6 characters")
    .max(50, "Transaction/UTR reference ID is too long")
    .trim(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const PaymentVerificationSchema = z.object({
  registrationId: z.string().min(1, "Registration ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().optional(),
}).refine((data) => {
  if (data.action === "REJECT" && (!data.rejectionReason || data.rejectionReason.trim().length < 3)) {
    return false;
  }
  return true;
}, {
  message: "Rejection reason is mandatory when rejecting a payment (minimum 3 characters)",
  path: ["rejectionReason"],
});

export const EventSettingsSchema = z.object({
  eventName: z.string().min(3).max(150),
  eventTagline: z.string().min(3).max(250),
  eventDate: z.string().min(3).max(100),
  eventTime: z.string().min(2).max(50),
  reportingTime: z.string().min(2).max(50),
  venue: z.string().min(3).max(250),
  registrationFee: z.coerce.number().min(0).max(100000),
  registrationDeadline: z.string().datetime().or(z.string().min(10)),
  participantCapacity: z.coerce.number().min(10).max(100000),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8),
  organizerName: z.string().min(2),
  phonePeUpiId: z.string().min(3),
  bibPrefix: z.string().min(1).max(10),
  regPrefix: z.string().min(1).max(10),
});
