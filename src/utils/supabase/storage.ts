// 这个文件现在只用于客户端的关键字生成，不直接操作Storage

// 图片上传现在通过 /api/upload 路由处理，这里只保留关键字生成功能

/**
 * 生成图片的关键字/标签
 * @param fileName 文件名
 * @param productName 产品名称
 * @param productType 产品类型
 * @returns 关键字数组
 */
export function generateImageKeywords(
  fileName: string,
  productName?: string,
  productType?: string
): string[] {
  const keywords: string[] = [];

  // 基础关键字
  keywords.push("product", "image", "metiokulto");

  // 从文件名提取关键字
  const nameKeywords = fileName
    .replace(/\.[^/.]+$/, "") // 移除扩展名
    .replace(/[_-]/g, " ") // 替换下划线和连字符为空格
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2);

  keywords.push(...nameKeywords);

  // 产品名称关键字
  if (productName) {
    const productKeywords = productName
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2);
    keywords.push(...productKeywords);
  }

  // 产品类型关键字
  if (productType) {
    keywords.push(productType);

    // 类型映射
    const typeMapping: Record<string, string[]> = {
      stair_treads: ["楼梯", "踏板", "stair", "treads"],
      stair_risers: ["楼梯", "立板", "stair", "risers"],
      stair_nosing: ["楼梯", "防滑条", "stair", "nosing"],
      accessories: ["配件", "accessories"],
    };

    if (typeMapping[productType]) {
      keywords.push(...typeMapping[productType]);
    }
  }

  // 去重并返回
  const uniqueKeywords = Array.from(new Set(keywords));
  return uniqueKeywords;
}
