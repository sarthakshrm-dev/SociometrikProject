import { useEffect, useState } from "react";

function Accordion({ children, accTitle, collapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => setIsOpen(collapsed), []);
  return (
    <div className="py-3 border-b border-white/10">
      <div
        className="relative z-10 flex items-center justify-between font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {accTitle} <span className={!isOpen ? "icon-minus" : "icon-plus"}></span>
      </div>
      <div className={`transition-all mt-3 ${!isOpen ? "" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

export default Accordion;
