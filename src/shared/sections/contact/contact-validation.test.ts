import { describe, expect, it } from 'vitest'
import { contactFormSchema } from './contact-validation'

const basePayload = {
  firstName: 'Іван',
  company: 'Acme',
  email: 'ivan@example.com',
  phone: '',
  message: 'Маю запит щодо нового сайту',
  website: '',
}

describe('contactFormSchema', () => {
  it('accepts valid data with email only', () => {
    const result = contactFormSchema.safeParse(basePayload)
    expect(result.success).toBe(true)
  })

  it('requires at least email or phone', () => {
    const result = contactFormSchema.safeParse({
      ...basePayload,
      email: '',
      phone: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0])
      expect(fields).toContain('email')
      expect(fields).toContain('phone')
    }
  })

  it('accepts valid phone when email is empty', () => {
    const result = contactFormSchema.safeParse({
      ...basePayload,
      email: '',
      phone: '+380501234567',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid phone values', () => {
    const result = contactFormSchema.safeParse({
      ...basePayload,
      email: '',
      phone: '+380 12',
    })
    expect(result.success).toBe(false)
  })

  it('normalizes extra spaces in text fields', () => {
    const result = contactFormSchema.safeParse({
      ...basePayload,
      firstName: '  Іван   Петренко  ',
      company: '  Space    Dominium ',
      message: '   Дуже    хочу   редизайн    лендингу   ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.firstName).toBe('Іван Петренко')
      expect(result.data.company).toBe('Space Dominium')
      expect(result.data.message).toBe('Дуже хочу редизайн лендингу')
    }
  })
})
