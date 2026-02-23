// Página principal — carga eagerly (no lazy) para minimizar TTI.
import { MonthGrid } from './MonthGrid'

export default function CalendarPage() {
  return (
    <div className="bg-surface-base">
      <MonthGrid />
    </div>
  )
}
