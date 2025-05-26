import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label<{ required?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;

  ${({ required }) =>
    required &&
    css`
      &::after {
        content: ' *';
        color: ${({ theme }) => theme.colors.error};
      }
    `}
`;

const InputWrapper = styled.div<{ hasLeftIcon?: boolean; hasRightIcon?: boolean; error?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ hasLeftIcon }) =>
    hasLeftIcon &&
    css`
      padding-left: 2.5rem;
    `}

  ${({ hasRightIcon }) =>
    hasRightIcon &&
    css`
      padding-right: 2.5rem;
    `}
`;

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: 0.5rem 0.75rem;
        font-size: ${({ theme }) => theme.fontSizes.sm};
        min-height: 2rem;
      `;
    case 'md':
      return css`
        padding: 0.75rem 1rem;
        font-size: ${({ theme }) => theme.fontSizes.md};
        min-height: 2.5rem;
      `;
    case 'lg':
      return css`
        padding: 1rem 1.25rem;
        font-size: ${({ theme }) => theme.fontSizes.lg};
        min-height: 3rem;
      `;
    default:
      return css``;
  }
};

const StyledInput = styled.input<{ error?: boolean; size?: string; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  width: 100%;
  border: 2px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.gray[300])};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  transition: all 0.2s ease;

  ${({ size = 'md' }) => getSizeStyles(size)}

  ${({ hasLeftIcon }) =>
    hasLeftIcon &&
    css`
      padding-left: 2.5rem;
    `}

  ${({ hasRightIcon }) =>
    hasRightIcon &&
    css`
      padding-right: 2.5rem;
    `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary.main)};
    box-shadow: 0 0 0 3px ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary.light)}40;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    border-color: ${({ theme }) => theme.colors.gray[200]};
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.gray[400])};
  }
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => (position === 'left' ? 'left: 0.75rem;' : 'right: 0.75rem;')}
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.disabled};
  pointer-events: none;
  z-index: 1;
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
  margin-top: 0.25rem;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      error,
      disabled = false,
      required = false,
      fullWidth = false,
      size = 'md',
      leftIcon,
      rightIcon,
      className,
      id,
      name,
      autoComplete,
      autoFocus = false,
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : '';

    return (
      <InputContainer fullWidth={fullWidth} className={className}>
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <InputWrapper hasLeftIcon={Boolean(leftIcon)} hasRightIcon={Boolean(rightIcon)} error={hasError}>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            error={hasError}
            disabled={disabled}
            required={required}
            size={size}
            hasLeftIcon={Boolean(leftIcon)}
            hasRightIcon={Boolean(rightIcon)}
            id={id}
            name={name}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </InputWrapper>
        {hasError && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input; 