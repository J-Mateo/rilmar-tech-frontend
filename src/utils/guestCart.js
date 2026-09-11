const STORAGE_KEY =
  'rilmartech_guest_cart_v1';

const MAX_ITEMS = 50;
const MAX_QUANTITY = 20;

const isBrowser = () =>
  typeof window !==
  'undefined';

const normalizeProductId = (
  value
) => {
  const productId =
    Number(value);

  if (
    !Number.isInteger(
      productId
    ) ||
    productId <= 0
  ) {
    return null;
  }

  return productId;
};

const normalizeQuantity = (
  value
) => {
  const quantity =
    Number(value);

  if (
    !Number.isInteger(
      quantity
    ) ||
    quantity <= 0
  ) {
    return null;
  }

  return Math.min(
    quantity,
    MAX_QUANTITY
  );
};

export const readGuestCart =
  () => {
    if (!isBrowser()) {
      return [];
    }

    try {
      const raw =
        window.localStorage
          .getItem(
            STORAGE_KEY
          );

      if (!raw) {
        return [];
      }

      const parsed =
        JSON.parse(raw);

      if (
        !Array.isArray(
          parsed
        )
      ) {
        return [];
      }

      const seen =
        new Set();

      const sanitized =
        [];

      for (
        const item of parsed
      ) {
        const productId =
          normalizeProductId(
            item?.productId
          );

        const quantity =
          normalizeQuantity(
            item?.quantity
          );

        if (
          !productId ||
          !quantity ||
          seen.has(productId)
        ) {
          continue;
        }

        seen.add(
          productId
        );

        sanitized.push({
          productId,
          quantity,
        });

        if (
          sanitized.length >=
          MAX_ITEMS
        ) {
          break;
        }
      }

      return sanitized;
    } catch {
      return [];
    }
  };

export const writeGuestCart =
  (items) => {
    if (!isBrowser()) {
      return;
    }

    const sanitized =
      [];

    const seen =
      new Set();

    for (
      const item of
        Array.isArray(items)
          ? items
          : []
    ) {
      const productId =
        normalizeProductId(
          item?.productId
        );

      const quantity =
        normalizeQuantity(
          item?.quantity
        );

      if (
        !productId ||
        !quantity ||
        seen.has(productId)
      ) {
        continue;
      }

      seen.add(
        productId
      );

      sanitized.push({
        productId,
        quantity,
      });

      if (
        sanitized.length >=
        MAX_ITEMS
      ) {
        break;
      }
    }

    if (
      sanitized.length === 0
    ) {
      window.localStorage
        .removeItem(
          STORAGE_KEY
        );

      return;
    }

    window.localStorage
      .setItem(
        STORAGE_KEY,
        JSON.stringify(
          sanitized
        )
      );
  };

export const addGuestCartItem =
  ({
    productId,
    quantity = 1,
  }) => {
    const cleanProductId =
      normalizeProductId(
        productId
      );

    const cleanQuantity =
      normalizeQuantity(
        quantity
      );

    if (
      !cleanProductId ||
      !cleanQuantity
    ) {
      return readGuestCart();
    }

    const cart =
      readGuestCart();

    const existing =
      cart.find(
        (item) =>
          item.productId ===
          cleanProductId
      );

    if (existing) {
      existing.quantity =
        Math.min(
          existing.quantity +
            cleanQuantity,
          MAX_QUANTITY
        );
    } else if (
      cart.length <
      MAX_ITEMS
    ) {
      cart.push({
        productId:
          cleanProductId,

        quantity:
          cleanQuantity,
      });
    }

    writeGuestCart(cart);

    return readGuestCart();
  };

export const updateGuestCartItem =
  ({
    productId,
    quantity,
  }) => {
    const cleanProductId =
      normalizeProductId(
        productId
      );

    const cleanQuantity =
      normalizeQuantity(
        quantity
      );

    if (
      !cleanProductId ||
      !cleanQuantity
    ) {
      return readGuestCart();
    }

    const nextCart =
      readGuestCart()
        .map((item) =>
          item.productId ===
          cleanProductId
            ? {
                ...item,
                quantity:
                  cleanQuantity,
              }
            : item
        );

    writeGuestCart(
      nextCart
    );

    return readGuestCart();
  };

export const removeGuestCartItem =
  (productId) => {
    const cleanProductId =
      normalizeProductId(
        productId
      );

    if (!cleanProductId) {
      return readGuestCart();
    }

    const nextCart =
      readGuestCart()
        .filter(
          (item) =>
            item.productId !==
            cleanProductId
        );

    writeGuestCart(
      nextCart
    );

    return readGuestCart();
  };

export const clearGuestCart =
  () => {
    if (!isBrowser()) {
      return;
    }

    window.localStorage
      .removeItem(
        STORAGE_KEY
      );
  };