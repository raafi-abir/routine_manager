import { useRef, useState } from 'react'
import { Download, Moon, Trash2, Upload } from 'lucide-react'
import { ActionSheet, IconTile, Row, Screen, Section, Segmented } from '../components/ui'
import { defaultData, migrate } from '../utils/storage'

export default function Settings({ data, setData }) {
  const file = useRef(null)
  const [ask, setAsk] = useState(false)
  const [msg, setMsg] = useState('')

  const exportData = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'class-routine-backup.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const importData = async (f) => {
    try { setData(migrate(JSON.parse(await f.text()))); setMsg('Backup restored.') } catch { setMsg('That file is not a valid backup.') }
  }

  return <Screen title="Settings">
    <Section header="Appearance">
      <Row icon={<IconTile color="#5856D6" icon={Moon} />} label="Theme">
        <div className="w-[190px]"><Segmented id="theme" value={data.theme} onChange={(theme) => setData((d) => ({ ...d, theme }))} options={[{ value: 'system', label: 'Auto' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} /></div>
      </Row>
    </Section>
    <Section header="Data" footer={msg || 'Everything is stored on this device only. Export a backup before clearing browser data.'}>
      <Row icon={<IconTile color="#007AFF" icon={Download} />} label="Export Backup" chevron onClick={exportData} />
      <Row icon={<IconTile color="#34C759" icon={Upload} />} label="Restore Backup" chevron onClick={() => file.current?.click()} />
      <Row icon={<IconTile color="#FF3B30" icon={Trash2} />} label="Erase All Data" danger onClick={() => setAsk(true)} />
    </Section>
    <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { e.target.files?.[0] && importData(e.target.files[0]); e.target.value = '' }} />
    <ActionSheet open={ask} onClose={() => setAsk(false)} title="This deletes all classes and exams." actions={[{ label: 'Erase Everything', danger: true, onClick: () => { setData(defaultData); setAsk(false) } }]} />
  </Screen>
}
