import { ClipboardList, Plus, TriangleAlert } from 'lucide-react'
import { Empty, ItemRow, NavBtn, Screen, Section, daysUntil, dueLabel, shortDate } from '../components/ui'

export default function Exams({ exams, onOpen, onAdd }) {
  const dated = exams.filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date))
  const groups = [
    ['Upcoming', dated.filter((e) => daysUntil(e.date) >= 0)],
    ['No Date', exams.filter((e) => !e.date)],
    ['Past', dated.filter((e) => daysUntil(e.date) < 0).reverse()],
  ].filter(([, l]) => l.length)
  return <Screen title="Exams" trailing={<NavBtn onClick={() => onAdd()}><Plus size={26} /></NavBtn>}>
    {groups.length ? groups.map(([h, list]) => <Section key={h} header={h}>
      {list.map((e) => <ItemRow key={e.id} color={h === 'Past' ? '#8E8E93' : '#FF3B30'} icon={TriangleAlert} title={e.title}
        sub={[e.course, e.date && shortDate(e.date)].filter(Boolean).join(' · ')} value={dueLabel(e.date)} onClick={() => onOpen(e)} />)}
    </Section>) : <Empty icon={ClipboardList} title="No Exams" text="Tap + to add an exam and track the countdown." />}
  </Screen>
}
