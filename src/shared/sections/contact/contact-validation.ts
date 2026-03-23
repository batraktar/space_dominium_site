import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import { z } from 'zod'

export const NAME_MIN_LEN = 2
export const NAME_MAX_LEN = 80
export const COMPANY_MAX_LEN = 120
export const EMAIL_MAX_LEN = 254
export const MESSAGE_MIN_LEN = 10
export const MESSAGE_MAX_LEN = 2000
const PHONE_MIN_DIGITS = 7
const PHONE_DEFAULT_DIGITS = 3
const PHONE_ALLOWED_CHARS = /^[+\d()\-\s]+$/
const NAME_ALLOWED_CHARS = /^[\p{L}\p{M}'’\-\s]+$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CSRF_COOKIE_KEY = 'sd_csrf'
export const CSRF_HEADER_KEY = 'X-SD-CSRF'

const collapseSpaces = (value: string) => value.replace(/\s{2,}/g, ' ')

export const contactFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .transform(collapseSpaces)
      .pipe(
        z
          .string()
          .min(NAME_MIN_LEN, `Імʼя має містити щонайменше ${NAME_MIN_LEN} символи`)
          .max(NAME_MAX_LEN, `Імʼя має містити не більше ${NAME_MAX_LEN} символів`)
          .regex(NAME_ALLOWED_CHARS, 'Імʼя може містити тільки літери, пробіли, апостроф і дефіс'),
      ),
    company: z
      .string()
      .trim()
      .transform(collapseSpaces)
      .pipe(
        z
          .string()
          .max(COMPANY_MAX_LEN, `Назва компанії має містити не більше ${COMPANY_MAX_LEN} символів`),
      ),
    email: z
      .string()
      .trim()
      .pipe(
        z
          .string()
          .max(EMAIL_MAX_LEN, `Email має містити не більше ${EMAIL_MAX_LEN} символів`)
          .refine((value) => value === '' || EMAIL_REGEX.test(value), 'Некоректний email'),
      ),
    phone: z
      .string()
      .trim()
      .transform(collapseSpaces)
      .transform((value) => {
        const digits = value.replace(/\D/g, '')
        return digits.length <= PHONE_DEFAULT_DIGITS ? '' : value
      })
      .refine(
        (value) => value === '' || PHONE_ALLOWED_CHARS.test(value),
        'Телефон містить недопустимі символи',
      )
      .refine(
        (value) => value === '' || value.replace(/\D/g, '').length >= PHONE_MIN_DIGITS,
        'Некоректний номер телефону',
      )
      .refine((value) => {
        if (value === '') return true
        const parsed = parsePhoneNumberFromString(value, 'UA')
        return Boolean(parsed?.isValid())
      }, 'Некоректний номер телефону'),
    message: z
      .string()
      .trim()
      .transform(collapseSpaces)
      .pipe(
        z
          .string()
          .min(MESSAGE_MIN_LEN, `Повідомлення має містити щонайменше ${MESSAGE_MIN_LEN} символів`)
          .max(MESSAGE_MAX_LEN, `Повідомлення має містити не більше ${MESSAGE_MAX_LEN} символів`),
      ),
    website: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    const phoneDigits = values.phone.replace(/\D/g, '')
    const hasPhone = phoneDigits.length >= PHONE_MIN_DIGITS
    const hasEmail = values.email.length > 0

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Вкажіть email або телефон',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Вкажіть email або телефон',
      })
    }
  })

export type ContactFormValues = z.infer<typeof contactFormSchema>
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

export const initialContactFormValues: ContactFormValues = {
  firstName: '',
  company: '',
  email: '',
  phone: '+380 ',
  message: '',
  website: '',
}
