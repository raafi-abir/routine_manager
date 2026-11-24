import { CalendarCheck, Plus, TriangleAlert } from 'lucide-react'
import { ClassRow, Empty, ItemRow, NavBtn, Screen, Section, daysUntil, dueLabel, shortDate, slotLabel, toMin } from '../components/ui'

export default function Dashboard({ routines, exams, onOpen, onAdd }) {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const today = now.toLocaleDateString('en-US', { weekday: 'long' })
  const todays = routines.filter((r) => r.day === today).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
  const next = todays.find((r) => toMin(r.timeSlot.split('-')[1]) > mins)
  const live = next && mins >= toMin(next.timeSlot.split('-')[0])
  const soon = exams.filter((e) => e.date && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)

  return <Screen title="Today" trailing={<NavBtn onClick={() => onAdd(today)}><Plus size={26} /></NavBtn>}>
    <p className="-mt-1 mb-4 px-4 text-[15px] text-label2">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    {next && <button onClick={() => onOpen(next)} className="mx-4 mb-6 block w-[calc(100%-32px)] rounded-[14px] bg-card p-4 text-left active:bg-fill3">
      <p className="text-[13px] font-semibold uppercase" style={{ color: next.color }}>{live ? 'Now' : 'Up next'}</p>
      <p className="mt-0.5 text-[22px] font-semibold leading-7">{next.course || 'Untitled'}</p>
      <p className="mt-1 text-[15px] text-label2">{[slotLabel(next.timeSlot), next.room].filter(Boolean).join(' · ')}</p>
    </button>}
    {todays.length ? <Section header="Schedule">{todays.map((r) => <ClassRow key={r.id} r={r} onClick={() => onOpen(r)} />)}</Section>
      : <Empty icon={CalendarCheck} title="No Classes Today" text="Enjoy the free day." />}
    {soon.length > 0 && <Section header="Upcoming Exams">{soon.map((e) => <ItemRow key={e.id} color="#FF3B30" icon={TriangleAlert} title={e.title} sub={`${e.course} · ${shortDate(e.date)}`} value={dueLabel(e.date)} />)}</Section>}
  </Screen>
}
