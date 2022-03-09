import styled from 'styled-components';
import React from 'react';
import { IncentivizedPools } from './components/IncentivizedPools';
import { MyPools } from './components/MyPools';
import { AllPools } from './components/AllPools';
import { LabsOverview } from './components/LabsOverview';
import { ExtraIncentivizedPools } from './components/ExtraIncentives';
import { useFilteredExtraIncentivePools } from './components/ExtraIncentives/hook';

const PoolsPage = () => {
  const extraIncentivePools = useFilteredExtraIncentivePools();

  return (
    <PageContainer>
      <OverviewSection>
        <LabsOverview />
      </OverviewSection>

      <MyPoolsSection>
        <MyPools />
      </MyPoolsSection>

      <IncentivizedPoolsSection>
        <IncentivizedPools />
      </IncentivizedPoolsSection>

      {extraIncentivePools.length > 0 ? (
        <IncentivizedPoolsSection>
          <ExtraIncentivizedPools />
        </IncentivizedPoolsSection>
      ) : null}

      <AllPoolsSection>
        <AllPools />
      </AllPoolsSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: fit-content;
`;

const OverviewSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
    url('/assets/backgrounds/osmosis-pool-machine.png') no-repeat;
  background-size: cover;
  background-position-x: right;
  padding: 84px 20px 20px;

  @media (min-width: 768px) {
    background: url('/assets/backgrounds/osmosis-pool-machine.png') no-repeat;
    background-size: contain;
    background-position-x: right;
    padding: 40px;
  }
`;

const MyPoolsSection = styled.div`
  background-color: #1c173c;
  padding: 24px 20px;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const IncentivizedPoolsSection = styled.div`
	background-color: rgba(35, 29, 75, 1);
	padding: 24px 20px;

	@media (min-width: 768px) {
		padding: 40px;
`;

const AllPoolsSection = styled.div`
	background-color: #1c173c;
	padding: 24px 0;

	@media (min-width: 768px) {
		padding: 40px;
`;

export default PoolsPage;
