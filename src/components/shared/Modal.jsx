import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Pure Bootstrap-CSS modal rendered via React portal.
 * No react-bootstrap dependency needed.
 */
export default function Modal({ show, onHide, title, children, size = '', footer = null }) {
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
    }
    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onHide()
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
        onClick={handleBackdropClick}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`}
          role="document"
        >
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-semibold">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onHide}
              />
            </div>

            <div className="modal-body">{children}</div>

            {footer && <div className="modal-footer border-top">{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
