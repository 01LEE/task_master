import React from 'react';
import styled, { css } from 'styled-components';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthInfo {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

const Container = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const StrengthSegment = styled.div<{ isActive: boolean; color: string }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme, isActive, color }) =>
    isActive ? color : theme.colors.gray[200]};
  transition: background-color 0.2s ease;
`;

const StrengthLabel = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ color }) => color};
  margin-bottom: 0.25rem;
`;

const FeedbackList = styled.ul`
  margin: 0;
  padding-left: 1rem;
`;

const FeedbackItem = styled.li`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.125rem;
`;

const getPasswordStrength = (password: string): StrengthInfo => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length === 0) {
    return {
      score: 0,
      label: '',
      color: '#cbd5e0',
      feedback: [],
    };
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('최소 8자 이상 입력하세요');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('영문 소문자를 포함하세요');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('영문 대문자를 포함하세요');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('숫자를 포함하세요');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  const strengthLevels = [
    { label: '매우 약함', color: '#f56565' },
    { label: '약함', color: '#ed8936' },
    { label: '보통', color: '#ecc94b' },
    { label: '강함', color: '#48bb78' },
    { label: '매우 강함', color: '#38a169' },
  ];

  const level = Math.min(score, 4);
  
  return {
    score,
    label: strengthLevels[level].label,
    color: strengthLevels[level].color,
    feedback,
  };
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className,
}) => {
  const strength = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <Container className={className}>
      <StrengthBar>
        {[1, 2, 3, 4, 5].map((segment) => (
          <StrengthSegment
            key={segment}
            isActive={strength.score >= segment}
            color={strength.color}
          />
        ))}
      </StrengthBar>
      
      <StrengthLabel color={strength.color}>
        비밀번호 강도: {strength.label}
      </StrengthLabel>
      
      {strength.feedback.length > 0 && (
        <FeedbackList>
          {strength.feedback.map((item, index) => (
            <FeedbackItem key={index}>{item}</FeedbackItem>
          ))}
        </FeedbackList>
      )}
    </Container>
  );
};

export default PasswordStrength; 