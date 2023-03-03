export type BankNote = number;
export type Withdraw = Partial<Record<BankNote, number>>;

const euclideanDivision = (
  dividend: number,
  divisor: number
): {
  remainder: number;
  quotient: number;
} => {
  const remainder = dividend % divisor;
  const quotient = (dividend - remainder) / divisor;
  return {
    remainder,
    quotient,
  };
};

const internalAtm = (bankNotes: BankNote[], moneyToRedraw: number) => {
  const emptyWithdraw = {};
  if (moneyToRedraw === 0) {
    return emptyWithdraw;
  }

  const [greatestBankNote, ...otherBankNotes] = bankNotes;

  const { remainder, quotient } = euclideanDivision(moneyToRedraw, greatestBankNote);

  const withdraw = internalAtm(otherBankNotes, remainder);

  if (quotient > 0) {
    return { ...withdraw, [greatestBankNote]: quotient };
  }
  return withdraw;
};

const sortScoredWithdraw = (scoreArray: { withdraw: ScoredWithdraw; index: number }[]) => {
  if (scoreArray.length === 0) {
    throw new Error("");
  }
  return scoreArray.sort(
    (indexedScoredWithdraw1, indexedScoredWithdraw2) =>
      indexedScoredWithdraw1.withdraw.nbBankNotes - indexedScoredWithdraw2.withdraw.nbBankNotes
  );
};

type ScoredWithdraw = {
  withdraw: Partial<Record<BankNote, number>>;
  nbBankNotes: number;
};

type ATMFunctionType = (bankNotes: BankNote[], moneyToRedraw: number) => ScoredWithdraw;
const memoization = (internalAtm: ATMFunctionType): ATMFunctionType => {
  const memo = {};
  return (bankNotes: BankNote[], moneyToRedraw: number) => {
    if (memo[moneyToRedraw]) {
      return memo[moneyToRedraw];
    }
    const result = internalAtm(bankNotes, moneyToRedraw);
    memo[moneyToRedraw] = result;
    return result;
  };
};

const extractBestWithdraw = (
  scores: ScoredWithdraw[]
): {
  withdraw: ScoredWithdraw;
  index: number;
} => {
  const scoresWithBankNoteIndex = scores.map((scoredWithdraw, index) => ({ withdraw: scoredWithdraw, index }));
  return sortScoredWithdraw(scoresWithBankNoteIndex)[0];
};

const constructNewWithdraw = (bestWithdraw: ScoredWithdraw, bestBankNote: BankNote) => {
  if (bestWithdraw.withdraw[bestBankNote]) {
    const currentNbOfBestBankNote = bestWithdraw.withdraw[bestBankNote];
    return {
      withdraw: { ...bestWithdraw.withdraw, [bestBankNote]: currentNbOfBestBankNote + 1 },
      nbBankNotes: bestWithdraw.nbBankNotes + 1,
    };
  }
  return {
    withdraw: { ...bestWithdraw.withdraw, [bestBankNote]: 1 },
    nbBankNotes: bestWithdraw.nbBankNotes + 1,
  };
};

const createWorstScoredWithdraw = () => ({
  withdraw: {},
  nbBankNotes: Number.POSITIVE_INFINITY,
});
const emptyScoredWithdraw = () => ({
  withdraw: {},
  nbBankNotes: 0,
});

let recursiveInternalATM = (bankNotes: BankNote[], moneyToRedraw: number): ScoredWithdraw => {
  if (moneyToRedraw < 0) {
    return createWorstScoredWithdraw();
  }
  if (moneyToRedraw === 0) {
    return emptyScoredWithdraw();
  }

  const scores = bankNotes.map((bankNote) => recursiveInternalATM(bankNotes, moneyToRedraw - bankNote));

  //TODO perf: Passer en param supp le profondeur maximale avant laquelle on sera dtf au dessus du minimum donc pas besoin de fouiller plus
  const { withdraw: bestWithdraw, index } = extractBestWithdraw(scores);

  return constructNewWithdraw(bestWithdraw, bankNotes[index]);
};

recursiveInternalATM = memoization(recursiveInternalATM);

export const atm =
  (bankNotes: BankNote[]) =>
  (moneyToRedraw: number): Withdraw | string => {
    if (moneyToRedraw % Math.min(...bankNotes) !== 0) {
      return "Impossible to withdraw this amount";
    }
    return recursiveInternalATM(bankNotes, moneyToRedraw).withdraw;
  };
