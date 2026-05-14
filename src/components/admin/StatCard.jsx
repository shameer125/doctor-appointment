import PropTypes from "prop-types";

export default function StatCard({ icon, label, value, sub, color = "#9b1f1f", bg = "#fff5f5" }) {
    return (
        <div style={s.card} className="admin-fade">
            <div style={{ ...s.iconWrap, background: bg }}>
                <i className={icon} style={{ fontSize: "1.5rem", color }} />
            </div>
            <div style={s.body}>
                <div style={s.value}>{value}</div>
                <div style={s.label}>{label}</div>
                {sub && <div style={s.sub}>{sub}</div>}
            </div>
        </div>
    );
}

StatCard.propTypes = { icon: PropTypes.string, label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), sub: PropTypes.string, color: PropTypes.string, bg: PropTypes.string };

const s = {
    card:    { background: "#fff", borderRadius: "14px", padding: "1.25rem 1.375rem", border: "1px solid #e9edf4", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", display: "flex", alignItems: "center", gap: "1rem" },
    iconWrap:{ width: "52px", height: "52px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    body:    { flex: 1 },
    value:   { fontSize: "1.75rem", fontWeight: "900", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" },
    label:   { fontSize: "0.8125rem", fontWeight: "600", color: "#64748b", marginTop: "0.2rem" },
    sub:     { fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.1rem" },
};
