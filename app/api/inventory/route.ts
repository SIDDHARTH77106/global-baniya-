import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

async function getProductVariants(availableOnly = false) {
  return prisma.productVariant.findMany({
    where: availableOnly ? { qty_in_stock: { gt: 0 } } : undefined,
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
              productImages: { take: 1 },
            },
          },
        },
      },
    },
  });
}

function serializeProductVariant(variant: Awaited<ReturnType<typeof getProductVariants>>[number]) {
  const productItem = variant.productItem;
  const product = productItem.product;
  const originalPrice = toNumber(productItem.original_price);
  const salePrice = productItem.sale_price ? toNumber(productItem.sale_price) : originalPrice;

  return {
    id: variant.variant_id,
    variant_id: variant.variant_id,
    product_item_id: variant.product_item_id,
    size_id: variant.size_id,
    size_name: variant.sizeOption.size_name,
    qty_in_stock: variant.qty_in_stock,
    quantity_in_stock: variant.qty_in_stock,
    inStock: variant.qty_in_stock > 0,
    product_item: {
      product_item_id: productItem.product_item_id,
      product_code: productItem.product_code,
      color_id: productItem.color_id,
      color_name: productItem.color?.color_name ?? null,
      original_price: originalPrice,
      sale_price: salePrice,
    },
    product: {
      product_id: product.product_id,
      id: product.product_id,
      name: product.product_name,
      product_name: product.product_name,
      description: product.product_desc,
      brand_name: product.brand?.brand_name ?? null,
      type_name: product.productType.type_name,
      image_filename: product.productImages[0]?.image_filename ?? null,
    },
  };
}

async function getProductStockTotals() {
  const totals = await prisma.productVariant.groupBy({
    by: ['product_item_id'],
    _sum: { qty_in_stock: true },
  });

  const productItems = await prisma.productItem.findMany({
    where: {
      product_item_id: {
        in: totals.map((total) => total.product_item_id),
      },
    },
    select: {
      product_item_id: true,
      product_id: true,
    },
  });

  const itemProductMap = new Map(
    productItems.map((item) => [item.product_item_id, item.product_id])
  );
  const productTotals = new Map<string, number>();

  for (const total of totals) {
    const productId = itemProductMap.get(total.product_item_id);
    if (!productId) continue;

    productTotals.set(
      productId,
      (productTotals.get(productId) ?? 0) + (total._sum.qty_in_stock ?? 0)
    );
  }

  return Array.from(productTotals.entries()).map(([product_id, qty_in_stock]) => ({
    product_id,
    qty_in_stock,
    inStock: qty_in_stock > 0,
  }));
}

function assertInventoryWriter(request: NextRequest) {
  const session = readRoleSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
  }

  if (session.role !== 'ADMIN' && session.role !== 'RETAILER') {
    return NextResponse.json({ success: false, error: 'Inventory access denied.' }, { status: 403 });
  }

  return null;
}

export async function GET() {
  try {
    const [variants, productStock] = await Promise.all([
      getProductVariants(true),
      getProductStockTotals(),
    ]);

    return NextResponse.json({
      success: true,
      inventory: variants.map(serializeProductVariant),
      productStock,
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const deniedResponse = assertInventoryWriter(request);
  if (deniedResponse) return deniedResponse;

  try {
    const { variantId, variant_id, qty_in_stock } = await request.json();
    const resolvedVariantId = variantId || variant_id;
    const parsedStock = Number(qty_in_stock);

    if (!resolvedVariantId || !Number.isInteger(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { success: false, error: 'variantId and a non-negative qty_in_stock are required.' },
        { status: 400 }
      );
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { variant_id: resolvedVariantId },
      data: { qty_in_stock: parsedStock },
      include: {
        sizeOption: true,
        productItem: {
          include: {
            color: true,
            product: {
              include: {
                brand: true,
                productType: true,
                productImages: { take: 1 },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: serializeProductVariant(updatedVariant),
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update inventory.' }, { status: 500 });
  }
}
