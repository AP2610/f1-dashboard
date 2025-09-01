import { cn } from '@/lib/utils/cn';

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingProps = {
  level: HeadingLevels;
  children: React.ReactNode;
  color?: 'purple' | 'black' | 'foreground' | 'light-gray' | 'dark-gray';
  as?: HeadingLevels;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  className?: string;
};

export const Heading = ({ level, as, children, className, color = 'foreground', weight = 'black' }: HeadingProps) => {
  const HeadingTag = level;

  const headingFontSizes = {
    h1: 'text-3xl md:text-4xl',
    h2: 'text-2xl md:text-3xl',
    h3: 'text-xl md:text-2xl',
    h4: 'text-lg md:text-xl',
    h5: 'text-lg',
    h6: 'text-base',
  };

  let headingFontSize;
  if ((as && as === level) || !as) {
    headingFontSize = headingFontSizes[level];
  } else if (as && as !== level) {
    headingFontSize = headingFontSizes[as];
  }

  const headingClasses = cn(
    headingFontSize,
    'font-sans',
    {
      'font-light': weight === 'light',
      'font-normal': weight === 'normal',
      'font-medium': weight === 'medium',
      'font-semibold': weight === 'semibold',
      'font-bold': weight === 'bold',
      'font-black': weight === 'black',
      'text-foreground': color === 'foreground',
      'text-black': color === 'black',
      'text-light-gray': color === 'light-gray',
      'text-dark-gray': color === 'dark-gray',
      'text-purple': color === 'purple',
    },
    className,
  );

  return <HeadingTag className={headingClasses}>{children}</HeadingTag>;
};
