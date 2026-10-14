import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Naavi – River & Lake Boat Booking & Operations Platform',
  description = 'Discover and book verified river boat rides across 15 Varanasi Ganges Ghat zones with transparent fares and 100% life-jacket compliance.',
}) => {
  useEffect(() => {
    document.title = title.includes('Naavi') ? title : `${title} | Naavi River Platform`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
