import Swal from 'sweetalert2'
import { useTriggerImport } from '../../hooks/useSAT'
import { extractError } from '../../api/utils'

const STATUS_BADGE = {
  PENDING: { cls: 'bg-secondary', label: 'Pendiente' },
  RUNNING: { cls: 'bg-warning text-dark', label: 'Ejecutando' },
  SUCCESS: { cls: 'bg-success', label: 'Exitoso' },
  FAILED: { cls: 'bg-danger', label: 'Fallido' },
}

export default function SATImportPanel({ lastBatch }) {
  const trigger = useTriggerImport()

  async function handleImport() {
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Iniciar importación',
      html: `
        <p class="mb-2">Se descargará y procesará la <strong>Lista 69 Cancelados</strong> del SAT.</p>
        <p class="text-muted small mb-0">
          Este proceso puede tardar varios minutos dependiendo del tamaño del archivo.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
    })

    if (!confirm.isConfirmed) return

    // Show loading toast while running (request can take minutes)
    Swal.fire({
      title: 'Importando...',
      html: `
        <p class="mb-2">Descargando datos del SAT.</p>
        <p class="text-muted small mb-0">Por favor espera, no cierres esta ventana.</p>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    })

    try {
      const batch = await trigger.mutateAsync()
      Swal.fire({
        icon: 'success',
        title: '¡Importación completada!',
        html: `
          <p class="mb-1">Se importaron <strong>${batch.records_imported?.toLocaleString() ?? 0}</strong> registros.</p>
          <p class="text-muted small mb-0">Tiempo de ejecución: ${batch.execution_seconds ?? '—'}s</p>
        `,
        confirmButtonColor: '#0d6efd',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la importación',
        text: extractError(err),
        confirmButtonColor: '#dc3545',
      })
    }
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
          {/* Info */}
          <div>
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.3rem' }}>🏛️</span>
              Lista 69 — Contribuyentes Cancelados
            </h5>
            <p className="text-muted small mb-0">
              Fuente:{' '}
              <span className="font-monospace text-break">
                omawww.sat.gob.mx › cifras_sat › Lista69 (Cancelados)
              </span>
            </p>

            {/* Last batch summary */}
            {lastBatch && (
              <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                <span className="small text-muted">Última importación:</span>
                <span
                  className={`badge ${STATUS_BADGE[lastBatch.status]?.cls ?? 'bg-secondary'}`}
                >
                  {STATUS_BADGE[lastBatch.status]?.label ?? lastBatch.status}
                </span>
                <span className="small text-muted">
                  {lastBatch.records_imported != null &&
                    `${lastBatch.records_imported.toLocaleString()} registros`}
                </span>
                {lastBatch.execution_seconds != null && (
                  <span className="small text-muted">
                    en {lastBatch.execution_seconds}s
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4 flex-shrink-0"
            onClick={handleImport}
            disabled={trigger.isPending}
          >
            {trigger.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                Importando...
              </>
            ) : (
              <>
                <span>⬇️</span>
                Descargar e Importar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
