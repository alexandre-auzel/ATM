// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import { atm, BankNote, Withdraw } from ".";

expect.extend(matchers);
const canonicalBankNotes: BankNote[] = [500, 200, 100, 50, 20, 10];
const nonCanonicalBankNotes: BankNote[] = [5, 4, 2, 1];

test("Should send back one banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 20;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    20: 1,
  };

  expect(result).toEqual(expected);
});

test("[Triangulation]: Should send back one banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 50;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    50: 1,
  };

  expect(result).toEqual(expected);
});

test("Should send back one banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 10;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    10: 1,
  };

  expect(result).toEqual(expected);
});

test("Should send back one banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 40;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    20: 2,
  };

  expect(result).toEqual(expected);
});

test("[Triangualtion]: Should send back one banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 400;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    200: 2,
  };

  expect(result).toEqual(expected);
});

test("Should send back several banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 300;
  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    100: 1,
    200: 1,
  };

  expect(result).toEqual(expected);
});

test("Should send back several banknote with right amount", () => {
  //GIVEN
  const moneyToRedraw = 8;
  //WHEN
  const result = atm(nonCanonicalBankNotes)(moneyToRedraw);
  //THEN
  const expected: Withdraw = {
    4: 2,
  };

  expect(result).toEqual(expected);
});

test("Should return a string if it is impossible to withdraw the right amount", () => {
  //GIVEN
  const moneyToRedraw = 113;

  //WHEN
  const result = atm(canonicalBankNotes)(moneyToRedraw);
  //THEN

  expect(result).toEqual("Impossible to withdraw this amount");
});
