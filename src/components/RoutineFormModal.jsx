import { useEffect, useState } from 'react'
import { Input, NavBtn, PALETTE, Pick, Row, Section, Sheet, DAYS, toMin } from './ui'

const time = 'bg-transparent text-right text-label2 outline-none'

export default function RoutineFormModal({ open, onClose, onSave, editing, prefill, routines }) {
  const [f, setF] = useState(null)
  useEffect(() => {
    if (!open) return
    if (editing) { const [start, end] = editing.timeSlot.split('-'); setF({ ...editing, start, end }); return }
    const day = prefill || 'Monday'
    const last = routines.filter((r) => r.day === day).map((r) => r.timeSlot.split('-')[1]).sort().pop()
    const start = last || '09:00'
    const h = Math.min(23, Number(start.slice(0, 2)) + 1)
    setF({ id: null, day, course: '', teacher: '', room: '', color: PALETTE[0], note: '', start, end: `${String(h).padStart(2, '0')}${start.slice(2)}` })
  }, [open, editing, prefill])
  if (!f) return null

  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const bad = toMin(f.end) <= toMin(f.start)
  const clash = routines.find((r) => {
    const [a, b] = r.timeSlot.split('-')
    return r.id !== f.id && r.day === f.day && toMin(a) < toMin(f.end) && toMin(f.start) < toMin(b)
  })
  const submit = () => {
    onSave({ id: f.id || crypto.randomUUID(), day: f.day, timeSlot: `${f.start}-${f.end}`, course: f.course.trim(), teacher: f.teacher, room: f.room, color: f.color, note: f.note.trim() })
    onClose()
  }

  return <Sheet open={open} onClose={onClose} title={f.id ? 'Edit Class' : 'New Class'}
    left={<NavBtn onClick={onClose}>Cancel</NavBtn>} right={<NavBtn bold disabled={!f.course.trim() || bad} onClick={submit}>Save</NavBtn>}>
    <Section>
      <Row><Input placeholder="Course" value={f.course} onChange={(e) => set('course')(e.target.value)} /></Row>
      <Row><Input placeholder="Teacher" value={f.teacher} onChange={(e) => set('teacher')(e.target.value)} /></Row>
      <Row><Input placeholder="Room" value={f.room} onChange={(e) => set('room')(e.target.value)} /></Row>
    </Section>
    <Section footer={(bad || clash) && <span className="text-danger">{bad ? 'End time must be after start time.' : `Overlaps with ${clash.course || 'another class'}.`}</span>}>
      <Pick label="Day" value={f.day} onChange={set('day')} options={DAYS.map((d) => ({ v: d, l: d }))} />
      <Row label="Starts"><input type="time" value={f.start} onChange={(e) => set('start')(e.target.value)} className={time} /></Row>
      <Row label="Ends"><input type="time" value={f.end} onChange={(e) => set('end')(e.target.value)} className={time} /></Row>
    </Section>
    <Section header="Color">
      <div className="flex justify-between px-4 py-3">
        {PALETTE.map((c) => <button key={c} aria-label={c} onClick={() => set('color')(c)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: c }}>
          {f.color.toUpperCase() === c && <span className="h-3 w-3 rounded-full bg-white" />}
        </button>)}
      </div>
    </Section>
    <Section header="Note"><Row><textarea rows={3} placeholder="Add a note" value={f.note} onChange={(e) => set('note')(e.target.value)} className="w-full resize-none bg-transparent text-[17px] outline-none placeholder:text-label3" /></Row></Section>
  </Sheet>
}
