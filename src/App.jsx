import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import DetailSheet from './components/DetailSheet'
import ExamSheet from './components/ExamSheet'
import RoutineFormModal from './components/RoutineFormModal'
import Dashboard from './pages/Dashboard'
import Routine from './pages/Routine'
import Exams from './pages/Exams'
import Settings from './pages/Settings'
import { useLocalData } from './hooks/useLocalData'

const upsert = (list, item) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item])

export default function App() {
  const [data, setData] = useLocalData()
  const [page, setPage] = useState('dashboard')
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({ open: false, editing: null, day: null })
  const [exam, setExam] = useState({ open: false, editing: null })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = data.theme === 'dark' || (data.theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#000000' : '#F2F2F7')
    }
    apply(); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [data.theme])

  const openAdd = (day) => setForm({ open: true, editing: null, day })
  const openEdit = (r) => { setDetail(null); setForm({ open: true, editing: r, day: null }) }
  const courses = [...new Set(data.routines.map((r) => r.course).filter(Boolean))]

  const pages = {
    dashboard: <Dashboard routines={data.routines} exams={data.exams} onOpen={setDetail} onAdd={openAdd} />,
    routine: <Routine routines={data.routines} onOpen={setDetail} onAdd={openAdd} />,
    exams: <Exams exams={data.exams} onOpen={(e) => setExam({ open: true, editing: e })} onAdd={() => setExam({ open: true, editing: null })} />,
    settings: <Settings data={data} setData={setData} />,
  }

  return <>
    <Layout page={page} setPage={setPage}>{pages[page]}</Layout>
    <DetailSheet item={detail} onClose={() => setDetail(null)} onEdit={openEdit} onDelete={(id) => setData((d) => ({ ...d, routines: d.routines.filter((r) => r.id !== id) }))} />
    <RoutineFormModal open={form.open} editing={form.editing} prefill={form.day} routines={data.routines} onClose={() => setForm((f) => ({ ...f, open: false }))}
      onSave={(r) => setData((d) => ({ ...d, routines: upsert(d.routines, r) }))} />
    <ExamSheet open={exam.open} editing={exam.editing} courses={courses} onClose={() => setExam((e) => ({ ...e, open: false }))}
      onSave={(e) => setData((d) => ({ ...d, exams: upsert(d.exams, e) }))} onDelete={(id) => setData((d) => ({ ...d, exams: d.exams.filter((e) => e.id !== id) }))} />
  </>
}
