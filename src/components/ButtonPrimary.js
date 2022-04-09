import * as React from "react";

export function classNames(...classes) {
   return classes.filter(Boolean).join(" ");
}

const ButtonPrimary = (props) => {
   const {
      size,
      Icon,
      text,
      type,
      onClick,
      disabled = false,
      isLoading = false,
      className,
   } = props;
   return (
      <button
         type={type ? type : "button"}
         onClick={onClick}
         disabled={disabled || isLoading}
         className={classNames(
            size === "small"
               ? "px-2 py-1 text-xs ml-0.5"
               : size === "medium"
               ? "px-5 py-1.5 text-sm"
               : "w-full px-5 py-3 text-sm",
            disabled || isLoading ? "opacity-30" : "hover:bg-blue-800",
            "inline-flex  items-center uppercase whitespace-nowrap justify-center border border-transparent font-medium rounded-full shadow-sm text-white bg-blue-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600",
            className
         )}
      >
         {isLoading ? (
            <div
               className={classNames(
                  size === "small"
                     ? "px-3.5"
                     : size === "medium"
                     ? "px-5"
                     : "w-full  px-5  text-sm",
                  "flex justify-center w-24 items-center"
               )}
            >
               <div
                  style={{ borderTopColor: "transparent" }}
                  className="w-5 ml-1 h-5 border-4 border-darkblue-300 border-solid rounded-full animate-spin"
               ></div>
            </div>
         ) : (
            <>
               {Icon && <Icon className="h-6 w-6 mr-1" />}
               {text}
            </>
         )}
      </button>
   );
};

export default ButtonPrimary;
