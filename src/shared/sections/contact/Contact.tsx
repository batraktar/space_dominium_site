import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AsYouType } from 'libphonenumber-js/min'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trackFormSubmitSuccess } from '../../analytics/analytics'
import { appEnv } from '../../config/app-env'
import {
  COMPANY_MAX_LEN,
  CSRF_COOKIE_KEY,
  CSRF_HEADER_KEY,
  EMAIL_MAX_LEN,
  MESSAGE_MAX_LEN,
  MESSAGE_MIN_LEN,
  NAME_MAX_LEN,
  NAME_MIN_LEN,
  contactFormSchema,
  initialContactFormValues,
  type ContactFormErrors,
  type ContactFormValues,
} from './contact-validation'
import './contact.scss'

type ContactProps = {
  formBg?: string
  inputBorder?: string
  buttonBg?: string
  textColor?: string
}

const PENDING_CONVERSION_ID_KEY = 'sd_pending_ads_conversion_id'
const PENDING_CONVERSION_TS_KEY = 'sd_pending_ads_conversion_ts'

type ContactEndpointError = Error & {
  fields?: ContactFormErrors
}

const sourceByPath: Record<string, string> = {
  '/': 'Головна',
  '/smm': 'SMM',
  '/design': 'Design',
  '/web-develop': 'Web Development',
  '/contacts': 'Contacts',
}

const resolveFormSource = () => {
  if (typeof window === 'undefined') return 'Unknown'
  const pathname = window.location.pathname
  return sourceByPath[pathname] ?? pathname
}

const buildTelegramText = (payload: {
  source: string
  pageUrl: string
  values: ContactFormValues
}) => {
  const { source, pageUrl, values } = payload
  const now = new Date().toLocaleString('uk-UA')

  return [
    '🆕 Нова заявка з форми',
    `Розділ: ${source}`,
    `Сторінка: ${pageUrl}`,
    `Час: ${now}`,
    '',
    `Імʼя: ${values.firstName.trim() || '—'}`,
    `Компанія: ${values.company.trim() || '—'}`,
    `Email: ${values.email.trim() || '—'}`,
    `Телефон: ${values.phone.trim() || '—'}`,
    '',
    'Повідомлення:',
    values.message.trim() || '—',
  ].join('\n')
}

const parseTelegramChatIds = (raw: string) => {
  return raw
    .split(/[\s,;]+/)
    .map((value) => value.trim())
    .filter(Boolean)
}

const createConversionEventId = () => {
  const rand = Math.random().toString(36).slice(2, 10)
  return `sd_${Date.now()}_${rand}`
}

const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') return ''
  const encodedName = `${name}=`
  const chunks = document.cookie.split(';')
  for (const chunk of chunks) {
    const value = chunk.trim()
    if (!value.startsWith(encodedName)) continue
    return decodeURIComponent(value.slice(encodedName.length))
  }
  return ''
}

const createCsrfToken = () => {
  if (typeof window === 'undefined') return createConversionEventId()
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return createConversionEventId()
}

const ensureCsrfToken = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return ''
  const existing = getCookieValue(CSRF_COOKIE_KEY)
  if (existing) return existing

  const token = createCsrfToken()
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CSRF_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secureFlag}`
  return token
}

const sendViaTelegramDirect = async (text: string) => {
  const chatIds = parseTelegramChatIds(appEnv.telegramChatId)
  if (!appEnv.telegramBotToken || chatIds.length === 0) {
    throw new Error('Telegram env is not configured')
  }

  let successCount = 0
  let lastError = ''

  for (const chatId of chatIds) {
    const response = await fetch(
      `https://api.telegram.org/bot${appEnv.telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    )

    const body = (await response.json().catch(() => null)) as
      | { ok?: boolean; description?: string }
      | null
    if (response.ok && body?.ok) {
      successCount += 1
    } else {
      lastError = body?.description || `Telegram API error (${response.status})`
    }
  }

  if (successCount === 0) {
    throw new Error(lastError || 'Telegram API error')
  }
}

const sendViaServerProxy = async (payload: {
  source: string
  pageUrl: string
  values: ContactFormValues
}) => {
  const csrfToken = ensureCsrfToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (csrfToken) {
    headers[CSRF_HEADER_KEY] = csrfToken
  }

  const response = await fetch('/contact-submit.php', {
    method: 'POST',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  })

  const body = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: string; fields?: ContactFormErrors }
    | null
  if (!response.ok || !body?.ok) {
    const error = new Error(body?.error || `Contact endpoint error (${response.status})`) as ContactEndpointError
    if (body?.fields && typeof body.fields === 'object') {
      error.fields = body.fields
    }
    throw error
  }
}

const Contact: React.FC<ContactProps> = ({ formBg, inputBorder, buttonBg, textColor }) => {
  const navigate = useNavigate()

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

  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formSource = useMemo(resolveFormSource, [])

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialContactFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const firstError = [
    errors.firstName?.message,
    errors.company?.message,
    errors.email?.message,
    errors.phone?.message,
    errors.message?.message,
  ].find((message): message is string => typeof message === 'string' && message.length > 0)

  const onValidSubmit = async (values: ContactFormValues) => {
    setStatus('idle')
    setSubmitError(null)

    if (values.website.trim()) {
      return
    }

    const payload = {
      source: formSource,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      values,
    }

    try {
      const message = buildTelegramText(payload)
      if (import.meta.env.DEV && appEnv.telegramBotToken && appEnv.telegramChatId) {
        await sendViaTelegramDirect(message)
      } else {
        await sendViaServerProxy(payload)
      }

      setStatus('success')
      reset(initialContactFormValues)

      if (typeof window !== 'undefined') {
        const nowTs = Date.now()
        window.sessionStorage.setItem(PENDING_CONVERSION_ID_KEY, createConversionEventId())
        window.sessionStorage.setItem(PENDING_CONVERSION_TS_KEY, String(nowTs))
        trackFormSubmitSuccess(window.location.pathname || '/')
        window.sessionStorage.setItem('sd_thanks_access_ts', String(nowTs))
      }
      navigate('/thanks')
    } catch (error: unknown) {
      setStatus('error')
      const endpointError = error as ContactEndpointError
      if (endpointError.fields && typeof endpointError.fields === 'object') {
        for (const [field, message] of Object.entries(endpointError.fields)) {
          if (!message) continue
          setError(field as keyof ContactFormValues, { type: 'server', message })
        }
      }
      setSubmitError(error instanceof Error ? error.message : 'Не вдалося надіслати форму')
    }
  }

  const onInvalidSubmit = () => {
    setStatus('error')
    setSubmitError(null)
  }

  return (
    <div className="contact-section" id="contact">
      {status === 'error' && (firstError || submitError) && (
        <div className="form_toast form_toast--error" role="alert" aria-live="assertive">
          <strong>{firstError ? 'Перевірте форму' : 'Помилка відправки'}</strong>
          <span>{firstError || submitError}</span>
        </div>
      )}
      <div className="contact__container">
        <div className="contact-wrapper" style={cssVars}>
          <div className="contact_block-first">
            <h1>Є проєкт? Пишіть!</h1>
            <p>
              Не любимо порожні обіцянки. Любимо конкретику. Є ідея чи проєкт? Розкажіть нам - дамо
              чесну оцінку, запропонуємо рішення та почнемо працювати над вашим успіхом.
            </p>
          </div>

          <div className="contact_block-second">
            <form
              className="contact_form"
              onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
              noValidate
            >
              <h2>Почнемо співпрацю</h2>

              <div className="form_content_wrapper">
                <div className="form_content">
                  <div className="form_field">
                    <input
                      {...register('firstName')}
                      type="text"
                      placeholder="Імʼя"
                      minLength={NAME_MIN_LEN}
                      maxLength={NAME_MAX_LEN}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      required
                    />
                    {errors.firstName?.message ? (
                      <span className="form_error" id="firstName-error">
                        {errors.firstName.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="form_field">
                    <input
                      {...register('company')}
                      type="text"
                      placeholder="Назва Компанії"
                      maxLength={COMPANY_MAX_LEN}
                      aria-invalid={Boolean(errors.company)}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                    />
                    {errors.company?.message ? (
                      <span className="form_error" id="company-error">
                        {errors.company.message}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form_content">
                  <div className="form_field">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      maxLength={EMAIL_MAX_LEN}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email?.message ? (
                      <span className="form_error" id="email-error">
                        {errors.email.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="form_field">
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="tel"
                          placeholder="Номер телефону"
                          value={field.value}
                          onChange={(event) => {
                            const input = event.target.value
                            const trimmedValue = input.trimStart()
                            if (!trimmedValue) {
                              field.onChange('')
                              return
                            }
                            const formatter = new AsYouType('UA')
                            field.onChange(formatter.input(input))
                          }}
                          maxLength={25}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                      )}
                    />
                    {errors.phone?.message ? (
                      <span className="form_error" id="phone-error">
                        {errors.phone.message}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="des_button">
                <div className="form_honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input
                      {...register('website')}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <textarea
                  {...register('message')}
                  placeholder="Розкажіть про Ваш проєкт, або опишіть ідею"
                  rows={4}
                  minLength={MESSAGE_MIN_LEN}
                  maxLength={MESSAGE_MAX_LEN}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  required
                />
                {errors.message?.message ? (
                  <span className="form_error" id="message-error">
                    {errors.message.message}
                  </span>
                ) : null}
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Надсилаємо…' : 'Надіслати'}
                </button>
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
