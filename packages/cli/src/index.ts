#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import wordListPath from "word-list";
import crypto, { randomInt } from "node:crypto";

const dictionary = await readFile(wordListPath, "utf-8");
const words = dictionary.split("\n").filter(Boolean);
const leet = {
  o: "0",
  l: "1",
  z: "2",
  a: "4",
  s: "5",
  t: "7",
  g: "9",
};
const leetLetterPattern = new RegExp(`[${Object.keys(leet).join("")}]`, "gu");

const getWord = (): string => {
  let word = "";

  do {
    const index = crypto.randomInt(0, words.length);
    word = words[index]!;
  } while (word.length < 3 || word.length > 8);

  return word[0]!.toUpperCase() + word.slice(1);
};

const getPassword = (): string => {
  let result = "";

  do {
    result += getWord();
  } while (result.length < 16 || !leetLetterPattern.test(result));

  const matches = [...result.matchAll(leetLetterPattern)];

  if (matches.length) {
    const match = matches[crypto.randomInt(0, matches.length)]!;
    const index = match.index!;
    const char = leet[match[0] as keyof typeof leet];

    result = result.slice(0, index) + char + result.slice(index + 1);
  } else {
    result += crypto.randomInt(0, 10);
  }

  return result;
};

const passwords = Array.from({ length: 40 }).map(() => getPassword());

console.clear();
console.log(passwords.join("\n"));
