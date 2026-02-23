import { useEffect } from 'react'

/**
 * Escucha el evento `storage` del window y llama al callback solo para
 * las claves que empiezan con el prefijo `dod-` del proyecto.
 *
 * Usado para sincronizar estado entre pestañas cuando otra pestaña
 * modifica los stores persistidos de Zustand.
 */
export function useStorageEvent(callback: (key: string, newValue: string | null) => void): void {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key?.startsWith('dod-')) {
        callback(e.key, e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [callback])
}
