// import "./ToolbarItem.scss";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

const ToolbarItem = ({
    icon,
    title,
    action,
    isActive = null,
    isDisabled = false,
}) => {
    return (
        <button
            onClick={action}
            title={title}
            disabled={isDisabled}
            className={`border-none rounded-md text-white cursor-pointer h-7 w-7 mr-1 p-1 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed ${
                isActive && isActive() ? "bg-teal-700" : ""
            }`}
        >
            <svg className="fill-current h-full w-full">
                <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
            </svg>
        </button>
    );
};

export default ToolbarItem;
