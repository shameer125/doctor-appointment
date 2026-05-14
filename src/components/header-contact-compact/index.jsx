import PropTypes from "prop-types";

const digitsForTel = (s) => {
    const digits = String(s).replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    if (digits.length === 10) return `+1${digits}`;
    return digits ? `+${digits}` : "";
};

const firstEmailIn = (s) => {
    const m = String(s).match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    return m ? m[0] : "";
};

const HeaderContactCompact = ({ items }) => {
    if (!items?.length) return null;

    return (
        <ul className="m-0 flex list-none flex-wrap items-center gap-y-1.5 p-0">
            {items.map((row) => {
                const tel = digitsForTel(row.info);
                const mail = firstEmailIn(row.info);

                let valueInner = row.info;

                if (row.icon?.includes("ui-call") && tel) {
                    valueInner = <a href={`tel:${tel}`}>{row.info}</a>;
                } else if (row.icon?.includes("envelope") && mail) {
                    valueInner = <a href={`mailto:${mail}`}>{row.info}</a>;
                }

                return (
                    <li
                        key={row.id ?? row.title}
                        className="mr-[18px] inline-flex items-center gap-2 border-r border-slate-400/35 pr-[22px] text-[13px] leading-snug text-slate-300 last:mr-0 last:border-r-0 last:pr-0"
                    >
                        <i
                            className={`${
                                row.icon || "icofont-info-circle"
                            } shrink-0 text-[15px] text-red-400`}
                            aria-hidden="true"
                        />
                        <span className="font-medium text-slate-100 [&_a]:text-slate-50 [&_a]:transition-colors [&_a:hover]:text-white [&_a:hover]:underline [&_a:hover]:underline-offset-4">
                            {valueInner}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

HeaderContactCompact.propTypes = {
    items: PropTypes.array,
};

export default HeaderContactCompact;
