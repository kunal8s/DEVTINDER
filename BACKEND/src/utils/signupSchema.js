const { z } = require("zod");

const signupSchema = z.object({
    username: z.string().min(3, "Username must be atleast 3 charecter long").max(20),
    email: z.string().email("Enter the valid email."),
    Password: z.string().min(6, "Password length must be atleast 6"),
    Age: z.number().min(18, "You must be atleast 18 years old").max(120).optional()
});

module.exports = { signupSchema };