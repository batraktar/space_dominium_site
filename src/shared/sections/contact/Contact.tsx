import React, { useState } from 'react'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import './contact.scss'

type ContactProps = {
  formBg?: string
  inputBorder?: string
  buttonBg?: string
  textColor?: string
}

type FormValues = {
  firstName: string
  company: string
  email: string
  phone: string
  message: string
  website: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  firstName: '',
  company: '',
  email: '',
  phone: '+380 ',
  message: '',
  website: '',
}

const Contact: React.FC<ContactProps> = ({ formBg, inputBorder, buttonBg, textColor }) => {
  type ContactUsCssVars = React.CSSProperties & {
    '--contact-form-bg'?: string
    '--contact-input-border'?: string
    '--contact-button-bg'?: string
    '--contact-text-color'?: string
  }

  const cssVars: ContactUsCssVars = {
    ...(formBg ? { '--contact-form-bg': formBg } : {}),
    ...(inputBorder ? { '--contact-input-border': inputBorder } : {}),
    ...(buttonBg ? { '--contact-button-bg': buttonBg } : {}),
    ...(textColor ? { '--contact-text-color': textColor } : {}),
  }

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const firstError = Object.values(errors).find(Boolean)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const trimmedValue = value.trimStart()
      if (!trimmedValue) {
        setValues((prev) => ({ ...prev, phone: '' }))
      } else {
        const formatter = new AsYouType('UA')
        const formatted = formatter.input(value)
        setValues((prev) => ({ ...prev, phone: formatted }))
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('idle')

    if (values.website.trim()) {
      return
    }

    const nextErrors: FormErrors = {}
    const trimmedName = values.firstName.trim()
    const trimmedMessage = values.message.trim()
    const trimmedEmail = values.email.trim()
    const trimmedPhone = values.phone.trim()
    const phoneDigits = trimmedPhone.replace(/\D/g, '')
    const hasPhone = phoneDigits.length >= 7

    if (!trimmedName) nextErrors.firstName = 'Вкажіть імʼя'
    if (!trimmedMessage) nextErrors.message = 'Опишіть ваш запит'

    if (!trimmedEmail && !hasPhone) {
      nextErrors.email = 'Вкажіть email або телефон'
      nextErrors.phone = 'Вкажіть email або телефон'
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Некоректний email'
    }

    if (hasPhone) {
      const parsed = parsePhoneNumberFromString(trimmedPhone, 'UA')
      if (!parsed || !parsed.isValid()) {
        nextErrors.phone = 'Некоректний номер телефону'
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      return
    }

    setErrors({})
    setStatus('success')
    setValues(initialValues)
  }

  return (
    <div className="contact-section" id="contact">
      {status === 'error' && firstError && (
        <div className="form_toast form_toast--error" role="alert" aria-live="assertive">
          <strong>Перевірте форму</strong>
          <span>{firstError}</span>
        </div>
      )}
      <div className="contact__container">
        <div className="contact-wrapper" style={cssVars}>
          <div className="contact_block-first">
            <h1>Є проєкт? Пишіть!</h1>
            <p>
              Не любимо порожні обіцянки. Любимо конкретику. Є ідея чи проєкт? Розкажіть нам — дамо
              чесну оцінку, запропонуємо рішення та почнемо працювати над вашим успіхом.
            </p>
          </div>

          <div className="contact_block-second">
            <form className="contact_form" onSubmit={handleSubmit} noValidate>
              <h2>Почнемо співпрацю</h2>

              <div className="form_content_wrapper">
                <div className="form_content">
                  <div className="form_field">
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Імʼя"
                      value={values.firstName}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      required
                    />
                    {errors.firstName && (
                      <span className="form_error" id="firstName-error">
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="form_field">
                    <input
                      name="company"
                      type="text"
                      placeholder="Назва Компанії"
                      value={values.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form_content">
                  <div className="form_field">
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <span className="form_error" id="email-error">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="form_field">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Номер телефону"
                      value={values.phone}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <span className="form_error" id="phone-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="des_button">
                <div className="form_honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <textarea
                  name="message"
                  placeholder="Розкажіть про Ваш проєкт, або опишіть ідею"
                  rows={4}
                  value={values.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  required
                />
                {errors.message && (
                  <span className="form_error" id="message-error">
                    {errors.message}
                  </span>
                )}
                <button type="submit">Надіслати</button>
                {status === 'success' && (
                  <p className="form_success">Дякуємо! Ми звʼяжемось з вами найближчим часом.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
