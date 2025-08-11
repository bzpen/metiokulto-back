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
    if (
      params.resource === "tb_product" ||
      params.resource === "tb_product_type" ||
      params.resource === "user_leave"
    ) {
      // 构建API URL
      let apiUrl = `${
        params.resource === "tb_product"
          ? "/api/products"
          : params.resource === "tb_product_type"
          ? "/api/product-types"
          : "/api/user-leave"
      }?`;
      const params_arr: string[] = [];

      if (params.pagination) {
        params_arr.push(`page=${params.pagination.current?.toString() || "1"}`);
        params_arr.push(
          `pageSize=${params.pagination.pageSize?.toString() || "10"}`
        );
      }

      if (params.sorters && params.sorters.length > 0) {
        params_arr.push(`sort=${params.sorters[0].field}`);
        params_arr.push(`order=${params.sorters[0].order}`);
      }

      apiUrl += params_arr.join("&");

      // 关闭浏览器缓存，确保列表是最新的
      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-store",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // 其他资源使用原始 Supabase 提供者
    return baseDataProvider.getList(params);
  },

  getOne: async (params) => {
    if (
      params.resource === "tb_product" ||
      params.resource === "tb_product_type" ||
      params.resource === "user_leave"
    ) {
      const base =
        params.resource === "tb_product"
          ? "/api/products"
          : params.resource === "tb_product_type"
          ? "/api/product-types"
          : "/api/user-leave";
      const response = await fetch(`${base}/${params.id}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    return baseDataProvider.getOne(params);
  },

  create: async (params) => {
    if (
      params.resource === "tb_product" ||
      params.resource === "tb_product_type" ||
      params.resource === "user_leave"
    ) {
      const base =
        params.resource === "tb_product"
          ? "/api/products"
          : params.resource === "tb_product_type"
          ? "/api/product-types"
          : "/api/user-leave";
      const response = await fetch(base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(params.variables),
        cache: "no-store",
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
    if (
      params.resource === "tb_product" ||
      params.resource === "tb_product_type" ||
      params.resource === "user_leave"
    ) {
      const base =
        params.resource === "tb_product"
          ? "/api/products"
          : params.resource === "tb_product_type"
          ? "/api/product-types"
          : "/api/user-leave";
      const response = await fetch(`${base}/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(params.variables),
        cache: "no-store",
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
    if (
      params.resource === "tb_product" ||
      params.resource === "tb_product_type" ||
      params.resource === "user_leave"
    ) {
      const base =
        params.resource === "tb_product"
          ? "/api/products"
          : params.resource === "tb_product_type"
          ? "/api/product-types"
          : "/api/user-leave";
      const response = await fetch(`${base}/${params.id}`, {
        method: "DELETE",
        headers: { "Cache-Control": "no-store" },
        cache: "no-store",
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
