function Modal({ actions, children, onClose, title }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div aria-modal="true" className="modal-card" role="dialog">
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
          </div>
          <button aria-label="Close modal" className="ghost-button modal-close" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions ? <div className="modal-actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
