import { useEffect, useState } from 'react'
import { ActionSheet, Input, NavBtn, Row, Section, Sheet } from './ui'

const blank = { id: null, title: '', course: '', date: '' }

export default function ExamSheet({ open, editing, courses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(blank)
  const [ask, setAsk] = useState(false)
  useEffect(() => { if (open) setF(editing || blank) }, [open, editing])
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  return <>
    <Sheet open={open} onClose={onClose} title={f.id ? 'Edit Exam' : 'New Exam'} left={<NavBtn onClick={onClose}>Cancel</NavBtn>}
      right={<NavBtn bold disabled={!f.title.trim()} onClick={() => { onSave({ ...f, id: f.id || crypto.randomUUID(), title: f.title.trim() }); onClose() }}>Save</NavBtn>}>
      <Section>
        <Row><Input placeholder="Exam (e.g. Midterm)" value={f.title} onChange={set('title')} /></Row>
        <Row><Input list="exam-courses" placeholder="Course" value={f.course} onChange={set('course')} /></Row>
        <datalist id="exam-courses">{courses.map((c) => <option key={c} value={c} />)}</datalist>
        <Row label="Date"><input type="date" value={f.date} onChange={set('date')} className="bg-transparent text-right text-label2 outline-none" /></Row>
      </Section>
      {f.id && <Section><Row danger center label="Delete Exam" onClick={() => setAsk(true)} /></Section>}
    </Sheet>
    <ActionSheet open={ask} onClose={() => setAsk(false)} title="Delete this exam?"
      actions={[{ label: 'Delete Exam', danger: true, onClick: () => { onDelete(f.id); setAsk(false); onClose() } }]} />
  </>
}
