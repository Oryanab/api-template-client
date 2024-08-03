// CsrfContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

// Define a type for the context value
interface CsrfContextType {
  csrfToken: string;
}

// Create a Context with a default value of an empty string
const CsrfContext = createContext<CsrfContextType>({ csrfToken: "" });

// Define props type for the provider
interface CsrfProviderProps {
  children: ReactNode;
}

// Create a Provider Component
export const CsrfProvider: React.FC<CsrfProviderProps> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ENDPOINT}/csrf`,
          {
            withCredentials: true,
          }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
};

// Custom Hook to use CSRF Token
export const useCsrfToken = (): string => {
  const context = useContext(CsrfContext);
  if (context === undefined) {
    throw new Error("useCsrfToken must be used within a CsrfProvider");
  }
  return context.csrfToken;
};
