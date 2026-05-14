import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({
    open,
    title,
    children,
    footer,
    onClose,
    ariaDescribedby,
}) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const prevFocus = document.activeElement;
        const t = window.setTimeout(() => panelRef.current?.focus?.(), 0);
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.clearTimeout(t);
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
            if (prevFocus && typeof prevFocus.focus === "function") {
                try {
                    prevFocus.focus();
                } catch {
                    /* ignore */
                }
            }
        };
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="hope-modal-backdrop"
            role="presentation"
            onClick={onClose}
            aria-hidden={!open}
        >
            <div
                className="hope-modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "hope-modal-title" : undefined}
                aria-describedby={ariaDescribedby}
                onClick={(e) => e.stopPropagation()}
                ref={panelRef}
                tabIndex={-1}
            >
                {title ? (
                    <h2 id="hope-modal-title" className="hope-modal-title">
                        {title}
                    </h2>
                ) : null}
                <div className="hope-modal-body">{children}</div>
                {footer ? (
                    <div className="hope-modal-footer">{footer}</div>
                ) : null}
                <button
                    type="button"
                    className="hope-modal-close"
                    aria-label="Close dialog"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>
        </div>,
        document.body
    );
}

Modal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.node,
    children: PropTypes.node,
    footer: PropTypes.node,
    onClose: PropTypes.func,
    ariaDescribedby: PropTypes.string,
};

Modal.defaultProps = {
    open: false,
    title: undefined,
    children: undefined,
    footer: undefined,
    onClose: undefined,
    ariaDescribedby: undefined,
};
