import composeEvery from "../composeEvery";

it(
  "composeEvery is requireable",
  () => {
    expect.assertions(1);
    expect(composeEvery).toBeTruthy();
  },
);

it(
  "it composes identity functions to produce passed value",
  () => {
    expect.assertions(2);
    const id = (x) => x;
    const f = composeEvery([id, id]);
    expect(f(true)).toEqual(true);
    expect(f(false)).toEqual(false);
  },
);

it(
  "it composes value generating functions",
  () => {
    expect.assertions(8);
    const yes = () => true;
    const no = () => false;
    expect(composeEvery([yes, yes])(true)).toEqual( true);
    expect(composeEvery([yes, yes])(false)).toEqual(true);
    expect(composeEvery([yes, no ])(true)).toEqual( false);
    expect(composeEvery([yes, no ])(false)).toEqual(false);
    expect(composeEvery([no,  yes])(true)).toEqual( false);
    expect(composeEvery([no,  yes])(false)).toEqual(false);
    expect(composeEvery([no,  no ])(true)).toEqual( false);
    expect(composeEvery([no,  no ])(false)).toEqual(false);
  },
);
