// Página principal — carga eagerly (no lazy) para minimizar TTI.
import { MonthGrid } from './MonthGrid'
import { DayExpandedPanel } from './DayExpandedPanel'

export default function CalendarPage() {
  return (
    <div className="bg-surface-base">
      <MonthGrid />
      <DayExpandedPanel />
    </div>
  )
}
