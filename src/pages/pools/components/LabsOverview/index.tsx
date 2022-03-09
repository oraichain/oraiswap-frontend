//@ts-nocheck
import styled from 'styled-components';
import React, { useState } from 'react';
import Button from 'components/Button';
import { HideCreateNewPool } from 'config';
import { OsmoPrice } from './OsmoPrice';
import { RewardPayoutCountdown } from './RewardPayoutCountdown';
import useWindowSize from 'hooks/useWindowSize';

const CreateNewPoolDialog = ({ children }) => <div>{children}</div>;

export const LabsOverview = function LabsOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isMobileView } = useWindowSize();

  return (
    <div>
      <CreateNewPoolDialog
        dialogStyle={{ minWidth: '656px' }}
        isOpen={isDialogOpen}
        close={() => setIsDialogOpen(false)}
        isHideCloseButton
      />
      <OverviewTitle>
        <h5 className="flex-shrink-0">Active Pools</h5>
        {!HideCreateNewPool && !isMobileView && (
          <CreateButton onClick={() => setIsDialogOpen(true)}>
            Create New Pool
          </CreateButton>
        )}
      </OverviewTitle>

      <PriceWrapper as="ul">
        <OsmoPrice />
        <RewardPayoutCountdown />
        {/* <AllTVL /> */}
      </PriceWrapper>
    </div>
  );
};

const OverviewTitle = styled.div`
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const CreateButton = styled(Button)`
  margin-left: 24px;

  @media (min-width: 768px) {
    margin-left: 28px;
  }
`;

const PriceWrapper = styled.div`
  gap: 40px;

  @media (min-width: 768px) {
    gap: 80px;
  }
`;
