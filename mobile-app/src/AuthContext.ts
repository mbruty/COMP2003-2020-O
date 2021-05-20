import React from "react";
import { auth } from "./packages/includeAuth";

export const AuthContext = React.createContext<auth | undefined>(undefined);
