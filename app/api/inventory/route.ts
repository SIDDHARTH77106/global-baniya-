import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

type InventorySubVariant = {
  id: string;
  productId: string;
  productName: string;
  brand: string | null;
  category: string | null;
  image: string | null;
  variantId: string;
  variantName: string;
  variantValue: string;
  value: string;
  unit: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  currency: string;
  stockQuantity: number;
  inStock: boolean;
};

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return 0;
}

function flattenInventory(products: Awaited<ReturnType<typeof getProducts>>) {
  return products.flatMap((product) =>
    product.variants.flatMap((variant) =>
      variant.subVariants.map<InventorySubVariant>((subVariant) => {
        const mrp = toNumber(subVariant.mrp);
        const sellingPrice = subVariant.sellingPrice ? toNumber(subVariant.sellingPrice) : mrp;

        return {
          id: subVariant.id,
          productId: product.id,
          productName: product.shortTitle,
          brand: product.brand,
          category: product.category,
          image: product.image,
          variantId: variant.id,
          variantName: variant.name,
          variantValue: variant.value,
          value: subVariant.value,
          unit: subVariant.unit,
          sku: subVariant.sku,
          mrp,
          sellingPrice,
          currency: subVariant.currency,
          stockQuantity: subVariant.stockQuantity,
          inStock: subVariant.stockQuantity > 0,
        };
      })
    )
  );
}

async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      variants: {
        orderBy: { sortOrder: 'asc' },
        include: {
          subVariants: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });
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
    const products = await getProducts();

    return NextResponse.json({
      success: true,
      products,
      inventory: flattenInventory(products),
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
    const { subVariantId, stockQuantity, mrp, sellingPrice } = await request.json();
    const parsedStock = Number(stockQuantity);

    if (!subVariantId || !Number.isInteger(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { success: false, error: 'subVariantId and a non-negative stockQuantity are required.' },
        { status: 400 }
      );
    }

    const updatedSubVariant = await prisma.subVariant.update({
      where: { id: subVariantId },
      data: {
        stockQuantity: parsedStock,
        ...(mrp !== undefined ? { mrp: Number(mrp) } : {}),
        ...(sellingPrice !== undefined ? { sellingPrice: Number(sellingPrice) } : {}),
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: updatedSubVariant.id,
        productId: updatedSubVariant.variant.product.id,
        productName: updatedSubVariant.variant.product.shortTitle,
        brand: updatedSubVariant.variant.product.brand,
        category: updatedSubVariant.variant.product.category,
        image: updatedSubVariant.variant.product.image,
        variantId: updatedSubVariant.variant.id,
        variantName: updatedSubVariant.variant.name,
        variantValue: updatedSubVariant.variant.value,
        value: updatedSubVariant.value,
        unit: updatedSubVariant.unit,
        sku: updatedSubVariant.sku,
        mrp: toNumber(updatedSubVariant.mrp),
        sellingPrice: updatedSubVariant.sellingPrice
          ? toNumber(updatedSubVariant.sellingPrice)
          : toNumber(updatedSubVariant.mrp),
        currency: updatedSubVariant.currency,
        stockQuantity: updatedSubVariant.stockQuantity,
        inStock: updatedSubVariant.stockQuantity > 0,
      },
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update inventory.' }, { status: 500 });
  }
}
