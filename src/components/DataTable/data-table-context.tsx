import { createContext, useContext, useState, ReactNode } from "react";

// Generic interface for the context
interface TableDataContextType<T> {
  tableData: T[];
  setTableData: (data: T[]) => void;
}

// Create a generic context with a default value of `undefined`
const TableDataContext = createContext<TableDataContextType<any> | undefined>(undefined);

// Create a provider component that accepts generic type T
export const TableDataProvider = <T,>({ children }: { children: ReactNode }) => {
  const [tableData, setTableData] = useState<T[]>([]);

  return (
    <TableDataContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableDataContext.Provider>
  );
};

// Create a hook to use the context in other components
export const useTableData = <T,>() => {
  const context = useContext(TableDataContext) as TableDataContextType<T>;
  if (context === undefined) {
    throw new Error("useTableData must be used within a TableDataProvider");
  }
  return context;
};
