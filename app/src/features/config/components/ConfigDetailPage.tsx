import { useParams } from 'react-router-dom'

export default function ConfigDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <p className="text-text-primary">Editar turno {id} — próximamente</p>
    </div>
  )
}
