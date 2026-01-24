import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "../../utils/icons";

export default function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <span className="text-sm font-semibold text-slate-500 flex items-center">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
