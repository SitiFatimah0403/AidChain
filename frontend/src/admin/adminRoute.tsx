import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { isAdmin } from '@/admin/isAdmin';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const isAuthorized = isConnected && address && isAdmin(address);
  return isAuthorized ? <>{children}</> : <Navigate to="/" replace />;
};


/*
This checks if the user is:
-connected,
-has a wallet address,
-and the address is in your admin list.

*/