import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Naavi – On-Demand River & Lake Boat Booking App',
  description = 'Book verified motor boats, scenic river rides, private family boats, and electric boats on demand with transparent fares and 100% life-jacket compliance.',
}) => {
  useEffect(() => {
    document.title = title.includes('Naavi') ? title : `${title} | Naavi Boat Booking`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
