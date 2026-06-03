export type AdminMetricsResponse = Omit<
  PrescriptionMetrics,
  'totalPrescriptions' | 'prescriptionsInPeriod'
> & {
  period: AdminMetricsRequest;

  totals: TotalUserMetrics & TotalPrescriptionMetrics;
};

export type AdminMetricsRequest = {
  from: Date;
  to: Date;
};

export type TotalUserMetrics = {
  doctors: number;
  patients: number;
  newPatients: number;
};

export type TotalPrescriptionMetrics = {
  totalPrescriptions: number;
  prescriptionsInPeriod: number;
};

export type TotalPrescriptionByStatus = {
  pending: number;
  consumed: number;
};

export type TotalPrescriptionsPerDay = {
  date: string;
  count: number;
};

export type TopDoctorMetrics = {
  doctorId: string;
  doctorName: string;
  prescriptions: number;
};

export type PrescriptionMetrics = TotalPrescriptionMetrics & {
  byStatus: TotalPrescriptionByStatus;

  prescriptionsPerDay: TotalPrescriptionsPerDay[];

  topDoctors: TopDoctorMetrics[];
};
