import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value);

  const handleValueChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, onValueChange: handleValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, onValueChange, className }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, onValueChange })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, onValueChange, className }) => {
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        activeTab === value
          ? "bg-white text-gray-900 shadow-sm"
          : "hover:bg-gray-200",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab, className }) => {
  if (activeTab !== value) return null;
  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
