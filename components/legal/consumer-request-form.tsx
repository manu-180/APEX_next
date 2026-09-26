'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import type { TipoSolicitud } from '@/lib/legal/config'
import {
  LIMITES,
  MENSAJES,
  enviarSolicitud,
  validarSolicitud,
  type Campo,
  type Canal,
  type DatosSolicitud,
  type Errores,
} from '@/lib/legal/solicitud'
import { mensajeWhatsApp } from '@/lib/legal/whatsapp'
import { CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { CopyIcon } from '@/components/legal/iconos'
import { BOTON_TINTA, FOCO } from '@/components/legal/estilos'

const TEXTOS: Record<
  TipoSolicitud,
  { referenciaHint: string; enviar: string; enviando: string; listo: string }
> = {
  arrepentimiento: {
    referenciaHint: 'El plan o el nombre de tu página. Nos ayuda a encontrarte más rápido.',
    enviar: 'Enviar arrepentimiento',
    enviando: 'Enviando tu arrepentimiento…',
    listo: 'Recibimos tu arrepentimiento',
  },
  baja: {
    referenciaHint: 'Por ejemplo: mantenimiento, marketing en Google o el nombre de tu página.',
    enviar: 'Pedir la baja',
    enviando: 'Enviando tu pedido de baja…',
    listo: 'Recibimos tu pedido de baja',
  },
}

const ERROR_SISTEMA: Record<'red' | 'no_disponible' | 'demasiados', string> = {
  red: 'No pudimos enviar tu pedido porque se cortó la conexión. Probá de nuevo en un momento.',
  no_disponible: 'No pudimos registrar tu pedido desde la web en este momento.',
  demasiados: 'Ya recibimos varios pedidos desde esta conexión. Probá de nuevo en un rato.',
}

const ORDEN_CAMPOS: Campo[] = ['nombre', 'contacto', 'referencia', 'detalle']

const INICIAL: DatosSolicitud = { nombre: '', canal: 'whatsapp', contacto: '', referencia: '', detalle: '' }

const CAMPO = cn(
  'w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 text-base text-[var(--color-on-surface)] md:text-sm',
  'placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_55%,transparent)]',
  'transition-[border-color,background-color] duration-200 ease-out',
  'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[rgba(var(--color-primary-rgb),0.6)]',
)
const CAMPO_OK = 'border-[rgba(11,15,26,0.16)] hover:border-[rgba(11,15,26,0.28)] dark:border-[var(--color-surface-high)] dark:hover:border-[var(--color-surface-highest)] focus:border-[rgba(var(--color-primary-rgb),0.55)]'
const CAMPO_ERROR = 'border-red-600/70 dark:border-red-400/70'
const LABEL = 'block text-sm font-medium text-[var(--color-on-surface)]'
const AYUDA = 'mt-1.5 text-xs leading-relaxed text-[var(--color-on-surface-variant)]'
const TEXTO_ERROR = 'mt-1.5 text-xs font-medium leading-relaxed text-red-600 dark:text-red-400'

export function ConsumerRequestForm({ tipo }: { tipo: TipoSolicitud }) {
  const t = TEXTOS[tipo]
  const id = useId()
  const [datos, setDatos] = useState<DatosSolicitud>(INICIAL)
  const [errores, setErrores] = useState<Errores>({})
  const [intentado, setIntentado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [fallo, setFallo] = useState<keyof typeof ERROR_SISTEMA | null>(null)
  const [codigo, setCodigo] = useState<string | null>(null)
  const [canalConfirmado, setCanalConfirmado] = useState<Canal>('whatsapp')

  const refs: Record<Campo, RefObject<HTMLInputElement | HTMLTextAreaElement>> = {
    nombre: useRef<HTMLInputElement>(null),
    contacto: useRef<HTMLInputElement>(null),
    referencia: useRef<HTMLInputElement>(null),
    detalle: useRef<HTMLTextAreaElement>(null),
  }
  const trampa = useRef<HTMLInputElement>(null)

  function actualizar<K extends keyof DatosSolicitud>(campo: K, valor: DatosSolicitud[K]) {
    const siguiente = { ...datos, [campo]: valor }
    if (campo === 'canal') siguiente.contacto = ''
    setDatos(siguiente)
    if (fallo) setFallo(null)
    if (intentado) setErrores(validarSolicitud(siguiente))
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (enviando) return
    if (trampa.current?.value) return

    const encontrados = validarSolicitud(datos)
    setErrores(encontrados)
    setIntentado(true)
    const primero = ORDEN_CAMPOS.find((c) => encontrados[c])
    if (primero) {
      refs[primero].current?.focus()
      return
    }

    setEnviando(true)
    setFallo(null)
    const resultado = await enviarSolicitud(tipo, datos)
    setEnviando(false)
    if (resultado.ok) {
      setCanalConfirmado(datos.canal)
      setCodigo(resultado.codigo)
    } else if (resultado.motivo === 'campo') {
      setErrores({ [resultado.campo]: MENSAJES[resultado.campo] })
      refs[resultado.campo].current?.focus()
    } else {
      setFallo(resultado.motivo)
    }
  }

  if (codigo) {
    return <Confirmacion titulo={t.listo} codigo={codigo} canal={canalConfirmado} />
  }

  const campoId = (c: string) => `${id}-${c}`
  const describir = (c: Campo, conAyuda: boolean) =>
    [conAyuda ? campoId(`${c}-ayuda`) : null, errores[c] ? campoId(`${c}-error`) : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <form onSubmit={enviar} noValidate className="grid gap-6" aria-busy={enviando || undefined}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={campoId('empresa')}>Empresa</label>
        <input ref={trampa} id={campoId('empresa')} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={campoId('nombre')} className={LABEL}>
          Nombre y apellido
        </label>
        <input
          ref={refs.nombre as RefObject<HTMLInputElement>}
          id={campoId('nombre')}
          name="nombre"
          type="text"
          autoComplete="name"
          maxLength={LIMITES.nombre}
          value={datos.nombre}
          onChange={(e) => actualizar('nombre', e.target.value)}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={describir('nombre', false)}
          className={cn(CAMPO, 'mt-2 h-12', errores.nombre ? CAMPO_ERROR : CAMPO_OK)}
        />
        {errores.nombre && (
          <p id={campoId('nombre-error')} className={TEXTO_ERROR}>
            {errores.nombre}
          </p>
        )}
      </div>

      <fieldset>
        <legend className={LABEL}>¿Dónde te respondemos?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(['whatsapp', 'mail'] as const).map((canal) => (
            <label key={canal} className="relative cursor-pointer">
              <input
                type="radio"
                name={campoId('canal')}
                value={canal}
                checked={datos.canal === canal}
                onChange={() => actualizar('canal', canal)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex h-11 items-center justify-center rounded-xl border text-sm font-semibold',
                  'transition-[border-color,background-color,color,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none',
                  'border-[rgba(11,15,26,0.16)] text-[var(--color-on-surface-variant)] dark:border-[var(--color-surface-high)]',
                  'hover:text-[var(--color-on-surface)]',
                  'peer-checked:border-[rgba(var(--color-primary-rgb),0.55)] peer-checked:bg-[rgba(var(--color-primary-rgb),0.1)] peer-checked:text-[var(--color-on-surface)]',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgba(var(--color-primary-rgb),0.6)]',
                )}
              >
                {canal === 'whatsapp' ? 'WhatsApp' : 'Mail'}
              </span>
            </label>
          ))}
        </div>

        <label htmlFor={campoId('contacto')} className="sr-only">
          {datos.canal === 'whatsapp' ? 'Tu número de WhatsApp' : 'Tu mail'}
        </label>
        <input
          ref={refs.contacto as RefObject<HTMLInputElement>}
          id={campoId('contacto')}
          name="contacto"
          type={datos.canal === 'whatsapp' ? 'tel' : 'email'}
          inputMode={datos.canal === 'whatsapp' ? 'tel' : 'email'}
          autoComplete={datos.canal === 'whatsapp' ? 'tel' : 'email'}
          autoCapitalize="none"
          spellCheck={false}
          maxLength={LIMITES.contacto}
          placeholder={datos.canal === 'whatsapp' ? '11 2345 6789' : 'nombre@gmail.com'}
          value={datos.contacto}
          onChange={(e) => actualizar('contacto', e.target.value)}
          aria-invalid={errores.contacto ? true : undefined}
          aria-describedby={describir('contacto', true)}
          className={cn(CAMPO, 'mt-3 h-12', errores.contacto ? CAMPO_ERROR : CAMPO_OK)}
        />
        <p id={campoId('contacto-ayuda')} className={AYUDA}>
          {datos.canal === 'whatsapp'
            ? 'Con código de área. Te escribimos a este número.'
            : 'Te escribimos a esta dirección.'}
        </p>
        {errores.contacto && (
          <p id={campoId('contacto-error')} className={TEXTO_ERROR}>
            {errores.contacto}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={campoId('referencia')} className={LABEL}>
          ¿Qué contrataste? <span className="font-normal text-[var(--color-on-surface-variant)]">(opcional)</span>
        </label>
        <input
          ref={refs.referencia as RefObject<HTMLInputElement>}
          id={campoId('referencia')}
          name="referencia"
          type="text"
          maxLength={LIMITES.referencia}
          value={datos.referencia}
          onChange={(e) => actualizar('referencia', e.target.value)}
          aria-invalid={errores.referencia ? true : undefined}
          aria-describedby={describir('referencia', true)}
          className={cn(CAMPO, 'mt-2 h-12', errores.referencia ? CAMPO_ERROR : CAMPO_OK)}
        />
        <p id={campoId('referencia-ayuda')} className={AYUDA}>
          {t.referenciaHint}
        </p>
        {errores.referencia && (
          <p id={campoId('referencia-error')} className={TEXTO_ERROR}>
            {errores.referencia}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={campoId('detalle')} className={LABEL}>
          ¿Querés contarnos algo más?{' '}
          <span className="font-normal text-[var(--color-on-surface-variant)]">(opcional)</span>
        </label>
        <textarea
          ref={refs.detalle as RefObject<HTMLTextAreaElement>}
          id={campoId('detalle')}
          name="detalle"
          rows={3}
          maxLength={LIMITES.detalle}
          value={datos.detalle}
          onChange={(e) => actualizar('detalle', e.target.value)}
          aria-invalid={errores.detalle ? true : undefined}
          aria-describedby={describir('detalle', false)}
          className={cn(CAMPO, 'mt-2 resize-y py-3', errores.detalle ? CAMPO_ERROR : CAMPO_OK)}
        />
        {errores.detalle && (
          <p id={campoId('detalle-error')} className={TEXTO_ERROR}>
            {errores.detalle}
          </p>
        )}
      </div>

      {fallo && (
        <div
          role="alert"
          className="rounded-xl border border-red-600/30 bg-red-600/[0.06] p-4 text-sm leading-relaxed text-[var(--color-on-surface)] dark:border-red-400/30 dark:bg-red-400/[0.07]"
        >
          <p className="font-semibold">{ERROR_SISTEMA[fallo]}</p>
          <p className="mt-1 text-[var(--color-on-surface-variant)]">
            También lo podés mandar por WhatsApp, con tus datos ya escritos.
          </p>
          <a
            href={whatsappUrl(mensajeWhatsApp(tipo, datos))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mt-3 inline-flex items-center gap-2 font-semibold text-[var(--color-on-surface)] underline decoration-[rgba(var(--color-primary-rgb),0.5)] underline-offset-4 hover:decoration-[var(--color-primary)] focus-visible:rounded',
              FOCO,
            )}
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Mandarlo por WhatsApp
          </a>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={enviando}
          className={cn(BOTON_TINTA, 'disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0')}
        >
          {enviando ? t.enviando : t.enviar}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-on-surface-variant)]">
          No tenés que registrarte ni crear una cuenta. Usamos tus datos solo para responder este pedido.
        </p>
      </div>
    </form>
  )
}

function Confirmacion({ titulo, codigo, canal }: { titulo: string; codigo: string; canal: Canal }) {
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const codigoRef = useRef<HTMLParagraphElement>(null)
  const [copia, setCopia] = useState<'nada' | 'copiado' | 'manual'>('nada')

  useEffect(() => {
    tituloRef.current?.focus()
  }, [])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopia('copiado')
    } catch (err) {
      console.warn('[apex:consumidor] el navegador no dejó copiar el código', err)
      const nodo = codigoRef.current
      const seleccion = window.getSelection()
      if (nodo && seleccion) {
        const rango = document.createRange()
        rango.selectNodeContents(nodo)
        seleccion.removeAllRanges()
        seleccion.addRange(rango)
      }
      setCopia('manual')
    }
  }

  return (
    <div role="status" aria-live="polite">
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]">
        <CheckIcon className="size-5" />
      </span>
      <h2
        ref={tituloRef}
        tabIndex={-1}
        className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-[var(--color-on-surface)] outline-none"
      >
        {titulo}
      </h2>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
        Tu código de pedido
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p
          ref={codigoRef}
          className="select-all rounded-xl border border-dashed border-[rgba(var(--color-primary-rgb),0.45)] bg-[rgba(var(--color-primary-rgb),0.06)] px-4 py-3 font-mono text-2xl font-bold tracking-[0.12em] text-[var(--color-on-surface)] tabular-nums"
        >
          {codigo}
        </p>
        <button
          type="button"
          onClick={copiar}
          className={cn(
            'inline-flex h-11 items-center gap-2 rounded-xl border border-[rgba(11,15,26,0.16)] px-4 text-sm font-semibold text-[var(--color-on-surface)] transition-[border-color,transform] duration-150 ease-out hover:border-[rgba(11,15,26,0.3)] active:scale-[0.98] dark:border-[var(--color-surface-high)] dark:hover:border-[var(--color-surface-highest)] motion-reduce:transition-none',
            FOCO,
          )}
        >
          <CopyIcon className="size-4" />
          {copia === 'copiado' ? 'Copiado' : 'Copiar código'}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copia === 'copiado' ? 'Código copiado.' : copia === 'manual' ? 'Código seleccionado. Copialo con tu teclado.' : ''}
      </p>
      {copia === 'manual' && (
        <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
          Lo dejamos seleccionado: copialo con Ctrl + C (o mantené apretado en el celular).
        </p>
      )}

      <p className="mt-6 max-w-prose text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
        Guardalo: es tu comprobante. Dentro de las 24 horas te lo confirmamos por{' '}
        {canal === 'whatsapp' ? 'WhatsApp' : 'mail'}, con este mismo código.
      </p>
    </div>
  )
}
