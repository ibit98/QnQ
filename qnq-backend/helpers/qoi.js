const Constants = require("../constants");

function calculate_belief_coefficient(N) {
  return (
    1 /
    (1 +
      Constants.belief_asymptote *
        Math.exp(-Constants.belief_growth_rate * N)) **
      (1 / Constants.belief_nu)
  );
}

function calculate_uncertainty_coefficient(N) {
  if (N < Constants.N_thres) {
    return (
      Constants.w_u_max /
      (1 +
        Constants.uncertainty_asymptote *
          Math.exp(-Constants.uncertainty_growth_rate * N)) **
        (1 / Constants.uncertainty_nu)
    );
  }
  return Math.exp(-((N - Constants.N_thres) ** Constants.kohlrausch_factor));
}

function calculate_expected_truthfulness(reviewMeta) {
  N =
    reviewMeta.beliefCount +
    reviewMeta.disbeliefCount +
    reviewMeta.uncertaintyCount;

  belief_probability = (reviewMeta.beliefCount + 1) / (N + 3);
  uncertainty_probability = (reviewMeta.uncertaintyCount + 1) / (N + 3);

  return (
    calculate_belief_coefficient(N) * belief_probability +
    calculate_uncertainty_coefficient(N) * uncertainty_probability
  );
}

function calculate_QoI(reviewMeta) {
  tao_k = calculate_expected_truthfulness(reviewMeta);
  return Math.log(tao_k / (1 - tao_k));
}

module.exports = calculate_QoI;
