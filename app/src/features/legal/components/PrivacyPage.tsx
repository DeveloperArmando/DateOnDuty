import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-8 text-text-primary">
      <h1 className="mb-4 text-2xl font-semibold">Política de Privacidad</h1>
      <p className="mb-4 text-text-secondary">Contenido próximamente.</p>
      <Link to="/" className="text-interactive-primary underline">
        Volver al calendario
      </Link>
    </div>
  )
}
