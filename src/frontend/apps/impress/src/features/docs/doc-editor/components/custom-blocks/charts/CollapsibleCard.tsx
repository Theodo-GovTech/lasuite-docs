import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { Box, Icon } from '@/components';

const Card = styled.div;

const CardHeader = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #111827;
`;

const CardContent = styled.div<{ isOpen: boolean }>``;

type CollapsibleCardProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box
      $css={css`
        background: #fff;
        border-radius: 0.5rem;
        box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
      `}
    >
      <CardHeader onClick={() => setIsOpen((prev) => !prev)}>
        {title}
        <Icon iconName={isOpen ? 'expand_less' : 'expand_more'}></Icon>
      </CardHeader>
      <Box
        $css={css`
          overflow: hidden;
          transition:
            opacity 0.3s ease,
            display 0.3s ease,
            padding 0.3s ease;
          padding: ${() => (isOpen ? '1rem 1.5rem' : '0 1.5rem')};
          opacity: ${() => (isOpen ? 1 : 0)};
          display: ${() => (isOpen ? 'bloc' : 'none')};
        `}
      >
        <CardContent isOpen={isOpen}>{children}</CardContent>
      </Box>
    </Box>
  );
};
