import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ClassValues = ClassValue | ClassValue[];

export const cn = (...classNames: ClassValues[]) => {
  return twMerge(clsx(classNames));
};
