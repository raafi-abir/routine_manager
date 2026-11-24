import { CalendarCheck, CalendarDays, ClipboardList, Settings } from 'lucide-react'

const tabs = [
  { key: 'dashboard', label: 'Today', icon: CalendarCheck },
  { key: 'routine', label: 'Routine', icon: CalendarDays },
  { key: 'exams', label: 'Exams', icon: ClipboardList },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export default function Layout({ page, setPage, children }) {
  return <div className="mx-auto min-h-dvh max-w-[560px] pb-[calc(49px+env(safe-area-inset-bottom)+16px)]">
    {children}
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-[0.5px] border-sep" style={{ background: 'var(--bar)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
      <div className="mx-auto flex max-w-[560px] pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ key, label, icon: Icon }) => {
          const on = page === key
          return <button key={key} onClick={() => setPage(key)} className={`flex h-[49px] flex-1 flex-col items-center justify-center gap-0.5 ${on ? 'text-tint' : 'text-label2'}`}>
            <Icon size={24} strokeWidth={on ? 2.2 : 1.6} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        })}
      </div>
    </nav>
  </div>
}
