import { describe, it, expect } from "vitest";
import { offlineNadirReply } from "./nadir-offline";

describe("offlineNadirReply", () => {
  it("uyqu mavzusini taniydi", () => {
    expect(offlineNadirReply("Ertalab tura olmayapman")).toMatch(/erta yot/i);
  });

  it("telefon qaramligini taniydi", () => {
    expect(offlineNadirReply("Doim telefonda scroll qilaman")).toMatch(/boshqa xonaga/i);
  });

  it("kechiktirishni taniydi", () => {
    expect(offlineNadirReply("Hammasini ertaga kechiktiraman")).toMatch(/Zeigarnik/);
  });

  it("noma'lum matnda ham foydali javob beradi", () => {
    const r = offlineNadirReply("qwerty asdf");
    expect(r.length).toBeGreaterThan(40);
    expect(r).toMatch(/Keyingi qadam/);
  });

  it("har doim offline ekanini bildiradi", () => {
    expect(offlineNadirReply("fokusim tarqoq")).toMatch(/Offline rejim/);
  });

  it("deterministik", () => {
    expect(offlineNadirReply("stress")).toBe(offlineNadirReply("stress"));
  });
});
