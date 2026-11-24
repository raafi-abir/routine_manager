import { useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { ClassRow, DAYS, Empty, NavBtn, SHORT, Screen, Section } from '../components/ui'

export default function Routine({ routines, onOpen, onAdd }) {
  const now = new Date()
  const todayIdx = (now.getDay() + 6) % 7
  const [sel, setSel] = useState(todayIdx)
  const monday = new Date(now); monday.setDate(now.getDate() - todayIdx)
  const list = routines.filter((r) => r.day === DAYS[sel]).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))

  return <Screen title="Routine" trailing={<NavBtn onClick={() => onAdd(DAYS[sel])}><Plus size={26} /></NavBtn>}>
    <div className="mb-4 flex px-2">
      {DAYS.map((d, i) => {
        const dt = new Date(monday); dt.setDate(monday.getDate() + i)
        const on = i === sel
        return <button key={d} onClick={() => setSel(i)} className="flex flex-1 flex-col items-center gap-1 py-1">
          <span className="text-[11px] font-medium uppercase text-label2">{SHORT[i]}</span>
          <span className={`grid h-9 w-9 place-items-center rounded-full text-[20px] ${on ? 'bg-tint font-semibold text-white' : i === todayIdx ? 'font-semibold text-tint' : ''}`}>{dt.getDate()}</span>
        </button>
      })}
    </div>
    {list.length ? <Section header={DAYS[sel]}>{list.map((r) => <ClassRow key={r.id} r={r} onClick={() => onOpen(r)} />)}</Section>
      : <Empty icon={CalendarDays} title="No Classes" text={`Nothing on ${DAYS[sel]}. Tap + to add a class.`} />}
  </Screen>
}
