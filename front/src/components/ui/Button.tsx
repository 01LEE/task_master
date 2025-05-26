import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.secondary.main} 100%);
        color: ${({ theme }) => theme.colors.white};
        border: none;
        box-shadow: ${({ theme }) => theme.shadows.sm};

        &:hover:not(:disabled) {
          box-shadow: ${({ theme }) => theme.shadows.md};
          transform: translateY(-1px);
        }

        &:disabled {
          background: ${({ theme }) => theme.colors.gray[400]};
          box-shadow: none;
        }
      `;
    case 'secondary':
      return css`
        background: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.text.primary};
        border: 2px solid ${({ theme }) => theme.colors.gray[300]};

        &:hover:not(:disabled) {
          border-color: ${({ theme }) => theme.colors.primary.main};
          color: ${({ theme }) => theme.colors.primary.main};
        }

        &:disabled {
          background: ${({ theme }) => theme.colors.gray[100]};
          color: ${({ theme }) => theme.colors.text.disabled};
          border-color: ${({ theme }) => theme.colors.gray[200]};
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.primary.main};
        border: 2px solid ${({ theme }) => theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primary.main};
          color: ${({ theme }) => theme.colors.white};
        }

        &:disabled {
          color: ${({ theme }) => theme.colors.text.disabled};
          border-color: ${({ theme }) => theme.colors.gray[300]};
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.text.primary};
        border: none;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.gray[100]};
        }

        &:disabled {
          color: ${({ theme }) => theme.colors.text.disabled};
        }
      `;
    case 'danger':
      return css`
        background: ${({ theme }) => theme.colors.error};
        color: ${({ theme }) => theme.colors.white};
        border: none;

        &:hover:not(:disabled) {
          background: #e53e3e;
        }

        &:disabled {
          background: ${({ theme }) => theme.colors.gray[400]};
        }
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: 0.5rem 1rem;
        font-size: ${({ theme }) => theme.fontSizes.sm};
        min-height: 2rem;
      `;
    case 'md':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: ${({ theme }) => theme.fontSizes.md};
        min-height: 2.5rem;
      `;
    case 'lg':
      return css`
        padding: 1rem 2rem;
        font-size: ${({ theme }) => theme.fontSizes.lg};
        min-height: 3rem;
      `;
    case 'xl':
      return css`
        padding: 1.25rem 2.5rem;
        font-size: ${({ theme }) => theme.fontSizes.xl};
        min-height: 3.5rem;
      `;
    default:
      return css``;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ loading }) =>
    loading &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
    `}

  &:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className,
}) => {
  const handleClick = () => {
    if (!loading && !disabled && onClick) {
      onClick();
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      className={className}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button; 