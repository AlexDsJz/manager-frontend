import EmptyState from '../shared/EmptyState'

const STATUS_CFG = {
  PENDING: { cls: 'bg-secondary', label: 'Pendiente' },
  RUNNING: { cls: 'bg-warning text-dark', label: 'Ejecutando' },
  SUCCESS: { cls: 'bg-success', label: 'Exitoso' },
  FAILED: { cls: 'bg-danger', label: 'Fallido' },
}

const fmtDt = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'medium' })
    : '—'

export default function SATBatchTable({ batches = [], onSelectBatch, selectedBatchId }) {
  if (!batches.length) {
    return (
      <EmptyState
        icon="📥"
        title="Sin importaciones"
        description="Usa el botón de arriba para descargar la primera vez."
      />
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0 small">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Estado</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th className="text-end">Registros</th>
            <th className="text-end">Tiempo (s)</th>
            <th className="text-center">Ver registros</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => {
            const cfg = STATUS_CFG[batch.status] ?? { cls: 'bg-secondary', label: batch.status }
            const isSelected = selectedBatchId === batch.id

            return (
              <tr
                key={batch.id}
                className={isSelected ? 'table-primary' : ''}
              >
                <td className="font-monospace text-muted">{batch.id}</td>
                <td>
                  <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  {batch.error_message && (
                    <span
                      className="ms-2 text-danger"
                      title={batch.error_message}
                      style={{ cursor: 'help' }}
                    >
                      ⚠️
                    </span>
                  )}
                </td>
                <td>{fmtDt(batch.started_at)}</td>
                <td>{fmtDt(batch.finished_at)}</td>
                <td className="text-end fw-medium">
                  {batch.records_imported != null
                    ? batch.records_imported.toLocaleString()
                    : '—'}
                </td>
                <td className="text-end">
                  {batch.execution_seconds != null ? batch.execution_seconds : '—'}
                </td>
                <td className="text-center">
                  {batch.status === 'SUCCESS' && (
                    <button
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => onSelectBatch(isSelected ? null : batch.id)}
                    >
                      {isSelected ? 'Ocultar' : 'Ver'}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
