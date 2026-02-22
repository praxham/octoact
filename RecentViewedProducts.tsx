import { Avatar, Group, Image, Paper, Stack, Title } from '@mantine/core';
import { Link, useFetcher, useOutletContext } from 'react-router';

import { useCartStore } from '~/store/useCartStore';
import { COLORS } from '~/theme/themeConstants';
import { CartItem, OutletContext } from '~/types';
import { translate } from '~/utils/translator';
import { getAssetUrl } from '~/utils/utilities';
import AddRemoveCartButton from './AddRemoveCartButton';
import { IFeaturedProducts } from './FeaturedProducts';
import ProductMetaDataSummary from './Products/ProductMetaDataSummary';
import TruncatedTextWithTooltip from './TruncatedTextWithTooltip';
import NoImage from '/assets/fallbackImages/image.png';

interface RecentViewedProductsProps {
  data: IFeaturedProducts[];
}

const RecentViewedProducts: React.FC<RecentViewedProductsProps> = ({
  data,
}) => {
  const {
    language,
    user,
    isLoggedIn,
    env: { DIRECTUS_API_URL_EXTERNAL },
  } = useOutletContext<OutletContext>();

  const storedItemIds = useCartStore((state) => state.items);

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  // Get the product ID that's currently being processed
  const loadingProductId = fetcher.formData?.get('productId') as string;
  const cart = ((user?.cart && user?.cart[0]?.items) ||
    []) as unknown as CartItem[];

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Paper p={20} w={296} radius="xl">
      <Title size="xs" order={3} variant="semibold">
        {translate(language, 'products', 'RECENTLY_VIEWED')}
      </Title>

      <Stack mt={16} style={{ gap: 16 }}>
        {data.map(({ name, slug, featured_image, access_rules, id }) => {
          const isItemInCart = isLoggedIn
            ? cart?.some((item) => item.product === id)
            : storedItemIds.includes(id);
          const isThisProductLoading = isLoading && loadingProductId === id;
          const tooltipText = isItemInCart
            ? translate(language, 'cart', 'REMOVE_FROM_CART')
            : translate(language, 'cart', 'ADD_TO_CART');
          return (
            <Group key={slug} gap="xs2" wrap="nowrap">
              <Avatar
                size={41}
                src={getAssetUrl({
                  id: featured_image?.toString(),
                  DIRECTUS_API_URL_EXTERNAL,
                  height: 41,
                  width: 41,
                })}
                name={name!}
                component={Link}
                to={`/products/${slug}`}
                alt={`${name}'s avatar`}
              >
                <Image src={NoImage} h={40} w={40} />
              </Avatar>
              <Group style={{ gap: 4 }} align="top" wrap="nowrap">
                <Stack style={{ gap: 4 }}>
                  <TruncatedTextWithTooltip
                    size="lg"
                    label={name!}
                    redirectTo={`/products/${slug}`}
                    c={COLORS.greys.displayHeadingDark}
                  />
                  <ProductMetaDataSummary
                    access_rules={access_rules as any}
                    courseIconSize={16}
                    textSize="xs"
                  />
                </Stack>
                <AddRemoveCartButton
                  isThisProductLoading={isThisProductLoading}
                  tooltipText={tooltipText}
                  isItemInCart={isItemInCart}
                  id={id}
                />
              </Group>
            </Group>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default RecentViewedProducts;
