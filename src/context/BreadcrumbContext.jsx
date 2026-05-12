import React, { useState, useCallback } from 'react';
import { BreadcrumbContext } from './breadcrumbContext';

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const addBreadcrumb = useCallback((label, path) => {
    setBreadcrumbs((prev) => {
      const index = prev.findIndex((item) => item.path === path);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return [...prev, { label, path }];
    });
  }, []);

  const removeBreadcrumb = useCallback((path) => {
    setBreadcrumbs((prev) =>
      prev.filter((item, index) => {
        const pathIndex = prev.findIndex((p) => p.path === path);
        return index <= pathIndex;
      })
    );
  }, []);

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, addBreadcrumb, removeBreadcrumb, clearBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
