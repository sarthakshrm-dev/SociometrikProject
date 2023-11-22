import React from "react";
import Image from "next/image";

function MenuLink({ isActive, iconClass, label }) {
  return (
    <>
      <div
        className={`flex items-center p-1 rounded-md w-10 h-10 justify-center ${
          isActive && "bg-dark4 text-primary1"
        }`}
        id={label.replaceAll(' ', '')}
      >
        <span className={iconClass}></span>
      </div>

      <div className="linkLabel">
        {label}{" "}
        <span>
          <Image
            width={14}
            height={14}
            src="/images/arrowRight.png"
            alt={label}
          />
        </span>
      </div>
    </>
  );
}

export default MenuLink;
