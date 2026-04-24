// Zod is used for data validation before sending it to the server
import * as z from "zod";

// Schema to validate the format of the email address
export const emailOtpSchema = z.object({
  email: z.string().email({ 
    message: "Please enter a valid email address (e.g., name@gmail.com)" 
  }),
});