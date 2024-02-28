import { z } from "zod"

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const formSchema = z.object({ 
	email: z.string().email(), 
	name: z.string(),
	phone: z.string().regex(phoneRegex, 'Invalid Number'),
})

export type FormSchema = z.infer<typeof formSchema>