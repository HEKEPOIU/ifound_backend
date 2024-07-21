import { checkSchema } from "express-validator";

function ContainsUpperLowerDigit(value: string) {
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
};
const registerUserCheck = checkSchema({
    Account: {
        notEmpty: true,
        isEmail: {
            errorMessage: "Account most a Email"
        },
        trim: true,
    },
    Password: {
        isLength: {
            options: { min: 8 },
            errorMessage: "Password length must more then 8."
        },
        custom: {
            options: ContainsUpperLowerDigit,
            errorMessage: "Password must mix Upper/Lower case and Digit."
        },
        trim: true,
    }
});

export { registerUserCheck };
