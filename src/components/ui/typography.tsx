
import React from 'react';
import { cn } from '@/lib/utils';

interface ListProps extends React.HTMLAttributes<HTMLLIElement> {}
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const ListItem = React.forwardRef<HTMLLIElement, ListProps>(
    ({ className, ...props }, ref) => {
        return <li className={cn('', className)} ref={ref} {...props} />;
    },
);

ListItem.displayName = "List"

const Paragraph = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('leading-7 text-sm lg:text-md', className)} {...props} />
));

Paragraph.displayName = 'Paragraph';

const Heading1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn(
                    'scroll-m-20 md:text-2xl font-extrabold tracking-tight lg:text-5xl',
                    className,
                )}
                {...props}
            />
        );
    },
);

Heading1.displayName = 'Heading1';

const Heading2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn(
                    'scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);

Heading2.displayName = 'Heading2';

const Heading3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    'scroll-m-20 text-lg lg:text-xl font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);

Heading3.displayName = 'Heading3';

const Heading4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h4
                ref={ref}
                className={cn(
                    'scroll-m-20 text-base lg:text-lg font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);

Heading4.displayName = 'Heading4';

const Heading5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn('scroll-m-20 tracking-tight text-md lg:text-base', className)}
                {...props}
            />
        );
    },
);

Heading5.displayName = 'Heading5';

const Heading6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h6
                ref={ref}
                className={cn(
                    'scroll-m-20 tracking-tight text-sm lg:text-md',
                    className,
                )}
                {...props}
            />
        );
    },
);

Heading6.displayName = 'Heading6';


export {
    ListItem,
    Paragraph,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
};
