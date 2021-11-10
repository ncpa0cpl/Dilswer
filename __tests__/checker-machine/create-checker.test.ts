import { createChecker, DataType } from "../../src";

describe("createChecker", () => {
  describe("for primitives", () => {
    it("should validate against a string", () => {
      const validator = DataType.String;

      const checker = createChecker(validator);

      expect(checker("foo")).toEqual(true);

      expect(checker(1)).toEqual(false);
      expect(checker(false)).toEqual(false);
      expect(checker(Symbol())).toEqual(false);
      expect(checker(() => ["foo"])).toEqual(false);
      expect(checker(["foo"])).toEqual(false);
      expect(checker({ foo: "foo" })).toEqual(false);
      expect(checker(new Set(["foo"]))).toEqual(false);
    });

    it("should validate against a number", () => {
      const validator = DataType.Number;

      const checker = createChecker(validator);

      expect(checker(1)).toEqual(true);

      expect(checker("foo")).toEqual(false);
      expect(checker(false)).toEqual(false);
      expect(checker(Symbol())).toEqual(false);
      expect(checker(() => ["foo"])).toEqual(false);
      expect(checker(["foo"])).toEqual(false);
      expect(checker({ foo: "foo" })).toEqual(false);
      expect(checker(new Set(["foo"]))).toEqual(false);
    });

    it("should validate against a boolean", () => {
      const validator = DataType.Boolean;

      const checker = createChecker(validator);

      expect(checker(false)).toEqual(true);
      expect(checker(true)).toEqual(true);

      expect(checker(1)).toEqual(false);
      expect(checker("foo")).toEqual(false);
      expect(checker(Symbol())).toEqual(false);
      expect(checker(() => ["foo"])).toEqual(false);
      expect(checker(["foo"])).toEqual(false);
      expect(checker({ foo: "foo" })).toEqual(false);
      expect(checker(new Set(["foo"]))).toEqual(false);
    });

    it("should validate against a symbol", () => {
      const validator = DataType.Symbol;

      const checker = createChecker(validator);

      expect(checker(Symbol())).toEqual(true);

      expect(checker(1)).toEqual(false);
      expect(checker("foo")).toEqual(false);
      expect(checker(false)).toEqual(false);
      expect(checker(() => ["foo"])).toEqual(false);
      expect(checker(["foo"])).toEqual(false);
      expect(checker({ foo: "foo" })).toEqual(false);
      expect(checker(new Set(["foo"]))).toEqual(false);
    });

    it("should validate against unknown", () => {
      const validator = DataType.Unknown;

      const checker = createChecker(validator);

      expect(checker(Symbol())).toEqual(true);
      expect(checker(1)).toEqual(true);
      expect(checker("foo")).toEqual(true);
      expect(checker(false)).toEqual(true);
      expect(checker(() => ["foo"])).toEqual(true);
      expect(checker(["foo"])).toEqual(true);
      expect(checker({ foo: "foo" })).toEqual(true);
      expect(checker(new Set(["foo"]))).toEqual(true);
    });
  });

  describe("for complex types", () => {
    describe("for unions", () => {
      it("should validate a union of string type", () => {
        const validator = DataType.OneOf(DataType.String);

        const checker = createChecker(validator);

        expect(checker("foobarbaz")).toEqual(true);

        expect(checker(1)).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
        expect(checker(() => {})).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate a union of number type", () => {
        const validator = DataType.OneOf(DataType.Number);

        const checker = createChecker(validator);

        expect(checker(1)).toEqual(true);

        expect(checker("foobarbaz")).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
        expect(checker(() => {})).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate a union of boolean type", () => {
        const validator = DataType.OneOf(DataType.Boolean);

        const checker = createChecker(validator);

        expect(checker(true)).toEqual(true);
        expect(checker(false)).toEqual(true);

        expect(checker("foobarbaz")).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker(0)).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
        expect(checker(() => {})).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate a union of string and numbers", () => {
        const validator = DataType.OneOf(DataType.String, DataType.Number);

        const checker = createChecker(validator);

        expect(checker("foo")).toEqual(true);
        expect(checker(123)).toEqual(true);

        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker(() => {})).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
      });

      it("should validate a union of booleans and symbols", () => {
        const validator = DataType.OneOf(DataType.Boolean, DataType.Symbol);

        const checker = createChecker(validator);

        expect(checker(false)).toEqual(true);
        expect(checker(true)).toEqual(true);
        expect(checker(Symbol())).toEqual(true);

        expect(checker("foo")).toEqual(false);
        expect(checker(123)).toEqual(false);
        expect(checker(() => {})).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate a union of functions, string and numbers", () => {
        const validator = DataType.OneOf(
          DataType.Function,
          DataType.String,
          DataType.Number
        );

        const checker = createChecker(validator);

        expect(checker("foo")).toEqual(true);
        expect(checker(123)).toEqual(true);
        expect(checker(() => {})).toEqual(true);

        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
      });

      it("should validate a union of functions, string and arrays of objects with foo property", () => {
        const validator = DataType.OneOf(
          DataType.Function,
          DataType.String,
          DataType.ArrayOf(
            DataType.RecordOf({
              foo: { type: DataType.String },
            })
          )
        );

        const checker = createChecker(validator);

        expect(checker("foo")).toEqual(true);
        expect(checker(() => {})).toEqual(true);
        expect(checker([])).toEqual(true);
        expect(checker([{ foo: "foo" }])).toEqual(true);

        expect(checker(123)).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([[]])).toEqual(false);
        expect(checker([{}])).toEqual(false);
        expect(checker([{ foo: 1 }])).toEqual(false);
        expect(checker(Symbol())).toEqual(false);
      });

      it("should validate for an array of string or array of number", () => {
        const validator = DataType.OneOf(
          DataType.ArrayOf(DataType.String),
          DataType.ArrayOf(DataType.Number)
        );

        const checker = createChecker(validator);

        expect(checker([])).toEqual(true);
        expect(checker(["foo", "bar", "baz"])).toEqual(true);
        expect(checker([1, 2, 3, 4])).toEqual(true);

        expect(checker(["foo", 1])).toEqual(false);
        expect(checker([1, 23, 4, 5, 6, 6, ""])).toEqual(false);
      });
    });

    describe("for arrays", () => {
      it("should validate against any array when type is unknown", () => {
        const validator = DataType.ArrayOf(DataType.Unknown);

        const checker = createChecker(validator);

        expect(checker([])).toEqual(true);
        expect(checker([1])).toEqual(true);
        expect(checker([""])).toEqual(true);
        expect(checker([true])).toEqual(true);
        expect(checker([Symbol()])).toEqual(true);
        expect(checker([{}])).toEqual(true);
        expect(checker([[]])).toEqual(true);

        expect(checker(1)).toEqual(false);
        expect(checker("")).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(false)).toEqual(false);
        expect(checker({})).toEqual(false);
      });

      it("should validate against simple array of string", () => {
        const validator = DataType.ArrayOf(DataType.String);

        const checker = createChecker(validator);

        expect(checker([])).toEqual(true);
        expect(checker(["foo"])).toEqual(true);

        expect(checker(["bar", 1])).toEqual(false);
        expect(checker([true])).toEqual(false);
        expect(checker({ 0: "baz" })).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(() => {})).toEqual(false);
      });

      it("should validate against array of functions or booleans", () => {
        const validator = DataType.ArrayOf(DataType.Function, DataType.Boolean);

        const checker = createChecker(validator);

        expect(checker([true, false])).toEqual(true);
        expect(checker([() => {}])).toEqual(true);
        expect(checker([true, () => {}, false])).toEqual(true);

        expect(checker(["bar", 1])).toEqual(false);
        expect(checker([true, 6])).toEqual(false);
        expect(checker([{}, false])).toEqual(false);
        expect(checker({ 0: "baz" })).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker(() => {})).toEqual(false);
      });

      it("should validate against nested arrays", () => {
        const validator = DataType.ArrayOf(
          DataType.ArrayOf(DataType.Number),
          DataType.ArrayOf(DataType.ArrayOf(DataType.String))
        );

        const checker = createChecker(validator);

        expect(checker([])).toEqual(true);
        expect(checker([[], [], []])).toEqual(true);
        expect(checker([[], [[]]])).toEqual(true);
        expect(checker([[], [["foo"]]])).toEqual(true);
        expect(checker([[1], [["foo"]]])).toEqual(true);

        expect(checker([[1], [[1]]])).toEqual(false);
        expect(checker([["1"]])).toEqual(false);
        expect(checker([[1], [[[]]]])).toEqual(false);
        expect(checker([[[["asd"]]]])).toEqual(false);
      });
    });

    describe("for records", () => {
      it("should validate for optional properties", () => {
        const validator = DataType.RecordOf({
          foo: { required: true, type: DataType.String },
          bar: { required: false, type: DataType.Number },
        });

        const checker = createChecker(validator);

        expect(checker({ foo: "foo" })).toEqual(true);
        expect(checker({ foo: "foo", bar: 1 })).toEqual(true);

        expect(checker({ foo: "foo", bar: "1" })).toEqual(false);
        expect(checker({ bar: 1 })).toEqual(false);
      });

      it("should validate for simple records", () => {
        const validator = DataType.RecordOf({
          foo: { type: DataType.String },
          bar: { type: DataType.Number },
          baz: { type: DataType.Unknown },
        });

        const checker = createChecker(validator);

        expect(checker({ foo: "foo", bar: 123, baz: true })).toEqual(true);
        expect(checker({ foo: "", bar: 0, baz: [] })).toEqual(true);
        expect(checker({ foo: "123", bar: -2, baz: () => {} })).toEqual(true);
        expect(checker({ foo: "123", bar: -2, baz: undefined })).toEqual(true);

        expect(checker({ foo: "foo", bar: "123", baz: true })).toEqual(false);
        expect(checker({ foo: "foo", bar: "123", baz: true })).toEqual(false);
        expect(checker({ foo: false, bar: 1, baz: true })).toEqual(false);
        expect(checker({ foo: "foo", bar: 123 })).toEqual(false);
        expect(checker({ foo: "", baz: undefined })).toEqual(false);
        expect(checker([])).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(76)).toEqual(false);
        expect(checker({})).toEqual(false);
      });

      it("should validate for nested records", () => {
        const validator = DataType.RecordOf({
          foo: { type: DataType.String },
          bar: {
            type: DataType.RecordOf({
              baz: { type: DataType.Number },
              qux: {
                type: DataType.RecordOf({
                  corge: { type: DataType.Function }
                }),
              },
            }),
          },
        });

        const checker = createChecker(validator);

        expect(
          checker({ foo: "foo", bar: { baz: 1, qux: { corge: () => {} } } })
        ).toEqual(true);

        expect(
          checker({ foo: 0, bar: { baz: 1, qux: { corge: () => {} } } })
        ).toEqual(false);
        expect(
          checker({ foo: "foo", bar: { baz: 1, qux: { corge: Symbol() } } })
        ).toEqual(false);
        expect(
          checker({ foo: "foo", bar: { baz: "1", qux: { corge: () => {} } } })
        ).toEqual(false);
      });
    });

    describe("for sets", () => {
      it("should validate for set of numbers", () => {
        const validator = DataType.SetOf(DataType.Number);

        const checker = createChecker(validator);

        expect(checker(new Set())).toEqual(true);
        expect(checker(new Set([1, 2, 3]))).toEqual(true);

        expect(checker(new Set([1, 2, 3, ""]))).toEqual(false);
        expect(checker(new Set([true]))).toEqual(false);
        expect(checker(new Set([Symbol()]))).toEqual(false);
        expect(checker(new Set([{}]))).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate for set of functions", () => {
        const validator = DataType.SetOf(DataType.Function);

        const checker = createChecker(validator);

        expect(checker(new Set())).toEqual(true);
        expect(checker(new Set([() => {}]))).toEqual(true);

        expect(checker(new Set([() => {}, "foo"]))).toEqual(false);
        expect(checker(new Set([true]))).toEqual(false);
        expect(checker(new Set([Symbol()]))).toEqual(false);
        expect(checker(new Set([{}]))).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });

      it("should validate for set of symbols or strings", () => {
        const validator = DataType.SetOf(DataType.Symbol, DataType.String);

        const checker = createChecker(validator);

        expect(checker(new Set())).toEqual(true);
        expect(checker(new Set([Symbol()]))).toEqual(true);
        expect(checker(new Set(["foo"]))).toEqual(true);
        expect(checker(new Set(["symbol", Symbol(), "foo", Symbol()]))).toEqual(
          true
        );

        expect(checker(new Set(["foo", Symbol(), () => {}]))).toEqual(false);
        expect(checker(new Set([true]))).toEqual(false);
        expect(checker(new Set([123]))).toEqual(false);
        expect(checker(new Set([{}]))).toEqual(false);
        expect(checker(1)).toEqual(false);
        expect(checker("foo")).toEqual(false);
        expect(checker(true)).toEqual(false);
        expect(checker({})).toEqual(false);
        expect(checker([])).toEqual(false);
      });
    });
  });
});