"use client";

import { DataProvider } from "@refinedev/core";
import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";
import { supabaseBrowserClient } from "@utils/supabase/client";

const baseDataProvider = dataProviderSupabase(supabaseBrowserClient);

// 混合数据提供者：产品使用 API 路由，其他使用 Supabase
export const dataProvider: DataProvider = {
  ...baseDataProvider,

  // 产品相关操作使用 API 路由
  getList: async (params) => {
    if (params.resource === "tb_product") {
      const url = new URL(`/api/${params.resource}`, window.location.origin);

      if (params.pagination) {
        url.searchParams.set(
          "page",
          params.pagination.current?.toString() || "1"
        );
        url.searchParams.set(
          "pageSize",
          params.pagination.pageSize?.toString() || "10"
        );
      }

      if (params.sorters && params.sorters.length > 0) {
        url.searchParams.set("sort", params.sorters[0].field);
        url.searchParams.set("order", params.sorters[0].order);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // 其他资源使用原始 Supabase 提供者
    return baseDataProvider.getList(params);
  },

  getOne: async (params) => {
    if (params.resource === "tb_product") {
      const response = await fetch(`/api/${params.resource}/${params.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    return baseDataProvider.getOne(params);
  },

  create: async (params) => {
    if (params.resource === "tb_product") {
      const response = await fetch(`/api/${params.resource}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params.variables),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    }

    return baseDataProvider.create(params);
  },

  update: async (params) => {
    if (params.resource === "tb_product") {
      const response = await fetch(`/api/${params.resource}/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params.variables),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    }

    return baseDataProvider.update(params);
  },

  deleteOne: async (params) => {
    if (params.resource === "tb_product") {
      const response = await fetch(`/api/${params.resource}/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    }

    return baseDataProvider.deleteOne(params);
  },
};
