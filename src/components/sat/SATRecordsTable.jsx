import { useState } from 'react'
import { useCanceledTaxpayers } from '../../hooks/useSAT'
import LoadingSpinner from '../shared/LoadingSpinner'
import EmptyState from '../shared/EmptyState'

const fmtAmount = (val) => {
  if (val == null || val === '') return '—'
  const n = parseFloat(val)
  return isNaN(n)
    ? val
    : n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

const PERSON_TYPE_LABEL = {
  F: 'Física',
  M: 'Moral',
}

export default function SATRecordsTable({ batchId }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [inputValue, setInputValue] = useState('')

  const params = {
    page,
    ...(search && { search }),
    ...(batchId && { batch: batchId }),
  }

  const { data, isLoading, isFetching, isError } = useCanceledTaxpayers(params)

  const results = data?.results ?? []
  const count = data?.count ?? 0
  const hasNext = Boolean(data?.next)
  const hasPrev = Boolean(data?.previous)
  const totalPages = Math.ceil(count / 50)

  function handleSearch(e) {
    e.preventDefault()
    setSearch(inputValue.trim())
    setPage(1)
  }

  function handleClear() {
    setInputValue('')
    setSearch('')
    setPage(1)
  }

  return (
    <div>
      {/* Search bar */}
      <form className="d-flex gap-2 mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por RFC, nombre o estado..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-outline-primary flex-shrink-0">
          Buscar
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-outline-secondary flex-shrink-0"
            onClick={handleClear}
          >
            Limpiar
          </button>
        )}
      </form>

      {/* Record count */}
      {!isLoading && count > 0 && (
        <p className="text-muted small mb-2">
          {count.toLocaleString()} registro(s) encontrado(s)
          {search && ` para "${search}"`}
          {isFetching && (
            <span className="ms-2 spinner-border spinner-border-sm text-secondary" />
          )}
        </p>
      )}

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner text="Cargando registros..." />
      ) : isError ? (
        <div className="alert alert-danger">Error al cargar los registros.</div>
      ) : !results.length ? (
        <EmptyState
          icon="🔍"
          title="Sin resultados"
          description={
            search
              ? `No se encontraron registros para "${search}".`
              : 'No hay registros en esta importación.'
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>RFC</th>
                <th>Nombre / Razón Social</th>
                <th>Tipo</th>
                <th>Supuesto</th>
                <th className="text-end">Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {results.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-monospace fw-medium text-primary">{rec.rfc}</td>
                  <td className="text-truncate" style={{ maxWidth: 260 }} title={rec.name}>
                    {rec.name}
                  </td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-75">
                      {PERSON_TYPE_LABEL[rec.person_type] ?? rec.person_type ?? '—'}
                    </span>
                  </td>
                  <td className="text-muted" style={{ maxWidth: 180 }} title={rec.assumption}>
                    <span className="text-truncate d-block">{rec.assumption ?? '—'}</span>
                  </td>
                  <td className="text-end">{fmtAmount(rec.amount)}</td>
                  <td>{rec.state ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="small text-muted">
            Página {page} de {totalPages}
          </span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrev || isLoading}
            >
              ← Anterior
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext || isLoading}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
