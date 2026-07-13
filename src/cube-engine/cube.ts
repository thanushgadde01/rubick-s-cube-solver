import Cube from "cubejs";

export type CubeMove = string;

let solverInitialized = false;

function ensureSolverInitialized() {
  if (!solverInitialized) {
    Cube.initSolver();
    solverInitialized = true;
  }
}

export function createSolvedCube() {
  const cube = new Cube();
  return cube;
}

export function createCubeFromScramble(scramble: string) {
  const cube = new Cube();
  cube.move(scramble);
  return cube;
}

export function solveCube(cube: InstanceType<typeof Cube>) {
  ensureSolverInitialized();
  return cube.solve();
}

export function scrambleCube() {
  ensureSolverInitialized();
  const cube = new Cube();
  const scramble = Cube.scramble();
  cube.move(scramble);
  const state = cube.asString();
  return { scramble, state };
}
