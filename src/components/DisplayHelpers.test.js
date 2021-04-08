const { calculateOutcome } = require('./DisplayHelpers');

const calculateOutcomeTests = [
  {
    description: 'No commands',
    input: {
      grid: { w: 5, h: 3 },
      rovers: [{ start: { x: 1, y: 1, direction: 'E' }, commands: '' }],
    },
    expectedResult: ['1 1 E'],
  },
  {
    description: 'Circular commands',
    input: {
      grid: { w: 5, h: 3 },
      rovers: [{ start: { x: 1, y: 1, direction: 'E' }, commands: 'RMRMRMRM' }],
    },
    expectedResult: ['1 1 E'],
  },
  {
    description: 'Rover going off the plateau',
    input: {
      grid: { w: 5, h: 3 },
      rovers: [{ start: { x: 3, y: 2, direction: 'N' }, commands: 'MRRMLLMMRRMLL' }],
    },
    expectedResult: ['3 3 N LOST'],
  },
  {
    description: 'Same rover learns and avoids going off the plateau',
    input: {
      grid: { w: 5, h: 3 },
      rovers: [
        { start: { x: 3, y: 2, direction: 'N' }, commands: 'MRRMLLMMRRMLL' },
        { start: { x: 3, y: 2, direction: 'N' }, commands: 'MRRMLLMMRRMLL' },
      ],
    },
    expectedResult: ['3 3 N LOST', '3 1 N'],
  },
  {
    description: 'Learning the boundaries on a small plateau',
    input: {
      grid: { w: 5, h: 3 },
      rovers: [
        { start: { x: 0, y: 0, direction: 'E' }, commands: 'MMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMM' },
        { start: { x: 0, y: 0, direction: 'E' }, commands: 'MMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMM' },
        { start: { x: 0, y: 0, direction: 'E' }, commands: 'MMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMM' },
        { start: { x: 0, y: 0, direction: 'E' }, commands: 'MMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMM' },
        { start: { x: 0, y: 0, direction: 'E' }, commands: 'MMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMMLMMMMMMMMMM' },
      ],
    },
    expectedResult: ['5 0 S LOST', '4 3 S LOST', '-1 2 S LOST', '0 -1 S LOST', '0 0 S'],
  },
];

calculateOutcomeTests.forEach((testCase) => {
  let input = testCase.input;
  let output = [];
  let scents = [];

  for (const n in input.rovers) output.push(calculateOutcome(input.rovers[n], scents, input));

  test(testCase.description, () => {
    expect(output).toStrictEqual(testCase.expectedResult);
  });
});
