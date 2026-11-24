import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export const PALETTE = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#FF2D55', '#5AC8FA', '#5856D6', '#FFCC00', '#8E8E93']
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
export const fmt = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
export const slotLabel = (s) => s.split('-').map(fmt).join(' – ')

export const daysUntil = (d) => Math.round((new Date(d + 'T00:00') - new Date(new Date().toDateString())) / 864e5)
export const dueLabel = (d) => { if (!d) return 'No date'; const n = daysUntil(d); return n < 0 ? `${-n}d ago` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days` }
export const shortDate = (d) => new Date(d + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const blur = { backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }
const spring = { type: 'spring', damping: 34, stiffness: 380, mass: 0.9 }

export const NavBtn = ({ children, onClick, bold, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`text-[17px] text-tint active:opacity-40 disabled:opacity-40 ${bold ? 'font-semibold' : ''}`}>{children}</button>
)

// Large title that collapses into an inline nav bar on scroll.
export function Screen({ title, leading, trailing, children }) {
  const [y, setY] = useState(0)
  useEffect(() => {
    const f = () => setY(window.scrollY)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const on = y > 36
  return <div>
    <div className="sticky top-0 z-30 pt-[env(safe-area-inset-top)]" style={on ? { background: 'var(--bar)', boxShadow: '0 0.5px 0 var(--sep)', ...blur } : undefined}>
      <div className="relative flex h-11 items-center justify-between px-4">
        <div className="min-w-[60px]">{leading}</div>
        <span className={`pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`}>{title}</span>
        <div className="relative min-w-[60px] text-right">{trailing}</div>
      </div>
    </div>
    <h1 className="px-4 pb-2 text-[34px] font-bold leading-[41px] tracking-[0.37px]">{title}</h1>
    {children}
  </div>
}

export const Section = ({ header, footer, children }) => (
  <section className="mb-6 px-4">
    {header && <h2 className="mb-1.5 px-4 text-[13px] uppercase text-label2">{header}</h2>}
    <div className="overflow-hidden rounded-[10px] bg-card">{children}</div>
    {footer && <p className="mt-1.5 px-4 text-[13px] text-label2">{footer}</p>}
  </section>
)

export const IconTile = ({ color, icon: Icon }) => (
  <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-[7px] text-white" style={{ background: color }}><Icon size={17} strokeWidth={2} /></span>
)

export function Row({ icon, label, value, onClick, chevron, danger, center, children }) {
  const C = onClick ? 'button' : 'div'
  return <C onClick={onClick} className={`relative flex min-h-[44px] w-full items-center gap-3 px-4 py-2.5 text-left text-[17px] after:absolute after:bottom-0 after:left-4 after:right-0 after:h-[0.5px] after:bg-sep last:after:hidden ${onClick ? 'active:bg-fill3' : ''}`}>
    {icon}
    {label !== undefined && <span className={`flex-1 ${center ? 'text-center' : ''} ${danger ? 'text-danger' : ''}`}>{label}</span>}
    {value !== undefined && <span className="text-label2">{value}</span>}
    {children}
    {chevron && <ChevronRight size={16} strokeWidth={2.5} className="shrink-0 text-label3" />}
  </C>
}

export const Input = (p) => <input {...p} className="w-full bg-transparent text-[17px] outline-none placeholder:text-label3" />

export const Pick = ({ label, value, onChange, options }) => (
  <Row label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[60%] appearance-none bg-transparent text-right text-label2 outline-none">
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </Row>
)

export function ItemRow({ color, icon, title, sub, value, onClick }) {
  return <Row icon={<IconTile color={color} icon={icon} />} onClick={onClick} chevron={!!onClick}>
    <div className="min-w-0 flex-1"><div className="leading-snug">{title}</div>{sub && <div className="text-[13px] text-label2">{sub}</div>}</div>
    {value && <span className="text-[15px] text-label2">{value}</span>}
  </Row>
}

export function ClassRow({ r, onClick }) {
  const [a, b] = r.timeSlot.split('-')
  return <Row onClick={onClick} chevron>
    <div className="w-[64px] shrink-0 text-[15px] leading-tight"><div className="font-semibold">{fmt(a)}</div><div className="text-label2">{fmt(b)}</div></div>
    <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: r.color }} />
    <div className="min-w-0 flex-1">
      <div className="truncate font-medium">{r.course || 'Untitled'}</div>
      <div className="truncate text-[15px] text-label2">{[r.room, r.teacher].filter(Boolean).join(' · ') || 'No details'}</div>
    </div>
  </Row>
}

export const Empty = ({ icon: Icon, title, text }) => (
  <div className="flex flex-col items-center px-10 pt-24 text-center">
    <Icon size={44} strokeWidth={1.25} className="mb-3 text-label3" />
    <p className="text-[20px] font-semibold">{title}</p>
    <p className="mt-1 text-[15px] text-label2">{text}</p>
  </div>
)

export function Segmented({ id, options, value, onChange }) {
  return <div className="flex rounded-[9px] bg-fill p-0.5">
    {options.map((o) => <button key={o.value} onClick={() => onChange(o.value)} className="relative flex-1 py-[5px] text-[13px] font-medium">
      {value === o.value && <motion.span layoutId={id} transition={spring} className="absolute inset-0 rounded-[7px] bg-seg shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)]" />}
      <span className="relative">{o.label}</span>
    </button>)}
  </div>
}

// Bottom sheet; drag the header down to dismiss.
export function Sheet({ open, onClose, title, left, right, children }) {
  const controls = useDragControls()
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  return <AnimatePresence>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div drag="y" dragListener={false} dragControls={controls} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 600) onClose() }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}
        className="relative mt-[max(10px,env(safe-area-inset-top))] flex max-h-[calc(100dvh-10px)] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[12px] bg-bg shadow-2xl">
        <div onPointerDown={(e) => controls.start(e)} className="touch-none">
          <div className="mx-auto mt-1.5 h-[5px] w-9 rounded-full bg-label3" />
          <div className="relative flex h-11 items-center justify-between px-4">
            <div>{left}</div>
            <span className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold">{title}</span>
            <div className="relative">{right}</div>
          </div>
        </div>
        <div className="overflow-y-auto overscroll-contain pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2">{children}</div>
      </motion.div>
    </div>}
  </AnimatePresence>
}

export function ActionSheet({ open, onClose, title, actions }) {
  return <AnimatePresence>
    {open && <div className="fixed inset-0 z-[60] flex items-end justify-center p-2 pb-[max(8px,env(safe-area-inset-bottom))]">
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={spring} className="relative w-full max-w-[560px]">
        <div className="overflow-hidden rounded-[14px] bg-card text-center">
          {title && <p className="px-4 py-3 text-[13px] font-semibold text-label2">{title}</p>}
          {actions.map((a) => <button key={a.label} onClick={a.onClick} className={`block h-[57px] w-full border-t-[0.5px] border-sep text-[20px] active:bg-fill3 ${a.danger ? 'text-danger' : 'text-tint'}`}>{a.label}</button>)}
        </div>
        <button onClick={onClose} className="mt-2 h-[57px] w-full rounded-[14px] bg-card text-[20px] font-semibold text-tint active:bg-fill3">Cancel</button>
      </motion.div>
    </div>}
  </AnimatePresence>
}

