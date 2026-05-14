import PropTypes from "prop-types";

const MenuOverlay = ({ show, onClose }) => {
    return (
        <button
            type="button"
            aria-label="Close menu overlay"
            className={`fixed inset-0 z-[1039] border-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
                show
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
            }`}
            onClick={onClose}
            tabIndex={show ? 0 : -1}
        />
    );
};

MenuOverlay.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

MenuOverlay.defaultProps = {
    onClose: undefined,
};

export default MenuOverlay;
