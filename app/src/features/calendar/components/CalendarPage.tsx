// Página principal — carga eagerly (no lazy) para minimizar TTI.
// La implementación completa del calendario viene en el siguiente sprint.
export default function CalendarPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <p className="text-text-primary">Calendario — próximamente</p>
    </div>
  )
}
