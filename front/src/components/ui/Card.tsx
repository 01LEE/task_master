import React from 'react';
import styled, { css } from 'styled-components';

export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'default':
      return css`
        background: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.gray[200]};
        box-shadow: ${({ theme }) => theme.shadows.sm};
      `;
    case 'outlined':
      return css`
        background: ${({ theme }) => theme.colors.surface};
        border: 2px solid ${({ theme }) => theme.colors.gray[300]};
        box-shadow: none;
      `;
    case 'elevated':
      return css`
        background: ${({ theme }) => theme.colors.surface};
        border: none;
        box-shadow: ${({ theme }) => theme.shadows.lg};
      `;
    case 'flat':
      return css`
        background: ${({ theme }) => theme.colors.surface};
        border: none;
        box-shadow: none;
      `;
    default:
      return css``;
  }
};

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 'none':
      return css`
        padding: 0;
      `;
    case 'sm':
      return css`
        padding: 1rem;
      `;
    case 'md':
      return css`
        padding: 1.5rem;
      `;
    case 'lg':
      return css`
        padding: 2rem;
      `;
    case 'xl':
      return css`
        padding: 2.5rem;
      `;
    default:
      return css``;
  }
};

const StyledCard = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.radii.xl};
  transition: all 0.2s ease;
  overflow: hidden;

  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ padding = 'md' }) => getPaddingStyles(padding)}

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      user-select: none;
    `}

  ${({ hover, clickable }) =>
    (hover || clickable) &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.xl};
      }
    `}

  ${({ clickable }) =>
    clickable &&
    css`
      &:active {
        transform: translateY(0);
      }
    `}
`;

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  children,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hover={hover}
      clickable={clickable}
      onClick={handleClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

// Sub-components for structured card content
const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CardContent = styled.div`
  margin-bottom: 1rem;
`;

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

// Export the main Card component and its sub-components
export default Card;
export { CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter }; 