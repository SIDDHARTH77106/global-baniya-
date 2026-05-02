'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { AppRole, SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

type CreateProductBundleInput = {
  productName: string;
  productTypeId: string;
  brandId?: string;
  imageUrl?: string;
  originalPrice: number;
  productSalePrice?: number;
  description?: string;
  productCode: string;
  colorId?: string;
  itemOriginalPrice: number;
  itemSalePrice?: number;
  sizeId?: string;
  qtyInStock: number;
};

const INVENTORY_PATHS = ['/admin/inventory', '/retailer/dashboard', '/wholesaler/dashboard'];

async function getSessionRole() {
  const cookieStore = await cookies();
  const session = readRoleSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  return session?.role ?? 'CUSTOMER';
}

async function requireRole(allowedRoles: AppRole[]) {
  const role = await getSessionRole();

  if (!allowedRoles.includes(role)) {
    throw new Error('You are not authorized to manage inventory.');
  }

  return role;
}

function parseWholeNumber(value: unknown, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative whole number.`);
  }

  return parsed;
}

function parseMoney(value: unknown, fieldName: string, required = true) {
  if ((value === undefined || value === null || value === '') && !required) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative amount.`);
  }

  return Number(parsed.toFixed(2));
}

function revalidateInventorySurfaces() {
  INVENTORY_PATHS.forEach((path) => revalidatePath(path));
}

async function touchInventoryActivity(
  executor: { $executeRawUnsafe: (query: string, ...values: unknown[]) => Promise<unknown> },
  productId: string,
  variantId?: string
) {
  try {
    await executor.$executeRawUnsafe('UPDATE `product` SET `updated_at` = NOW(3) WHERE `product_id` = ?', productId);

    if (variantId) {
      await executor.$executeRawUnsafe(
        'UPDATE `product_variant` SET `updated_at` = NOW(3) WHERE `variant_id` = ?',
        variantId
      );
    }
  } catch {
    // Older local databases may not have the optional activity columns yet.
  }
}

export async function updateVariantStock(variantId: string, newQty: number) {
  await requireRole(['ADMIN', 'RETAILER', 'WHOLESALER']);

  if (!variantId) {
    throw new Error('ProductVariant id is required.');
  }

  const qtyInStock = parseWholeNumber(newQty, 'qty_in_stock');

  await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.update({
      where: { variant_id: variantId },
      data: { qty_in_stock: qtyInStock },
      include: {
        productItem: {
          select: { product_id: true },
        },
      },
    });

    await touchInventoryActivity(tx, variant.productItem.product_id, variantId);
  });

  revalidateInventorySurfaces();

  return { success: true, qtyInStock };
}

export async function updateProductItemSalePrice(productItemId: string, newSalePrice: number) {
  await requireRole(['ADMIN']);

  if (!productItemId) {
    throw new Error('ProductItem id is required.');
  }

  const salePrice = parseMoney(newSalePrice, 'sale_price') as number;

  await prisma.$transaction(async (tx) => {
    const item = await tx.productItem.update({
      where: { product_item_id: productItemId },
      data: { sale_price: salePrice },
      select: { product_id: true },
    });

    await touchInventoryActivity(tx, item.product_id);
  });

  revalidateInventorySurfaces();

  return { success: true, salePrice };
}

export async function getLowStockAlerts() {
  await requireRole(['ADMIN', 'RETAILER', 'WHOLESALER']);

  return prisma.productVariant.findMany({
    where: { qty_in_stock: { lt: 10 } },
    orderBy: [{ qty_in_stock: 'asc' }, { variant_id: 'asc' }],
    include: {
      sizeOption: true,
      productItem: {
        include: {
          color: true,
          product: {
            include: {
              brand: true,
              productType: true,
            },
          },
        },
      },
    },
  });
}

export async function createProductBundle(input: CreateProductBundleInput) {
  await requireRole(['ADMIN']);

  const productName = input.productName.trim();
  const productCode = input.productCode.trim();

  if (!productName) throw new Error('Product name is required.');
  if (!productCode) throw new Error('Product code is required.');
  if (!input.productTypeId) throw new Error('Product type is required.');

  const originalPrice = parseMoney(input.originalPrice, 'Product original price') as number;
  const productSalePrice = parseMoney(input.productSalePrice, 'Product sale_price', false);
  const itemOriginalPrice = parseMoney(input.itemOriginalPrice, 'Item original price') as number;
  const itemSalePrice = parseMoney(input.itemSalePrice, 'Item sale_price', false);
  const qtyInStock = parseWholeNumber(input.qtyInStock, 'qty_in_stock');
  const imageUrl = input.imageUrl?.trim();

  const product = await prisma.$transaction(async (tx) => {
    let resolvedSizeId = input.sizeId?.trim();

    if (!resolvedSizeId || resolvedSizeId === 'DEFAULT') {
      const sizeCategory = await tx.sizeCategory.upsert({
        where: { category_name: 'Default' },
        update: {},
        create: { category_name: 'Default' },
      });

      const defaultSize = await tx.sizeOption.findFirst({
        where: {
          size_name: 'Free Size / Default',
          size_category_id: sizeCategory.size_category_id,
        },
      });

      resolvedSizeId =
        defaultSize?.size_id ??
        (
          await tx.sizeOption.create({
            data: {
              size_name: 'Free Size / Default',
              size_category_id: sizeCategory.size_category_id,
            },
          })
        ).size_id;
    }

    return tx.product.create({
      data: {
        product_name: productName,
        product_type: input.productTypeId,
        brand_id: input.brandId || null,
        original_price: originalPrice,
        sale_price: productSalePrice,
        product_desc: input.description?.trim() || null,
        productImages: imageUrl
          ? {
              create: {
                image_filename: imageUrl,
              },
            }
          : undefined,
        productItems: {
          create: {
            product_code: productCode,
            color_id: input.colorId || null,
            original_price: itemOriginalPrice,
            sale_price: itemSalePrice,
            productVariants: {
              create: {
                size_id: resolvedSizeId,
                qty_in_stock: qtyInStock,
              },
            },
          },
        },
      },
      include: {
        productItems: {
          include: {
            productVariants: true,
          },
        },
      },
    });
  });

  revalidateInventorySurfaces();

  return { success: true, productId: product.product_id };
}
