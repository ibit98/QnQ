import {
  BELIEF_ASYMPTOTE,
  BELIEF_GROWTH_RATE,
  BELIEF_NU,
  KOHLRAUSCH_FACTOR,
  N_THRES,
  UNCERTAINTY_ASYMPTOTE,
  UNCERTAINTY_GROWTH_RATE,
  UNCERTAINTY_NU,
  W_U_MAX,
} from "../constants";

import { ReviewMeta } from "../models/reviews";

const calculate_belief_coefficient = (N: number) =>
  1 /
  (1 + BELIEF_ASYMPTOTE * Math.exp(-BELIEF_GROWTH_RATE * N)) ** (1 / BELIEF_NU);

const calculateUncertaintyCoefficient = (N: number) => {
  if (N < N_THRES) {
    return (
      W_U_MAX /
      (1 + UNCERTAINTY_ASYMPTOTE * Math.exp(-UNCERTAINTY_GROWTH_RATE * N)) **
        (1 / UNCERTAINTY_NU)
    );
  }
  return Math.exp(-((N - N_THRES) ** KOHLRAUSCH_FACTOR));
};

const calculateExpectedTruthfulness = (reviewMeta: Omit<ReviewMeta, "QoI">) => {
  const N =
    reviewMeta.beliefCount +
    reviewMeta.disbeliefCount +
    reviewMeta.uncertaintyCount;

  const belief_probability = (reviewMeta.beliefCount + 1) / (N + 3);
  const uncertainty_probability = (reviewMeta.uncertaintyCount + 1) / (N + 3);

  return (
    calculate_belief_coefficient(N) * belief_probability +
    calculateUncertaintyCoefficient(N) * uncertainty_probability
  );
};

const calculateQoI = (reviewMeta: Omit<ReviewMeta, "QoI">) => {
  const tao_k = calculateExpectedTruthfulness(reviewMeta);
  return Math.log(tao_k / (1 - tao_k));
};

export default calculateQoI;
