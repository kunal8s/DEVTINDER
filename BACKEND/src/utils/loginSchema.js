const { z } = require("zod");

const loginSchema = z.object({
    email: z.string().email("Enter the valid email."),
    Password: z.string().min(6, "Password length must be atleast 6")
});

module.exports = { loginSchema };