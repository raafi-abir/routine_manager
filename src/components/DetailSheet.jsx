import { useEffect, useState } from 'react'
import { ActionSheet, NavBtn, Row, Section, Sheet, slotLabel } from './ui'

export default function DetailSheet({ item, onClose, onEdit, onDelete }) {
  const [r, setR] = useState(item)
  const [ask, setAsk] = useState(false)
  useEffect(() => { if (item) setR(item) }, [item])
  return <>
    <Sheet open={!!item} onClose={onClose} left={<NavBtn onClick={() => onEdit(r)}>Edit</NavBtn>} right={<NavBtn bold onClick={onClose}>Done</NavBtn>}>
      {r && <>
        <div className="px-4 pb-4 pt-2">
          <div className="mb-2 h-1 w-10 rounded-full" style={{ background: r.color }} />
          <h2 className="text-[28px] font-bold leading-8">{r.course || 'Untitled'}</h2>
        </div>
        <Section>
          <Row label="Day" value={r.day} />
          <Row label="Time" value={slotLabel(r.timeSlot)} />
          {r.teacher && <Row label="Teacher" value={r.teacher} />}
          {r.room && <Row label="Room" value={r.room} />}
        </Section>
        {r.note && <Section header="Note"><Row label={<span className="whitespace-pre-wrap">{r.note}</span>} /></Section>}
        <Section><Row danger center label="Delete Class" onClick={() => setAsk(true)} /></Section>
      </>}
    </Sheet>
    <ActionSheet open={ask} onClose={() => setAsk(false)} title={`Delete “${r?.course || 'this class'}”?`}
      actions={[{ label: 'Delete Class', danger: true, onClick: () => { onDelete(r.id); setAsk(false); onClose() } }]} />
  </>
}
