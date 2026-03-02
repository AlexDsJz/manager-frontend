import { useState } from 'react'
import SATImportPanel from '../components/sat/SATImportPanel'
import SATBatchTable from '../components/sat/SATBatchTable'
import SATRecordsTable from '../components/sat/SATRecordsTable'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { useSATBatches } from '../hooks/useSAT'

export default function SATView() {
  const [selectedBatchId, setSelectedBatchId] = useState(null)

  const { data, isLoading } = useSATBatches()
  const batches = data?.results ?? []
  const lastBatch = batches[0] ?? null

  return (
    <div className="container-xl py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">SAT Lista 69 — Cancelados</h2>
        <p className="text-muted small mb-0">
          Descarga e importa el listado oficial de contribuyentes cancelados del Servicio de
          Administración Tributaria.
        </p>
      </div>

      {/* Import panel */}
      <div className="mb-4">
        <SATImportPanel lastBatch={lastBatch} />
      </div>

      {/* Import history */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
          <h6 className="fw-semibold mb-0">Historial de Importaciones</h6>
          {batches.length > 0 && (
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {batches.length} importación(es)
            </span>
          )}
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner text="Cargando historial..." />
          ) : (
            <SATBatchTable
              batches={batches}
              onSelectBatch={setSelectedBatchId}
              selectedBatchId={selectedBatchId}
            />
          )}
        </div>
      </div>

      {/* Records table — shown whenever there are batches (any status) so logs are always visible */}
      {(selectedBatchId !== null || batches.length > 0) && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <h6 className="fw-semibold mb-0">
              Registros Importados
              {selectedBatchId && (
                <span className="ms-2 badge bg-secondary bg-opacity-75 fw-normal">
                  Batch #{selectedBatchId}
                </span>
              )}
            </h6>
            {selectedBatchId && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedBatchId(null)}
              >
                Mostrar todos
              </button>
            )}
          </div>
          <div className="card-body">
            <SATRecordsTable batchId={selectedBatchId} />
          </div>
        </div>
      )}
    </div>
  )
}
