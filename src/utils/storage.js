const KEY = 'routine-app-data-v4'
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const defaultData = { routines: [], exams: [], theme: 'system' }

// Accepts v1–v4 data. Per-class exam strings become standalone (undated) exams.
export function migrate(raw) {
  const legacyExams = []
  const routines = (raw.routines || []).map((r, i) => {
    ;(r.exams || []).forEach((title) => legacyExams.push({ id: crypto.randomUUID(), course: r.course || '', title, date: '' }))
    return {
      id: r.id || crypto.randomUUID(),
      day: days.includes(r.day) ? r.day : days[i % 7],
      timeSlot: r.timeSlot || (r.start && r.end ? `${r.start}-${r.end}` : '09:00-10:00'),
      course: r.course || '', teacher: r.teacher || '', room: r.room || r.classroom || '',
      color: r.color || '#007AFF',
      note: r.note ?? (Array.isArray(r.notes) ? r.notes.join('\n') : ''),
    }
  })
  const exams = Array.isArray(raw.exams) ? raw.exams.filter((e) => e && typeof e === 'object') : []
  return { theme: raw.theme || 'system', routines, exams: [...exams, ...legacyExams] }
}

export function loadData() {
  try {
    const raw = ['v4', 'v3', 'v2', 'v1'].map((v) => localStorage.getItem(`routine-app-data-${v}`)).find(Boolean)
    return raw ? migrate(JSON.parse(raw)) : defaultData
  } catch {
    return defaultData
  }
}

export const saveData = (data) => localStorage.setItem(KEY, JSON.stringify(data))
