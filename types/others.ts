export interface CountryProps {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

export interface PlatformStatisticsProps {
  noOfUsers: number;
  noOfActiveStarterSubscriptions: number;
  noOfActiveStudentSubscriptions: number;
  noOfActiveProfessionalSubscriptions: number;
  moneyMadeFromStudentPlan: number;
  moneyMadeFromProfessionalPlan: number;
  noOfProjectsCreated: number;
  noOfProjectsCompleted: number;
  noOfInstructionAnalyserRan: number;
}
